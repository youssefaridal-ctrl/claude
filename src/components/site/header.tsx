import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/method", label: "Method" },
  { href: "/programs", label: "Programs" },
  { href: "/library", label: "Library" },
  { href: "/lab", label: "Lab" },
  { href: "/community", label: "Community" },
  { href: "/stories", label: "Stories" },
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

        <div className="flex items-center gap-3">
          <Link href="/pricing" className="hidden text-body-s text-muted-foreground hover:text-foreground sm:block">
            Pricing
          </Link>
          {session?.user ? (
            <Button asChild size="compact" variant="secondary">
              <Link href="/today">Open SELV</Link>
            </Button>
          ) : (
            <>
              <Link href="/signin" className="text-body-s text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
              <Button asChild size="compact">
                <Link href="/lab/audit">Begin</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
