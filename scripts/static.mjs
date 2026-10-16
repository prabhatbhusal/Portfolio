// the public pages as plain files, for a static host (github pages,
// cloudflare pages): the routes that need a server — api, studio, media —
// are removed, then next exports the rest to out/. it deletes those routes
// from the checkout, so it only runs in ci, never on a working copy.
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

if (!process.env.CI) {
  console.error("build:static removes src/app/api, studio and media from the checkout. it runs in CI only.");
  process.exit(1);
}

for (const dir of ["src/app/api", "src/app/studio", "src/app/media"]) {
  rmSync(dir, { recursive: true, force: true });
}

execSync("next build", { stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1" } });
