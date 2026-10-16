import type { Metadata } from "next";

import Auth from "@/components/studio/Auth";
import Studio from "@/components/studio/Studio";
import { currentUser, ownerExists } from "@/server/auth";
import { sql } from "@/server/db";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

// reads the session cookie, so never prerendered
export const dynamic = "force-dynamic";

/* not linked from anywhere. the address is not the security — the account
   is: one owner, password + emailed code to create, rate-limited sign-in */
export default async function Page() {
  if (!sql) {
    return (
      <main className="rail py-24">
        <h1 className="display text-3xl font-bold text-ink">The studio needs a database</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          Set <code className="mono text-ink">DATABASE_URL</code> (and{" "}
          <code className="mono text-ink">OWNER_EMAIL</code>) in <code className="mono text-ink">.env.local</code>,
          run <code className="mono text-ink">npm run db</code>, and reload. The README has the steps.
        </p>
      </main>
    );
  }

  const user = await currentUser();
  if (!user) return <Auth hasOwner={await ownerExists()} />;
  return <Studio email={user.email} />;
}
