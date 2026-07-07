"use client";

import { useState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Entry {
  id: string;
  text: string;
  source: string;
  createdAt: string;
}

const SOURCE_LABELS: Record<string, string> = {
  REP: "تمرين",
  HABIT: "عادة",
  CHALLENGE: "تحدٍّ",
  JOURNAL: "مذكرة",
  MANUAL: "دليل",
};

export function CounterEvidence() {
  const [doubt, setDoubt] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!doubt.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const res = await fetch(`/api/ledger?counter=${encodeURIComponent(doubt.trim())}`);
      const data = (await res.json()) as { entries: Entry[]; total: number };
      setEntries(data.entries);
      setTotal(data.total);
      setSearched(true);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="rounded-r3 border border-border bg-card p-6"
      aria-label="بحث الأدلة المضادة"
    >
      <h2 className="text-heading-s font-medium">بحث الأدلة المضادة</h2>
      <p className="mt-2 text-body-s text-muted-foreground">
        اكتب شكاً أو فكرة نقد ذاتي. سيبحث السجل عن إدخالات تُعقّد هذه الفكرة.
      </p>
      <form onSubmit={search} className="mt-4 flex gap-3">
        <div className="flex-1">
          <Label htmlFor="ce-input" className="sr-only">شك أو فكرة نقد ذاتي</Label>
          <Input
            id="ce-input"
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
            placeholder={`"أنا لست جيداً في التعبير عن نفسي"`}
            aria-label="شك أو فكرة نقد ذاتي"
          />
        </div>
        <Button type="submit" disabled={!doubt.trim() || loading} variant="secondary">
          {loading ? "يبحث…" : "ابحث"}
        </Button>
      </form>

      {searched && (
        <div className="mt-6" aria-live="polite">
          {entries.length === 0 ? (
            <p className="text-body-s text-muted-foreground">
              لا يوجد في سجلك بعد إدخالات تطابق هذا الشك — لكنها ستأتي. كل تمرين يضيف دليلاً.
            </p>
          ) : (
            <>
              <p className="mb-4 text-body-s text-muted-foreground">
                {entries.length} من أصل {total} إدخالاً تخالف هذه الفكرة:
              </p>
              <ul className="space-y-3">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className={cn(
                      "rounded-r2 border border-border bg-background p-4",
                    )}
                  >
                    <p className="font-serif text-body-l">&ldquo;{entry.text}&rdquo;</p>
                    <p className="mt-2 font-mono text-label-mono uppercase text-muted-foreground">
                      {SOURCE_LABELS[entry.source] ?? entry.source} ·{" "}
                      {new Date(entry.createdAt).toLocaleDateString("ar-SA", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
