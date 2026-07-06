"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type State = "idle" | "loading" | "done" | "error";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-body-m text-muted-foreground">
        You're on the list. We'll send one essay a week — no noise.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={className}>
      <div className="flex gap-3">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
          disabled={state === "loading"}
          className="max-w-xs"
        />
        <Button type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-body-s text-destructive">Something went wrong. Please try again.</p>
      )}
      <p className="mt-2 text-body-s text-muted-foreground">One essay a week. Unsubscribe any time.</p>
    </form>
  );
}
