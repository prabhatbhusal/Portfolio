// runs before `next build` (and on its own as `npm run db`): applies
// db/schema.sql, then — once, ever — copies the files in content/ into the
// database so the studio starts with everything the site already shows.
// without DATABASE_URL it does nothing and the site builds from those files.
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("db: no DATABASE_URL — building from the files in content/");
  process.exit(0);
}

const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
const read = (file) => JSON.parse(fs.readFileSync(path.join("content", file), "utf8"));

try {
  await sql.unsafe(fs.readFileSync("db/schema.sql", "utf8"));

  const [seeded] = await sql`select value from meta where key = 'seeded'`;
  if (!seeded) {
    const posts = fs
      .readdirSync("content/blog")
      .filter((file) => file.endsWith(".json"))
      .map((file) => read(`blog/${file}`));

    const kinds = {
      post: posts,
      project: read("projects.json"),
      game: read("games.json"),
      photo: read("photos.json"),
    };

    await sql.begin(async (tx) => {
      for (const [kind, items] of Object.entries(kinds)) {
        for (const [sort, data] of items.entries()) {
          await tx`
            insert into content (kind, slug, data, sort)
            values (${kind}, ${data.slug}, ${tx.json(data)}, ${sort})
            on conflict do nothing`;
        }
      }
      await tx`insert into meta (key, value) values ('seeded', ${new Date().toISOString()})`;
    });

    console.log(
      `db: seeded ${Object.entries(kinds).map(([k, v]) => `${v.length} ${k}s`).join(", ")}`
    );
  } else {
    console.log("db: schema up to date");
  }
} finally {
  await sql.end();
}
