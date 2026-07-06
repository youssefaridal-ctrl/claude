"use client";

import { useState } from "react";

const DIMENSIONS = [
  { key: "confidence", label: "Confidence" },
  { key: "relationships", label: "Relationships" },
  { key: "work", label: "Work" },
  { key: "body", label: "Body" },
  { key: "creativity", label: "Creativity" },
  { key: "purpose", label: "Purpose" },
  { key: "rest", label: "Rest" },
  { key: "growth", label: "Growth" },
] as const;

type DimKey = (typeof DIMENSIONS)[number]["key"];
type Scores = Record<DimKey, number>;

const INITIAL: Scores = {
  confidence: 5, relationships: 6, work: 5, body: 5,
  creativity: 6, purpose: 5, rest: 4, growth: 6,
};

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const MAX_R = 110;
const TICK_COUNT = 5;

function polar(angle: number, r: number): [number, number] {
  const rad = (angle - 90) * (Math.PI / 180);
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

function toPath(values: number[]): string {
  return values
    .map((v, i) => {
      const angle = (360 / values.length) * i;
      const r = (v / 10) * MAX_R;
      const [x, y] = polar(angle, r);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ") + " Z";
}

export function LifeWheel() {
  const [scores, setScores] = useState<Scores>(INITIAL);

  const values = DIMENSIONS.map((d) => scores[d.key]);
  const n = DIMENSIONS.length;

  const axisAngles = DIMENSIONS.map((_, i) => (360 / n) * i);

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-start">
      {/* SVG wheel */}
      <div className="flex-shrink-0" aria-hidden="true">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto">
          {/* Concentric grid rings */}
          {Array.from({ length: TICK_COUNT }, (_, i) => {
            const r = ((i + 1) / TICK_COUNT) * MAX_R;
            const pts = axisAngles.map((a) => polar(a, r));
            const d = pts.map(([x, y], j) => `${j === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ") + " Z";
            return <path key={i} d={d} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />;
          })}

          {/* Axis lines */}
          {axisAngles.map((angle, i) => {
            const [x, y] = polar(angle, MAX_R);
            return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />;
          })}

          {/* Score polygon */}
          <path
            d={toPath(values)}
            fill="hsl(var(--solar-500))"
            fillOpacity="0.18"
            stroke="hsl(var(--solar-500))"
            strokeWidth="1.5"
          />

          {/* Score dots */}
          {values.map((v, i) => {
            const angle = axisAngles[i]!;
            const r = (v / 10) * MAX_R;
            const [x, y] = polar(angle, r);
            return <circle key={i} cx={x} cy={y} r={4} fill="hsl(var(--solar-500))" />;
          })}

          {/* Axis labels */}
          {DIMENSIONS.map((dim, i) => {
            const angle = axisAngles[i]!;
            const [x, y] = polar(angle, MAX_R + 18);
            const textAnchor = x < CX - 5 ? "end" : x > CX + 5 ? "start" : "middle";
            return (
              <text
                key={dim.key}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="central"
                fontSize="10"
                fill="currentColor"
                fillOpacity="0.7"
                className="font-mono uppercase"
              >
                {dim.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Sliders */}
      <div className="flex-1 space-y-4">
        {DIMENSIONS.map((dim) => (
          <div key={dim.key}>
            <div className="mb-1 flex justify-between">
              <label htmlFor={`wheel-${dim.key}`} className="font-mono text-label-mono uppercase text-muted-foreground">
                {dim.label}
              </label>
              <span className="font-mono text-label-mono">{scores[dim.key]}</span>
            </div>
            <input
              id={`wheel-${dim.key}`}
              type="range"
              min={1}
              max={10}
              value={scores[dim.key]}
              onChange={(e) => setScores((s) => ({ ...s, [dim.key]: Number(e.target.value) }))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-solar-500"
            />
          </div>
        ))}

        <p className="pt-2 text-body-s text-muted-foreground">
          Average satisfaction: <strong>{(values.reduce((a, b) => a + b, 0) / n).toFixed(1)}</strong> / 10
        </p>
      </div>
    </div>
  );
}
