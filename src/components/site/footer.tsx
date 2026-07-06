import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

const COLUMNS = [
  {
    title: "استكشف",
    links: [
      ["الرئيسية", "/"],
      ["المنهج", "/method"],
      ["البرامج", "/programs"],
      ["الأسعار", "/pricing"],
      ["القصص", "/stories"],
    ],
  },
  {
    title: "تعلّم",
    links: [
      ["الأكاديمية", "/academy"],
      ["الدورات", "/courses"],
      ["المكتبة", "/library"],
      ["المدونة", "/blog"],
      ["البودكاست", "/podcast"],
    ],
  },
  {
    title: "الأدوات",
    links: [
      ["المختبر", "/lab"],
      ["الأدوات", "/tools"],
      ["الموارد", "/resources"],
    ],
  },
  {
    title: "الشركة",
    links: [
      ["من نحن", "/about"],
      ["المجتمع", "/community"],
      ["الأسئلة الشائعة", "/faq"],
      ["تواصل معنا", "/contact"],
    ],
  },
] as const;

/** Global footer: ink-950 in both themes, manifesto line, legal row (design/03 §25). */
export function SiteFooter() {
  return (
    <footer className="bg-ink-950 text-bone-50">
      <div className="container py-16">
        <p className="mb-10 font-serif text-serif-feature">أنت الكاتب الآن.</p>

        {/* Force dark context so Input/Button vars resolve to Night values on this always-dark surface */}
        <div className="dark mb-16 max-w-lg">
          <p className="mb-4 font-mono text-label-mono uppercase tracking-[0.12em] text-ink-300">
            مقالة واحدة، كل أسبوع
          </p>
          <NewsletterForm />
        </div>

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
          <p>© {new Date().getFullYear()} SELV. بُني بهدوء متعمّد.</p>
          <nav aria-label="قانوني">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li><Link href="/legal/privacy" className="hover:text-bone-50">الخصوصية</Link></li>
              <li><Link href="/legal/terms" className="hover:text-bone-50">الشروط</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-bone-50">ملفات تعريف الارتباط</Link></li>
              <li><Link href="/accessibility" className="hover:text-bone-50">إمكانية الوصول</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
