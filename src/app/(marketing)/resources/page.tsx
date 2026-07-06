import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Resources — real help, honest books, and when to seek therapy",
  description: "Crisis lines first. Then the reading list, with honest notes on every recommendation.",
  path: "/resources",
});

const BOOKS = [
  { title: "Chatter — Ethan Kross", note: "The distanced self-talk research, from the researcher. Where our Name-Switch drill comes from." },
  { title: "Feeling Good — David Burns", note: "The CBT classic. Dated tone, durable tools." },
  { title: "Self-Compassion — Kristin Neff", note: "The research case for dropping the whip." },
  { title: "Atomic Habits — James Clear", note: "Identity-based habit, popularized well." },
  { title: "Science Fictions — Stuart Ritchie", note: "How research overclaims — so you can read everyone, including us, more sharply." },
];

export default function ResourcesPage() {
  return (
    <div className="container max-w-3xl py-s9">
      <p className="eyebrow mb-3">Resources</p>
      <h1 className="text-display-l font-medium">Doors beyond ours.</h1>

      {/* Crisis band — always first, visually calm but unmissable */}
      <Card className="mt-10 border-l-2 bg-card" style={{ borderLeftColor: "hsl(210 25% 45%)" }}>
        <CardContent className="p-8">
          <h2 className="text-heading-s font-medium">If you're in crisis, start here — today, free.</h2>
          <ul className="mt-4 space-y-2 text-body-m text-muted-foreground">
            <li>· <strong className="text-foreground">988</strong> — Suicide & Crisis Lifeline (US), call or text, 24/7</li>
            <li>· <strong className="text-foreground">findahelpline.com</strong> — verified lines in most countries</li>
            <li>· Your local emergency number, if you're in immediate danger</li>
          </ul>
          <p className="mt-4 text-body-s text-muted-foreground">
            SELV is education and practice, not therapy. Asking for more help than an app can give is not a
            failure of the practice — it may be the bravest rep in it.
          </p>
        </CardContent>
      </Card>

      <section className="mt-14">
        <h2 className="eyebrow mb-4">When to seek therapy — the honest guide</h2>
        <p className="text-body-m text-muted-foreground">
          If your inner voice isn't a harsh narrator but persistent worthlessness or hopelessness; if
          anxiety disrupts sleep, work, or relationships for weeks; if there's trauma underneath the
          scripts — a good therapist works at depths our tools don't. Many members use both. Many
          therapists like it that way.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="eyebrow mb-4">The reading shelf — with honest notes</h2>
        <ul className="divide-y divide-border">
          {BOOKS.map((b) => (
            <li key={b.title} className="py-4">
              <p className="text-body-m font-medium">{b.title}</p>
              <p className="mt-1 text-body-s text-muted-foreground">{b.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
