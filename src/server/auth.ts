import { randomBytes, randomInt, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";
import { cookies } from "next/headers";

import { db, sql } from "./db";
import { HttpError, sha256 } from "./http";

// ------------------------------------------------------------------
// passwords — scrypt from node's own crypto, owasp's recommended cost
// ------------------------------------------------------------------

const COST: ScryptOptions = { N: 2 ** 17, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };

const derive = (password: string, salt: Buffer, length: number, options: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, length, options, (error, key) =>
      error ? reject(error) : resolve(key)
    )
  );

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await derive(password, salt, 32, COST);
  return `scrypt$${COST.N}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [, n, salt, key] = stored.split("$");
  const expected = Buffer.from(key, "base64url");
  const actual = await derive(password, Buffer.from(salt, "base64url"), expected.length, {
    ...COST,
    N: Number(n),
  });
  return timingSafeEqual(actual, expected);
}

/* checked against when the email is unknown, so "no such user" and "wrong
   password" take the same time and cannot be told apart */
let decoy: Promise<string> | undefined;
export const decoyHash = () => (decoy ??= hashPassword(randomBytes(16).toString("hex")));

export const checkPasswordRules = (password: string) => {
  if (password.length < 10) throw new HttpError(400, "Use at least 10 characters.");
  if (password.length > 200) throw new HttpError(400, "That password is too long.");
};

// ------------------------------------------------------------------
// the owner — sign-up only ever works for OWNER_EMAIL, and only once
// ------------------------------------------------------------------

export const ownerEmail = () => (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();

export async function ownerExists() {
  if (!sql) return false;
  const [row] = await sql`select exists (select 1 from users) as taken`;
  return row.taken as boolean;
}

// ------------------------------------------------------------------
// sessions — random token in an httpOnly cookie, its hash in the database
// ------------------------------------------------------------------

const PROD = process.env.NODE_ENV === "production";
// __Host- pins the cookie to this exact host, https only, path /
const COOKIE = PROD ? "__Host-session" : "session";
const DAYS = 30;

export async function startSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  await db()`
    insert into sessions (token_hash, user_id, expires_at)
    values (${sha256(token)}, ${userId}, now() + ${DAYS}::int * interval '1 day')`;
  // housekeeping rides along with logins rather than needing a cron
  await db()`delete from sessions where expires_at < now()`;

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: PROD,
    sameSite: "lax",
    path: "/",
    maxAge: DAYS * 86400,
  });
}

export async function currentUser(): Promise<{ id: number; email: string } | null> {
  if (!sql) return null;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [user] = await sql`
    select u.id, u.email from sessions s join users u on u.id = s.user_id
    where s.token_hash = ${sha256(token)} and s.expires_at > now()`;
  return (user as { id: number; email: string }) ?? null;
}

export async function requireOwner() {
  const user = await currentUser();
  if (!user) throw new HttpError(401, "Sign in first.");
  return user;
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token && sql) await sql`delete from sessions where token_hash = ${sha256(token)}`;
  jar.delete(COOKIE);
}

// ------------------------------------------------------------------
// emailed codes
// ------------------------------------------------------------------

type Purpose = "signup" | "reset";

/* a code proves the inbox, nothing more: the password is chosen alongside
   it, by whoever holds it. (storing the password at sign-up let anyone who
   knew OWNER_EMAIL swap in their own before the owner typed the code) */
export async function issueCode(email: string, purpose: Purpose) {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await db()`
    insert into auth_codes (email, purpose, code_hash, attempts, expires_at)
    values (${email}, ${purpose}, ${sha256(code)}, 0, now() + interval '10 minutes')
    on conflict (email, purpose) do update set
      code_hash = excluded.code_hash, attempts = 0, expires_at = excluded.expires_at`;
  return code;
}

/** true once — the code is deleted when it matches. five wrong guesses
 *  burn it, so six digits cannot be brute-forced */
export async function consumeCode(email: string, purpose: Purpose, code: string) {
  const [row] = await db()`
    update auth_codes set attempts = attempts + 1
    where email = ${email} and purpose = ${purpose} and expires_at > now() and attempts < 5
    returning code_hash`;
  if (!row) throw new HttpError(400, "That code has expired. Ask for a new one.");

  const given = Buffer.from(sha256(code.trim()));
  if (!timingSafeEqual(given, Buffer.from(row.code_hash))) {
    throw new HttpError(400, "That code is not right.");
  }

  await db()`delete from auth_codes where email = ${email} and purpose = ${purpose}`;
}
