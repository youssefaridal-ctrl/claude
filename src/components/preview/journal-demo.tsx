"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { previewJournal } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Textarea, Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Entry {
  id: string;
  title: string;
  excerpt: string;
  daysAgo: number;
}

/** Two-pane Journal preview (design/03 §29) — entries live in memory only. */
export function JournalDemo() {
  const [entries, setEntries] = useState<Entry[]>([...previewJournal]);
  const [selected, setSelected] = useState<string | null>(previewJournal[0]?.id ?? null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [composing, setComposing] = useState(false);

  const current = entries.find((e) => e.id === selected);

  function save() {
    const entry: Entry = {
      id: `new-${Date.now()}`,
      title: draftTitle.trim() || "بلا عنوان",
      excerpt: draftBody.trim(),
      daysAgo: 0,
    };
    setEntries([entry, ...entries]);
    setSelected(entry.id);
    setComposing(false);
    setDraftTitle("");
    setDraftBody("");
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      {/* Entries rail */}
      <div className="rounded-r3 border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="eyebrow">المدخلات</h2>
          <Button size="compact" variant="secondary" onClick={() => setComposing(true)}>
            جديد
          </Button>
        </div>
        <ul>
          {entries.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(e.id);
                  setComposing(false);
                }}
                aria-current={selected === e.id && !composing}
                className={cn(
                  "w-full border-b border-border p-4 text-left transition-colors duration-fast hover:bg-muted",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                  selected === e.id && !composing && "bg-muted",
                )}
              >
                <p className="text-body-s font-medium">{e.title}</p>
                <p className="mt-1 line-clamp-1 text-body-s text-muted-foreground">{e.excerpt}</p>
                <p className="mt-1 font-mono text-label-mono text-muted-foreground">
                  {e.daysAgo === 0 ? "اليوم" : `منذ ${e.daysAgo}ي`}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Canvas */}
      <div className="relative rounded-r3 border border-border bg-background p-8">
        <Badge className="absolute right-5 top-5">
          <Icon icon={Lock} size="inline" /> مشفَّر في التخزين
        </Badge>

        {composing ? (
          <div className="max-w-xl">
            <Label htmlFor="j-title">العنوان</Label>
            <Input id="j-title" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
            <div className="mt-5">
              <Label htmlFor="j-body">المدخل</Label>
              <Textarea
                id="j-body"
                rows={10}
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
                placeholder='قال الراوي… / اكتب "/حوار" لوضع الناقد في مواجهة المؤلف'
                className="font-serif text-body-l"
              />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Button onClick={save} disabled={!draftBody.trim()}>احفظ المدخل</Button>
              <span className="font-mono text-label-mono text-muted-foreground" aria-live="polite">
                {draftBody.trim() ? "مسودة — محفوظة محلياً" : ""}
              </span>
            </div>
          </div>
        ) : current ? (
          <article className="max-w-xl">
            <h2 className="font-serif text-heading-s">{current.title}</h2>
            <p className="mt-4 font-serif text-body-l leading-[1.75]">{current.excerpt}</p>
            <p className="mt-8 text-body-s text-muted-foreground">
              في التطبيق الكامل هذه اللوحة هي المحرر الحقيقي — أوامر مائلة (/موجّه، /دليل، /حوار)،
              تسجيل المزاج، وعرض المراجعة الأسبوعية.
            </p>
          </article>
        ) : null}
      </div>
    </div>
  );
}
