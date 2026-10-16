import { randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { db, hasDb } from "./db";
import { HttpError, sha256 } from "./http";

// ------------------------------------------------------------------
// passwords — pbkdf2-sha256 through web crypto, at owasp's iteration count.
// it runs natively on node and on cloudflare workers alike; scrypt at its
// recommended cost needs 128 MB, which is a whole worker's memory
// ------------------------------------------------------------------

const ITERATIONS = 600_000;

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password.normalize("NFKC")),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  return Buffer.from(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256));
}

export async function hashPassword(password: string) {
  const salt = new Uint8Array(randomBytes(16));
  const key = await derive(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${Buffer.from(salt).toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [, iterations, salt, key] = stored.split("$");
  const expected = Buffer.from(key, "base64url");
  const actual = await derive(password, new Uint8Array(Buffer.from(salt, "base64url")), Number(iterations));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
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
  if (!hasDb()) return false;
  const [row] = await db()`select exists (select 1 from users) as taken`;
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
  if (!hasDb()) return null;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [user] = await db()`
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
  if (token && hasDb()) await db()`delete from sessions where token_hash = ${sha256(token)}`;
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
