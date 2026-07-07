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
      setError("لم يُحفظ — حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="secondary">
        + أضف دليلاً
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-r3 border border-border bg-card p-6">
      <h2 className="mb-4 text-heading-s font-medium">أضف دليلاً</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="ledger-text">ماذا حدث؟</Label>
          <Textarea
            id="ledger-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="تكلمت في الاجتماع رغم أن صوتي كان يرتجف."
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
            لأنني… <span className="text-muted-foreground">(اختياري)</span>
          </Label>
          <p className="mb-2 text-body-s text-muted-foreground">
            أكمل: "هذا مهم لأنني شخص يـ…"
          </p>
          <Input
            id="ledger-because"
            value={because}
            onChange={(e) => setBecause(e.target.value)}
            placeholder="يختار الانزعاج على الصمت"
            maxLength={500}
          />
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-body-s text-attention">{error}</p>}
      <div className="mt-4 flex gap-3">
        <Button type="submit" disabled={!text.trim() || saving}>
          {saving ? "يحفظ…" : "احفظه"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
