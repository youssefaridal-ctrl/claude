import Link from "next/link";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      ["Home", "/"],
      ["Method", "/method"],
      ["Programs", "/programs"],
      ["Pricing", "/pricing"],
      ["Stories", "/stories"],
    ],
  },
  {
    title: "Learn",
    links: [
      ["Academy", "/academy"],
      ["Courses", "/courses"],
      ["Library", "/library"],
      ["Blog", "/blog"],
      ["Podcast", "/podcast"],
    ],
  },
  {
    title: "Instruments",
    links: [
      ["The Lab", "/lab"],
      ["Tools", "/tools"],
      ["Resources", "/resources"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Community", "/community"],
      ["FAQ", "/faq"],
      ["Contact", "/contact"],
    ],
  },
] as const;

/** Global footer: ink-950 in both themes, manifesto line, legal row (design/03 §25). */
export function SiteFooter() {
  return (
    <footer className="bg-ink-950 text-bone-50">
      <div className="container py-16">
        <p className="mb-12 font-serif text-serif-feature">You are the author now.</p>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="eyebrow mb-4 !text-ink-300">{col.title}</h2>
              <ul className="space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-body-s text-ink-100 transition-colors hover:text-bone-50">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ink-700 pt-8 text-body-s text-ink-300 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} SELV. Built calm on purpose.</p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li><Link href="/legal/privacy" className="hover:text-bone-50">Privacy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-bone-50">Terms</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-bone-50">Cookies</Link></li>
              <li><Link href="/accessibility" className="hover:text-bone-50">Accessibility</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
