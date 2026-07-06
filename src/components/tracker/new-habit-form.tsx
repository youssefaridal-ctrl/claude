"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type FieldErrors = Record<string, string>;

export function NewHabitForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string).trim();
    const identityStatement = (fd.get("identityStatement") as string).trim();
    const cue = (fd.get("cue") as string | null)?.trim() || undefined;
    const twoMinuteVersion = (fd.get("twoMinuteVersion") as string | null)?.trim() || undefined;
    const targetPerWeek = Number(fd.get("targetPerWeek") ?? 4);

    const fe: FieldErrors = {};
    if (!name) fe.name = "Give this habit a name.";
    if (!identityStatement || identityStatement.length < 8)
      fe.identityStatement = "Complete the identity statement (at least 8 characters).";
    if (Object.keys(fe).length) { setErrors(fe); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, identityStatement, cue, twoMinuteVersion, targetPerWeek }),
      });
      if (res.ok) {
        router.push("/practice/tracker");
        router.refresh();
      } else {
        const data = (await res.json()) as { detail?: string };
        setServerError(data.detail ?? "Something went wrong on our side. Try once more.");
      }
    } catch {
      setServerError("Could not reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-8">
      <div>
        <Label htmlFor="name">Habit name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Morning run, Daily writing, Evening walk…"
          maxLength={120}
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={!!errors.name}
        />
        <FieldError id="name-error">{errors.name}</FieldError>
      </div>

      <div>
        <Label htmlFor="identityStatement">Identity statement</Label>
        <p className="mb-2 text-body-s text-muted-foreground">
          Complete: "I'm someone who…" — the habit belongs to this person, not a rule.
        </p>
        <Input
          id="identityStatement"
          name="identityStatement"
          placeholder="shows up for myself in the morning"
          maxLength={300}
          aria-describedby="is-hint is-error"
          aria-invalid={!!errors.identityStatement}
        />
        <p id="is-hint" className="mt-1 text-body-s text-muted-foreground">
          This becomes the "because" in every Ledger entry for this habit.
        </p>
        <FieldError id="is-error">{errors.identityStatement}</FieldError>
      </div>

      <div>
        <Label htmlFor="cue">
          Implementation intention <span className="text-muted-foreground">(optional)</span>
        </Label>
        <p className="mb-2 text-body-s text-muted-foreground">
          "After [cue], I will do this habit." Research doubles follow-through.
        </p>
        <Input
          id="cue"
          name="cue"
          placeholder="After I make my first coffee"
          maxLength={300}
        />
      </div>

      <div>
        <Label htmlFor="twoMinuteVersion">
          Two-minute version <span className="text-muted-foreground">(optional)</span>
        </Label>
        <p className="mb-2 text-body-s text-muted-foreground">
          The smallest version that still counts. On bad days, this is enough.
        </p>
        <Input
          id="twoMinuteVersion"
          name="twoMinuteVersion"
          placeholder="Put on my shoes and walk to the end of the block"
          maxLength={300}
        />
      </div>

      <div>
        <Label htmlFor="targetPerWeek">Weekly target</Label>
        <p className="mb-2 text-body-s text-muted-foreground">
          Days per week you aim to keep this habit. The goal is the week, not the streak.
        </p>
        <Select id="targetPerWeek" name="targetPerWeek" defaultValue="4" className="max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "day" : "days"} per week{n === 4 ? " (recommended)" : ""}
            </option>
          ))}
        </Select>
      </div>

      {serverError && (
        <p role="alert" className="text-body-s text-attention">
          {serverError}
        </p>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Adding…" : "Add habit"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
