"use client";

import { useMemo, useState } from "react";
import { previewDelta, previewLedger } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { chart } from "@/lib/design-tokens";

/** Quarterly Delta radar — pure SVG on chart tokens; current vs. last quarter. */
function DeltaRadar() {
  const { dimensions, current, previous } = previewDelta;
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 120;

  const point = (value: number, i: number): [number, number] => {
    const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
    const dist = (value / 100) * r;
    return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist];
  };
  const poly = (values: readonly number[]) =>
    values.map((v, i) => point(v, i).join(",")).join(" ");

  return (
    <figure>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Confidence radar: ${dimensions
          .map((d, i) => `${d} ${current[i]} (was ${previous[i]})`)
          .join(", ")}`}
        className="mx-auto w-full max-w-sm"
      >
        {[25, 50, 75, 100].map((ring) => (
          <polygon
            key={ring}
            points={poly(dimensions.map(() => ring))}
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth={1}
          />
        ))}
        {dimensions.map((_, i) => {
          const [x, y] = point(100, i);
          return (
            <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" className="text-border" strokeWidth={1} />
          );
        })}
        <polygon points={poly(previous)} fill={chart.previousDark} fillOpacity={0.12} stroke={chart.previousDark} strokeWidth={1.5} strokeDasharray="4 4" />
        <polygon points={poly(current)} fill={chart.currentDark} fillOpacity={0.14} stroke={chart.currentDark} strokeWidth={2} />
        {dimensions.map((d, i) => {
          const [x, y] = point(122, i);
          return (
            <text key={d} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-current font-mono text-[11px] text-muted-foreground">
              {d}
            </text>
          );
        })}
      </svg>
      <figcaption className="mt-3 flex justify-center gap-6 font-mono text-label-mono text-muted-foreground">
        <span><span style={{ color: chart.currentDark }}>—</span> this quarter</span>
        <span><span style={{ color: chart.previousDark }}>- -</span> last quarter</span>
      </figcaption>
    </figure>
  );
}

/** The counter-evidence search: type a doubt, your own Ledger disagrees. */
export function ProgressDemo() {
  const [doubt, setDoubt] = useState("");

  const matches = useMemo(() => {
    const q = doubt.trim().toLowerCase();
    if (!q) return null;
    const terms = q.split(/\W+/).filter((t) => t.length > 2);
    const hits = previewLedger.filter((e) =>
      terms.some((t) => `${e.text} ${e.because}`.toLowerCase().includes(t)),
    );
    return hits.length > 0 ? hits : previewLedger.slice(0, 3);
  }, [doubt]);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 className="eyebrow mb-4">The Quarterly Delta</h2>
        <Card>
          <CardContent className="p-6">
            <DeltaRadar />
            <p className="mt-4 text-center text-body-s text-muted-foreground">
              The movement is the reward. No single number, on purpose — a number invites verdicts;
              the shape invites work.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="eyebrow mb-4">The Identity Ledger · counter-evidence search</h2>
        <Label htmlFor="doubt">Type the doubt, verbatim</Label>
        <Input
          id="doubt"
          type="search"
          value={doubt}
          onChange={(e) => setDoubt(e.target.value)}
          placeholder="“I can't speak up”"
        />
        <div aria-live="polite" className="mt-6">
          {matches && (
            <p className="mb-4 font-serif text-body-l">
              You have {previewLedger.length} entries that disagree with that thought. A few:
            </p>
          )}
          <ul className="space-y-3">
            {(matches ?? previewLedger).map((e) => (
              <li key={e.id} className="rounded-r3 border border-border bg-card p-4">
                <p className="text-body-m">{e.text}</p>
                <p className="mt-1 text-body-s italic text-muted-foreground">…{e.because}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge>{e.days === 1 ? "yesterday" : `${e.days} days ago`}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
