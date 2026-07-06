import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const APP_NAV = [
  { href: "/today", label: "Today" },
  { href: "/practice/tracker", label: "Practice" },
  { href: "/learn", label: "Learn" },
  { href: "/commons", label: "Commons" },
  { href: "/progress", label: "Progress" },
] as const;

/**
 * Member app shell: product nav on desktop, bottom tab bar on mobile
 * (design/02 §4). Server-side session gate backs up the middleware gate.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/today" className="font-mono text-label-mono uppercase tracking-[0.12em]" aria-label="SELV — Today">
            SELV
          </Link>
          <nav aria-label="App" className="hidden gap-6 md:flex">
            {APP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-s text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/settings" className="text-body-s text-muted-foreground hover:text-foreground">
            Settings
          </Link>
        </div>
      </header>

      <main id="main" className="flex-1 pb-24 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="App navigation"
        className="glass fixed inset-x-0 bottom-0 z-50 flex h-16 items-stretch justify-around border-t md:hidden"
      >
        {APP_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-w-16 flex-col items-center justify-center text-label-mono text-muted-foreground hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
