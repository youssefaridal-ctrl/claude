"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

type State = "idle" | "saving" | "saved" | "error";

const TIMEZONES = [
  "UTC",
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Toronto", "America/Vancouver",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Amsterdam", "Europe/Stockholm",
  "Asia/Dubai", "Asia/Singapore", "Asia/Tokyo", "Asia/Seoul",
  "Australia/Sydney", "Pacific/Auckland",
];

export function ProfileForm({
  initialName,
  initialTimezone,
}: {
  initialName: string;
  initialTimezone: string;
}) {
  const [name, setName] = useState(initialName);
  const [timezone, setTimezone] = useState(initialTimezone || "UTC");
  const [state, setState] = useState<State>("idle");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, timezone }),
      });
      setState(res.ok ? "saved" : "error");
      if (res.ok) setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div>
        <Label htmlFor="profile-name">Display name</Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={80}
        />
      </div>

      <div>
        <Label htmlFor="profile-tz">Timezone</Label>
        <select
          id="profile-tz"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="mt-1 h-12 w-full rounded-r2 border border-border bg-background px-4 text-body-m focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={state === "saving"}>
          {state === "saving" ? "Saving…" : "Save changes"}
        </Button>
        {state === "saved" && <p className="text-body-s text-muted-foreground">Saved.</p>}
        {state === "error" && <p className="text-body-s text-destructive">Something went wrong. Please try again.</p>}
      </div>
    </form>
  );
}
