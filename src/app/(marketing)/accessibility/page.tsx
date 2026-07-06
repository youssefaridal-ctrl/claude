import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Accessibility Statement — WCAG 2.2 AAA, with receipts",
  description: "Our target, our current status, our known issues — published, with a priority feedback channel.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <div className="container max-w-[680px] py-s9">
      <p className="eyebrow mb-3">Accessibility</p>
      <h1 className="text-display-l font-medium">Transformation is for every body and mind.</h1>

      <div className="mt-10 space-y-10 text-body-m leading-relaxed">
        <section>
          <h2 className="text-heading-s font-medium">Our target</h2>
          <p className="mt-3 text-muted-foreground">
            WCAG 2.2 Level AAA is our working target — 7:1 text contrast, full keyboard operation, visible
            focus everywhere, 44px touch targets, no timeouts on exercises, transcripts and captions on
            everything, and reduced motion as a first-class experience, not a fallback.
          </p>
        </section>
        <section>
          <h2 className="text-heading-s font-medium">Current status</h2>
          <p className="mt-3 text-muted-foreground">
            Prototype phase: automated checks run in CI; the token palette is AAA-validated in both themes;
            keyboard and reduced-motion journeys are covered by our test suite. The first full external
            audit is scheduled before public launch, and its results — including everything we failed —
            will be published here.
          </p>
        </section>
        <section>
          <h2 className="text-heading-s font-medium">Known issues</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Podcast prototype players are visual placeholders — full accessible players ship with the audio import.</li>
            <li>The Audit results radar is not yet rendered; scores are announced in text.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-heading-s font-medium">Tell us what's broken — priority channel</h2>
          <p className="mt-3 text-muted-foreground">
            access@selv.com reaches a human with authority to prioritize fixes. Accessibility reports jump
            the queue. That's policy, in writing, on the page.
          </p>
        </section>
      </div>
    </div>
  );
}
