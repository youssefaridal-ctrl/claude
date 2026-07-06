"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/method", label: "المنهج" },
  { href: "/programs", label: "البرامج" },
  { href: "/library", label: "المكتبة" },
  { href: "/lab", label: "المختبر" },
  { href: "/community", label: "المجتمع" },
  { href: "/stories", label: "القصص" },
  { href: "/pricing", label: "الأسعار" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-r2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <HamburgerIcon open={open} />
      </button>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-background"
        >
          <nav className="container py-8">
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block border-b border-border py-4 font-mono text-label-mono uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-4 pt-2">
              <Link
                href="/signin"
                className="text-body-m text-muted-foreground transition-colors hover:text-foreground"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/lab/audit"
                className="font-mono text-label-mono uppercase tracking-[0.12em] text-foreground"
              >
                ابدأ ←
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {open ? (
        <>
          <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
