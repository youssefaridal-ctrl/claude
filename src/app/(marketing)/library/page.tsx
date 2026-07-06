import { LibraryBrowser } from "@/components/library/library-browser";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Library — essays, research, and doable exercises",
  description: "Everything we've written on confidence, inner dialogue, and identity — filterable, honest, and always ending in practice.",
  path: "/library",
});

export default function LibraryPage() {
  return (
    <div className="container py-s9">
      <p className="eyebrow mb-3">The Library</p>
      <h1 className="text-display-l font-medium">Read. Then do the rep.</h1>
      <p className="mt-3 max-w-xl text-body-l text-muted-foreground">
        Essays with the mechanism named, exercises with the time cost stated. No content dead-ends —
        everything here leads to something you can do today.
      </p>
      <div className="mt-10">
        <LibraryBrowser />
      </div>
    </div>
  );
}
