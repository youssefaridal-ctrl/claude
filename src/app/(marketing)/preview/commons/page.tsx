import { CommonsDemo } from "@/components/preview/commons-demo";

export default function PreviewCommonsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <p className="eyebrow mb-2">The Commons</p>
      <h1 className="text-display-m font-medium">Do the quiet work in good company.</h1>
      <p className="mt-2 text-body-m text-muted-foreground">
        Every post declares what it&rsquo;s seeking. The only reaction is &ldquo;I see you.&rdquo;
      </p>
      <div className="mt-10">
        <CommonsDemo />
      </div>
    </div>
  );
}
