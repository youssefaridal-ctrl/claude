"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-label-mono uppercase text-muted-foreground">Something went wrong</p>
      <h1 className="mt-4 text-display-m font-medium">We hit a snag.</h1>
      <p className="mt-4 text-body-m text-muted-foreground">
        An unexpected error occurred. It's been logged and we'll look at it.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="secondary">
          <Link href="/">Go home</Link>
        </Button>
      </div>
      {error.digest && (
        <p className="mt-6 font-mono text-label-mono text-muted-foreground">Ref: {error.digest}</p>
      )}
    </div>
  );
}
