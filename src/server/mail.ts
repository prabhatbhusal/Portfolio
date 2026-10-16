import { HttpError } from "./http";

/** sends a plain-text email through resend. plain text on purpose: the
 *  contact form forwards strangers' words, and text cannot carry markup.
 *  without a key, dev prints the email to the terminal instead */
export async function sendMail(mail: { to: string; subject: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[mail → ${mail.to}] ${mail.subject}\n${mail.text}\n`);
      return;
    }
    throw new HttpError(503, "Email is not configured yet.");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      // until a domain is verified in resend, only onboarding@resend.dev can
      // send, and only to the address the resend account was opened with
      from: process.env.MAIL_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    console.error("resend", res.status, await res.text());
    throw new HttpError(502, "The email could not be sent right now.");
  }
}

/* where owner mail goes: CONTACT_TO if set, otherwise the owner's login email */
export const ownerInbox = () => process.env.CONTACT_TO ?? process.env.OWNER_EMAIL ?? "";
