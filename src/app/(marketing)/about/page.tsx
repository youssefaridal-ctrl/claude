import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About — built by people who needed it",
  description: "SELV started as a 2 a.m. question: if the inner voice is learned, why is nobody teaching the rewrite?",
  path: "/about",
});

const CHAPTERS = [
  { title: "I. The notebook.", body: "The first version of the Method was a private system: index cards of harsh thoughts on one side, rebuilt sentences on the other, and a rule — no sentence gets rebuilt with a lie. It had to be believable or the mind spat it out. That rule survived everything that came after." },
  { title: "II. The reading.", body: "We went looking for permission to hope, and found something better: mechanisms. Decades of research on reappraisal, self-distancing, expressive writing, and identity-based habit — rigorous, replicated, and almost entirely absent from the self-help shelf. The science existed. The translation didn't." },
  { title: "III. The others.", body: "We shared the system with friends who “had it together.” Every single one had a narrator. Competence, we learned, doesn't quiet the critic. It just gives it better material." },
  { title: "IV. The build.", body: "We assembled the team this work deserved: clinicians to keep it honest, researchers to keep it accurate, writers to keep it human. We wrote three bans into the founding documents: no hype, no shame, no pretending this replaces therapy." },
  { title: "V. The point.", body: "We measure success in a strange way for a subscription business: we design for graduation. The goal is that one day you notice you've stopped needing us — and that the voice you think with, finally, is yours." },
];

const VALUES = [
  { name: "Depth over hype", receipt: "Our articles cite sources or say plainly when evidence is thin. Check any footnote." },
  { name: "Precision", receipt: "Every exercise names its mechanism and time cost. No vague “do this, feel better.”" },
  { name: "Agency", receipt: "Nothing autoplays, nothing is mandatory, and every reminder can be silenced in one tap." },
  { name: "Warm rigor", receipt: "Our error messages will never blame you. Neither will our emails." },
  { name: "Radical accessibility", receipt: "WCAG 2.2 AAA target, audited twice a year, known issues published." },
  { name: "Privacy as dignity", receipt: "Your journal is encrypted in storage, keys kept apart from words — and full end-to-end encryption is on the public roadmap." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-background py-s9">
        <div className="container max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-4">About SELV</p>
            <h1 className="text-display-l font-medium">Built by people who needed it.</h1>
            <p className="mt-6 text-body-l text-muted-foreground">
              SELV didn't start as a company. It started as a question one of us wrote in a notebook at
              2 a.m., after another day of performing confidence we didn't have: <em>if the inner voice is
              learned, why is nobody teaching the rewrite?</em>
            </p>
          </Reveal>

          <div className="mt-14 space-y-10">
            {CHAPTERS.map((c, i) => (
              <Reveal key={c.title} delay={Math.min(i, 5) * 0.05}>
                <div>
                  <h2 className="font-serif text-serif-feature">{c.title}</h2>
                  <p className="mt-3 text-body-l leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="bg-ink-950 py-s10 text-center text-bone-50">
        <div className="container max-w-2xl space-y-6">
          <Reveal><p className="font-serif text-serif-feature">We believe the inner voice is not fate. It is a draft.</p></Reveal>
          <Reveal delay={0.1}>
            <p className="text-body-l text-ink-300">
              We choose architecture over adrenaline. Evidence over inspiration. Practice over performance.
              Depth over noise.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-serif text-serif-feature text-solar-500">You are the author now. Begin.</p>
          </Reveal>
        </div>
      </section>

      {/* Values in practice */}
      <section className="bg-background py-s9">
        <div className="container max-w-3xl">
          <Reveal><h2 className="text-display-m font-medium">Values, with receipts.</h2></Reveal>
          <div className="mt-8">
            {VALUES.map((v) => (
              <details key={v.name} className="group border-b border-border py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-body-m font-medium marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                  {v.name}
                  <span aria-hidden className="text-muted-foreground transition-transform duration-fast group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-2 pb-2 text-body-s text-muted-foreground">{v.receipt}</p>
              </details>
            ))}
          </div>
          <Separator className="mt-10" />
          <div className="mt-10 text-center">
            <p className="text-body-l text-muted-foreground">
              Belief is a fine place to start. Mechanism is a better place to stand.
            </p>
            <Button asChild className="mt-6">
              <Link href="/method">Read how the Method works</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
