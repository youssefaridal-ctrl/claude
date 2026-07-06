export default function Loading() {
  return (
    <div className="container max-w-3xl py-s9 animate-pulse">
      <div className="mb-3 h-4 w-16 rounded bg-muted" />
      <div className="h-10 w-64 rounded bg-muted" />

      {/* featured post skeleton */}
      <div className="mt-12 border-b border-border pb-10">
        <div className="mb-3 h-4 w-32 rounded bg-muted" />
        <div className="h-8 w-3/4 rounded bg-muted" />
        <div className="mt-3 h-5 w-full rounded bg-muted" />
        <div className="mt-2 h-5 w-4/5 rounded bg-muted" />
        <div className="mt-4 h-4 w-40 rounded bg-muted" />
      </div>

      {/* list skeletons */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-b border-border py-8">
          <div className="mb-2 h-4 w-24 rounded bg-muted" />
          <div className="h-6 w-2/3 rounded bg-muted" />
          <div className="mt-2 h-4 w-full rounded bg-muted" />
          <div className="mt-3 h-4 w-36 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
