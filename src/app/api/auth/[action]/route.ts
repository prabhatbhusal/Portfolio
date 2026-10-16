import {
  checkPasswordRules,
  consumeCode,
  decoyHash,
  endSession,
  hashPassword,
  issueCode,
  ownerEmail,
  startSession,
  verifyPassword,
} from "@/server/auth";
import { db } from "@/server/db";
import { HttpError, clientKey, email, limit, readJson, route, str } from "@/server/http";
import { sendMail } from "@/server/mail";

const ok = (extra: Record<string, unknown> = {}) => Response.json({ ok: true, ...extra });

const codeMail = (to: string, code: string, what: string) =>
  sendMail({
    to,
    subject: `${code} is your studio code`,
    text: `${code}\n\nUse this code to ${what}. It expires in 10 minutes.\n\nIf this was not you, ignore this email — nothing changes without the code.`,
  });

/* one handler, one switch: /api/auth/login, /signup, /verify, /reset,
   /reset-confirm, /logout */
export const POST = route<{ action: string }>(async (req, { params }) => {
  const { action } = await params;

  if (action === "logout") {
    await endSession();
    return ok();
  }

  const body = await readJson(req, 8 * 1024);
  const ip = clientKey(req);
  const sql = db();

  switch (action) {
    case "login": {
      const address = email(body);
      const password = str(body, "password", 200);
      await limit(`login:${ip}`, 10, 900);
      await limit(`login:${address}`, 10, 900);

      const [user] = await sql`select id, password_hash from users where email = ${address}`;
      const match = await verifyPassword(password, user?.password_hash ?? (await decoyHash()));
      if (!user || !match) throw new HttpError(401, "Wrong email or password.");

      await startSession(user.id);
      return ok();
    }

    case "signup": {
      const address = email(body);
      await limit(`signup:${ip}`, 5, 3600);

      if (!ownerEmail()) throw new HttpError(503, "Set OWNER_EMAIL on the server first.");
      const [{ taken }] = await sql`select exists (select 1 from users) as taken`;
      if (taken || address !== ownerEmail()) throw new HttpError(403, "Sign-ups are closed.");
      // per address too, so nobody can flood the owner's inbox from many ips
      await limit(`signup:${address}`, 5, 3600);

      await codeMail(address, await issueCode(address, "signup"), "finish creating your studio account");
      return ok({ next: "verify" });
    }

    case "verify": {
      const address = email(body);
      const code = str(body, "code", 12);
      const password = str(body, "password", 200);
      // before the code is touched, so a weak password does not burn it
      checkPasswordRules(password);
      await limit(`verify:${ip}`, 20, 900);
      await limit(`verify:${address}`, 20, 900);

      await consumeCode(address, "signup", code);
      // the insert itself refuses a second account, even under a race
      const [user] = await sql`
        insert into users (email, password_hash)
        select ${address}, ${await hashPassword(password)} where not exists (select 1 from users)
        returning id`;
      if (!user) throw new HttpError(403, "Sign-ups are closed.");

      await startSession(user.id);
      return ok();
    }

    case "reset": {
      const address = email(body);
      await limit(`reset:${ip}`, 5, 3600);
      // every reset is a fresh code with five fresh guesses: capping them per
      // address keeps the guessing budget tiny whatever the ip
      await limit(`reset:${address}`, 5, 3600);

      const [user] = await sql`select id from users where email = ${address}`;
      if (user) await codeMail(address, await issueCode(address, "reset"), "reset your studio password");
      // the same answer either way, so this cannot be used to probe emails
      return ok({ next: "reset-confirm" });
    }

    case "reset-confirm": {
      const address = email(body);
      const code = str(body, "code", 12);
      const password = str(body, "password", 200);
      checkPasswordRules(password);
      await limit(`verify:${ip}`, 20, 900);
      await limit(`verify:${address}`, 20, 900);

      await consumeCode(address, "reset", code);
      const [user] = await sql`
        update users set password_hash = ${await hashPassword(password)}
        where email = ${address} returning id`;
      if (!user) throw new HttpError(400, "That code is not right.");

      // a reset signs every other device out
      await sql`delete from sessions where user_id = ${user.id}`;
      await startSession(user.id);
      return ok();
    }
  }

  throw new HttpError(404, "Unknown action.");
});
