import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";

/**
 * Legal template with the Plain-Language Layer (design/03 §23): every section
 * opens with a plain-words card; counsel-reviewed full text replaces the
 * placeholders before launch.
 */

const DOCS: Record<string, { title: string; sections: { heading: string; plain: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      { heading: "What we collect", plain: "Your email, your practice data, and what you choose to write. First-party analytics only — no ad trackers, ever." },
      { heading: "Your journal", plain: "Encrypted before it's stored, keys kept apart from your words. If our database leaked, your words wouldn't. Full end-to-end encryption is on our public roadmap." },
      { heading: "Your rights", plain: "Export everything in Settings. Deletion means deletion — gone within 30 days, not deactivated." },
    ],
  },
  terms: {
    title: "Terms of Service",
    sections: [
      { heading: "The deal", plain: "You get the tools and content for the tier you pay for. Cancel in two clicks. 30-day refund, no interrogation." },
      { heading: "What SELV is not", plain: "Education and practice, not therapy or medical care — and we say so everywhere it matters." },
      { heading: "Your content", plain: "Your words stay yours. We never sell data, and the Commons' "what's shared here stays here" rule binds us too." },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    sections: [
      { heading: "What we set", plain: "A session cookie to keep you signed in, and a theme preference. That's the list." },
      { heading: "What we don't", plain: "No ad cookies, no cross-site trackers, no fingerprinting. The site works fully if you decline everything optional." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const d = DOCS[doc];
  if (!d) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({ title: d.title, path: `/legal/${doc}` });
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const d = DOCS[doc];
  if (!d) notFound();

  return (
    <div className="container max-w-[680px] py-s9">
      <p className="eyebrow mb-3">Legal</p>
      <h1 className="text-display-l font-medium">{d.title}</h1>
      <p className="mt-3 font-mono text-label-mono text-muted-foreground">Last updated: prototype draft · v0</p>

      <div className="mt-12 space-y-10">
        {d.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-heading-s font-medium">{s.heading}</h2>
            <div className="mt-3 rounded-r3 bg-card p-5">
              <p className="eyebrow mb-2">In plain words</p>
              <p className="text-body-m">{s.plain}</p>
            </div>
            <p className="mt-3 text-body-s text-muted-foreground">
              [Full legal text for this section arrives with counsel review — the plain-language card above
              is binding on our conduct in the meantime.]
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
