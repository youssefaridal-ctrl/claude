import { episodes } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Inner Voice — conversations on becoming",
  description: "The SELV podcast: unhurried conversations with researchers, clinicians, and members. Every guest answers the same closing question.",
  path: "/podcast",
});

export default function PodcastPage() {
  return (
    <div className="container max-w-3xl py-s9">
      <p className="eyebrow mb-3">Podcast</p>
      <h1 className="text-display-l font-medium">The Inner Voice.</h1>
      <p className="mt-3 text-body-l text-muted-foreground">
        Conversations on becoming — with researchers, clinicians, and members. Every episode ends with the
        same two questions: <em>what does your inner voice say these days, verbatim?</em> and{" "}
        <em>what's the smallest rep you still do?</em>
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" size="compact">Apple Podcasts</Button>
        <Button variant="secondary" size="compact">Spotify</Button>
        <Button variant="ghost" size="compact">RSS</Button>
      </div>

      <ol className="mt-12">
        {episodes.map((e) => (
          <li key={e.number} className="border-b border-border">
            <details className="group py-6">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-6 marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                <span className="font-mono text-display-m text-muted-foreground/40" aria-hidden>
                  {String(e.number).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="block text-body-l font-medium">{e.title}</span>
                  <span className="block text-body-s text-muted-foreground">{e.guest}</span>
                </span>
                <span className="font-mono text-label-mono text-muted-foreground">{e.minutes} min</span>
              </summary>
              <div className="ml-[4.5rem] pb-2 pt-2">
                <div className="flex items-center gap-4 rounded-r3 border border-border bg-card p-4">
                  <Button size="compact" aria-label={`Play episode ${e.number}`}>Play ▸</Button>
                  <div className="h-1 flex-1 rounded-full bg-muted" aria-hidden>
                    <div className="h-full w-0 rounded-full bg-foreground" />
                  </div>
                  <span className="font-mono text-label-mono text-muted-foreground">00:00</span>
                </div>
                <p className="mt-3 text-body-s text-muted-foreground">
                  Full player, chaptered notes, and searchable transcript ship with the audio import.
                </p>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
