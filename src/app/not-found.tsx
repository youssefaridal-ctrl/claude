import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-label-mono uppercase text-muted-foreground">404</p>
      <h1 className="mt-4 text-display-m font-medium">Page not found.</h1>
      <p className="mt-4 text-body-m text-muted-foreground">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
