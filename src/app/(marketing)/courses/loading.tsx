export default function Loading() {
  return (
    <div className="container py-s9 animate-pulse">
      <div className="mb-3 h-4 w-16 rounded bg-muted" />
      <div className="h-10 w-48 rounded bg-muted" />

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-r3 border border-border bg-card p-6">
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-5 w-20 rounded-full bg-muted" />
            </div>
            <div className="mt-4 h-6 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-4 w-full rounded bg-muted" />
            <div className="mt-1 h-4 w-5/6 rounded bg-muted" />
            <div className="mt-4 h-4 w-40 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
