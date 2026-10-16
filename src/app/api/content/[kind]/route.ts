import { revalidatePath } from "next/cache";

import { validateItem } from "@/lib/content/kinds";
import { requireOwner } from "@/server/auth";
import { kindOf } from "@/server/content";
import { db } from "@/server/db";
import { HttpError, readJson, route } from "@/server/http";

/** everything in a collection, drafts included — the studio's list */
export const GET = route<{ kind: string }>(async (_req, { params }) => {
  const kind = kindOf((await params).kind);
  await requireOwner();
  const rows = await db()`
    select slug, data, sort, published, updated_at from content
    where kind = ${kind} order by sort, updated_at desc`;
  return Response.json(rows);
});

/** create or update one record. `previous` is the slug it was loaded under,
 *  so changing the address moves the record instead of copying it */
export const POST = route<{ kind: string }>(async (req, { params }) => {
  const kind = kindOf((await params).kind);
  await requireOwner();

  const body = await readJson(req, 1024 * 1024);
  let data;
  try {
    data = validateItem(kind, body.data);
  } catch (error) {
    throw new HttpError(400, (error as Error).message);
  }

  const previous = typeof body.previous === "string" ? body.previous : null;
  const published = body.published !== false;
  const sort = Number.isInteger(body.sort) ? (body.sort as number) : 0;
  const sql = db();

  await sql.begin(async (tx) => {
    if (previous !== data.slug) {
      const [clash] = await tx`select 1 from content where kind = ${kind} and slug = ${data.slug}`;
      if (clash) throw new HttpError(409, `Something already lives at /${data.slug}. Pick another address.`);
      if (previous) await tx`delete from content where kind = ${kind} and slug = ${previous}`;
    }
    await tx`
      insert into content (kind, slug, data, sort, published, updated_at)
      values (${kind}, ${data.slug}, ${tx.json(data as never)}, ${sort}, ${published}, now())
      on conflict (kind, slug) do update set
        data = excluded.data, sort = excluded.sort,
        published = excluded.published, updated_at = now()`;
  });

  // a handful of pages show any given record (lists, menus, footer,
  // sitemap) — refreshing the whole site is simpler than tracking which
  revalidatePath("/", "layout");
  return Response.json({ slug: data.slug });
});
