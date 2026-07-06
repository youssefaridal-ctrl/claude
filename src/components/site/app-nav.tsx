"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/site/theme-toggle";

const NAV = [
  { href: "/today", label: "Today" },
  { href: "/practice/tracker", label: "Practice" },
  { href: "/ledger", label: "Ledger" },
  { href: "/progress", label: "Progress" },
] as const;

/** Active-link matching: exact for /today, prefix for all others. */
function isActive(pathname: string, href: string) {
  return href === "/today" ? pathname === href : pathname.startsWith(href);
}

export function AppNavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="App" className="hidden gap-6 md:flex">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
          className={cn(
            "text-body-s transition-colors hover:text-foreground",
            isActive(pathname, item.href)
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="App navigation"
      className="glass fixed inset-x-0 bottom-0 z-50 flex h-16 items-stretch justify-around border-t md:hidden"
    >
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
          className={cn(
            "flex min-w-16 flex-col items-center justify-center text-label-mono transition-colors",
            isActive(pathname, item.href)
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppHeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Link
        href="/settings"
        className="text-body-s text-muted-foreground hover:text-foreground"
      >
        Settings
      </Link>
    </div>
  );
}
