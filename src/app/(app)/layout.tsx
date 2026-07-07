import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = "force-static";
import { AppNavLinks, AppBottomNav, AppHeaderActions } from "@/components/site/app-nav";

/**
 * Member app shell: glass header with active-link nav (client island),
 * mobile bottom tab bar, server-side session gate (design/02 §4).
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  let session = null;
  try {
    session = await auth();
  } catch {
    // auth() unavailable during static export — render sign-in prompt below
  }
  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="font-mono text-label-mono uppercase tracking-widest text-muted-foreground">SELV</p>
        <h1 className="text-display-m font-medium">تسجيل الدخول مطلوب</h1>
        <p className="text-body-m text-muted-foreground">هذه الصفحة متاحة للأعضاء فقط.</p>
        <Link href="/signin" className="mt-2 underline underline-offset-4">تسجيل الدخول</Link>
      </div>
    );
  }

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
