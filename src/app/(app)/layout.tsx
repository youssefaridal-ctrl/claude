import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppNavLinks, AppBottomNav, AppHeaderActions } from "@/components/site/app-nav";

/**
 * Member app shell: glass header with active-link nav (client island),
 * mobile bottom tab bar, server-side session gate (design/02 §4).
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/today"
            className="font-mono text-label-mono uppercase tracking-[0.12em]"
            aria-label="SELV — Today"
          >
            SELV
          </Link>
          <AppNavLinks />
          <AppHeaderActions />
        </div>
      </header>

      <main id="main" className="flex-1 pb-24 md:pb-0">
        {children}
      </main>

      <AppBottomNav />
    </div>
  );
}
