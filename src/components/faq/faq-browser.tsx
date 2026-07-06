"use client";

import { useMemo, useState } from "react";
import { faqs } from "@/lib/mock";
import { Input, Label } from "@/components/ui/input";

/** FAQ with type-ahead filter (design/03 §20) — native details for zero-JS accordions. */
export function FaqBrowser() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((i) => `${i.q} ${i.a}`.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [query]);

  return (
    <div>
      <div className="max-w-md">
        <Label htmlFor="faq-search">Search the questions</Label>
        <Input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="refunds, therapy, journal…"
        />
      </div>
      <p aria-live="polite" className="sr-only">
        {filtered.reduce((n, c) => n + c.items.length, 0)} questions shown
      </p>

      {filtered.length === 0 && (
        <div className="mt-12 rounded-r3 border border-border bg-card p-8 text-center">
          <p className="font-serif text-serif-feature">Nothing matched.</p>
          <p className="mt-2 text-body-s text-muted-foreground">
            That's a question worth asking a human — write to us and a person answers within two business days.
          </p>
        </div>
      )}

      {filtered.map((cat) => (
        <section key={cat.category} className="mt-12" aria-label={cat.category}>
          <h2 className="eyebrow mb-4">{cat.category}</h2>
          {cat.items.map((item) => (
            <details key={item.q} className="group border-b border-border py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 text-body-m font-medium marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                {item.q}
                <span aria-hidden className="shrink-0 text-muted-foreground transition-transform duration-fast group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 max-w-2xl pb-2 text-body-m leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </section>
      ))}
    </div>
  );
}
