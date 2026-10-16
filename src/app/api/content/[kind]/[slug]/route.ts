import { revalidatePath } from "next/cache";

import { requireOwner } from "@/server/auth";
import { kindOf } from "@/server/content";
import { db } from "@/server/db";
import { HttpError, route } from "@/server/http";

export const GET = route<{ kind: string; slug: string }>(async (_req, { params }) => {
  const { kind, slug } = await params;
  await requireOwner();
  const [row] = await db()`
    select slug, data, sort, published, updated_at from content
    where kind = ${kindOf(kind)} and slug = ${slug}`;
  if (!row) throw new HttpError(404, "Not found.");
  return Response.json(row);
});

export const DELETE = route<{ kind: string; slug: string }>(async (_req, { params }) => {
  const { kind, slug } = await params;
  await requireOwner();
  await db()`delete from content where kind = ${kindOf(kind)} and slug = ${slug}`;
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
});
