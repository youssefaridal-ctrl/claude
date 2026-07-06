import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { MobileNav } from "@/components/site/mobile-nav";

const NAV = [
  { href: "/method", label: "المنهج" },
  { href: "/programs", label: "البرامج" },
  { href: "/library", label: "المكتبة" },
  { href: "/lab", label: "المختبر" },
  { href: "/community", label: "المجتمع" },
  { href: "/stories", label: "القصص" },
] as const;

/** Marketing header: 64px glass chrome (design/03 §nav, design/04 §10). */
export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="glass sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-mono text-label-mono uppercase tracking-[0.12em]" aria-label="SELV home">
          SELV
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-body-s text-muted-foreground transition-colors duration-fast hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/pricing" className="hidden text-body-s text-muted-foreground hover:text-foreground sm:block">
            الأسعار
          </Link>
          {session?.user ? (
            <Button asChild size="compact" variant="secondary">
              <Link href="/today">افتح سيلف</Link>
            </Button>
          ) : (
            <>
              <Link href="/signin" className="hidden text-body-s text-muted-foreground hover:text-foreground md:block">
                تسجيل الدخول
              </Link>
              <Button asChild size="compact" className="hidden md:inline-flex">
                <Link href="/lab/audit">ابدأ</Link>
              </Button>
            </>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
