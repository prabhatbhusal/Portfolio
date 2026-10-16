import { requireOwner } from "@/server/auth";
import { db } from "@/server/db";
import { HttpError, readJson, route } from "@/server/http";

export const GET = route(async () => {
  await requireOwner();
  const rows = await db()`
    select id, name, email, budget, body, read, created_at from messages
    order by created_at desc limit 200`;
  return Response.json(rows);
});

/** { id, read } marks a message; { id, delete: true } removes it */
export const POST = route(async (req) => {
  await requireOwner();
  const body = await readJson(req, 1024);
  if (!Number.isInteger(body.id)) throw new HttpError(400, "id is required.");

  if (body.delete === true) await db()`delete from messages where id = ${body.id as number}`;
  else await db()`update messages set read = ${body.read === true} where id = ${body.id as number}`;
  return Response.json({ ok: true });
});
