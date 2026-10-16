import { sql } from "@/server/db";
import { route } from "@/server/http";

/* the host's deploy healthcheck (railway.json): a new build only takes
   traffic once it answers, and a broken database fails it */
export const GET = route(async () => {
  if (sql) await sql`select 1`;
  return Response.json({ ok: true });
});
