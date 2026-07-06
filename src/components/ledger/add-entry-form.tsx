"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea, Input, Label } from "@/components/ui/input";

export function AddEntryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [because, setBecause] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          becauseClause: because.trim() || undefined,
          source: "MANUAL",
          themeTags: [],
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setText("");
      setBecause("");
      setOpen(false);
      router.refresh();
    } catch {
      setError("Didn't save — try once more.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="secondary">
        + Add evidence
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-r3 border border-border bg-card p-6">
      <h2 className="mb-4 text-heading-s font-medium">Add a piece of evidence</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="ledger-text">What happened?</Label>
          <Textarea
            id="ledger-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I spoke up in the meeting even though my voice shook."
            rows={3}
            maxLength={500}
            className="font-serif"
            required
          />
          <p className="mt-1 text-right text-body-s text-muted-foreground">
            {text.length}/500
          </p>
        </div>
        <div>
          <Label htmlFor="ledger-because">
            Because… <span className="text-muted-foreground">(optional)</span>
          </Label>
          <p className="mb-2 text-body-s text-muted-foreground">
            Complete: "This matters because I'm someone who…"
          </p>
          <Input
            id="ledger-because"
            value={because}
            onChange={(e) => setBecause(e.target.value)}
            placeholder="chooses discomfort over silence"
            maxLength={500}
          />
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-body-s text-attention">{error}</p>}
      <div className="mt-4 flex gap-3">
        <Button type="submit" disabled={!text.trim() || saving}>
          {saving ? "Saving…" : "File it"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
