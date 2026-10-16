import { sql } from "@/server/db";
import { HttpError, clientKey, email, limit, readJson, route, str } from "@/server/http";
import { ownerInbox, sendMail } from "@/server/mail";

/* one line, no control characters — it goes into a subject header */
const oneLine = (value: string) => value.replace(/[\r\n\t]+/g, " ").trim();

export const POST = route(async (req) => {
  const body = await readJson(req, 16 * 1024);

  // a field humans never see; bots fill in everything. accept and drop
  if (typeof body.company === "string" && body.company) return Response.json({ ok: true });

  const name = oneLine(str(body, "name", 120));
  const from = email(body);
  const message = str(body, "message", 5000);
  const budget = typeof body.budget === "string" ? oneLine(body.budget).slice(0, 40) : "";

  // without a database there is nowhere to count requests, so production
  // refuses rather than becoming an open relay. the form falls back to mailto
  if (!sql) {
    if (process.env.NODE_ENV === "production") throw new HttpError(503, "The form is offline.");
  } else {
    await limit(`contact:${clientKey(req)}`, 5, 3600);
    await sql`insert into messages (name, email, budget, body) values (${name}, ${from}, ${budget}, ${message})`;
  }

  const to = ownerInbox();
  if (!to) throw new HttpError(503, "The form is offline.");

  try {
    await sendMail({
      to,
      subject: `Portfolio enquiry from ${name}`,
      replyTo: from,
      text: `${message}\n\n—\n${name} <${from}>\nBudget: ${budget || "not given"}`,
    });
  } catch (error) {
    // saved in the studio inbox already — a mail hiccup is not the sender's problem
    if (!sql) throw error;
    console.error(error);
  }

  return Response.json({ ok: true });
});
