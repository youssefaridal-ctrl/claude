"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WEATHER_OPTIONS = [
  { value: "CLEAR", emoji: "☀️", label: "Clear", description: "Present and at ease" },
  { value: "BREEZY", emoji: "🌤️", label: "Breezy", description: "Light and moving" },
  { value: "OVERCAST", emoji: "☁️", label: "Overcast", description: "Dull but functional" },
  { value: "LOW_FOG", emoji: "🌫️", label: "Low fog", description: "Hard to see clearly" },
  { value: "CHARGED", emoji: "⚡", label: "Charged", description: "Energised or tense" },
  { value: "RAINING", emoji: "🌧️", label: "Raining", description: "Something's hard right now" },
  { value: "COLD_SNAP", emoji: "🌨️", label: "Cold snap", description: "Withdrawn, frozen" },
  { value: "AFTER_RAIN", emoji: "🌦️", label: "After rain", description: "Clearing, something shifted" },
] as const;

const BODY_AREAS = ["head", "jaw", "chest", "stomach", "shoulders", "everywhere", "unsure"] as const;
const NEEDS = ["rest", "food", "movement", "people", "quiet", "to-say-something"] as const;

type Phase = "weather" | "body" | "need" | "note" | "done";

export function MoodCheckin() {
  const [phase, setPhase] = useState<Phase>("weather");
  const [weather, setWeather] = useState<string | null>(null);
  const [bodyAreas, setBodyAreas] = useState<string[]>([]);
  const [need, setNeed] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleBodyArea(area: string) {
    setBodyAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  async function save() {
    if (!weather) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weather,
          bodyAreas,
          need: need ?? undefined,
          note: note.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setPhase("done");
    } catch {
      setError("Didn't save — try once more.");
    } finally {
      setSaving(false);
    }
  }

  if (phase === "done") {
    return (
      <div className="py-12 text-center">
        <p className="font-serif text-display-m">Logged.</p>
        <p className="mt-4 text-body-m text-muted-foreground">
          Patterns take a month to become readable — every check-in is data.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setPhase("weather");
              setWeather(null);
              setBodyAreas([]);
              setNeed(null);
              setNote("");
            }}
          >
            Check in again
          </Button>
          <a href="/today" className="text-body-s text-accent underline-offset-4 hover:underline">
            Back to Today →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Phase: weather */}
      <section>
        <p className="eyebrow mb-4">Inner weather</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {WEATHER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setWeather(opt.value)}
              aria-pressed={weather === opt.value}
              className={cn(
                "flex flex-col gap-1 rounded-r3 border p-4 text-left transition-all duration-fast",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                weather === opt.value
                  ? "border-foreground bg-card"
                  : "border-border bg-transparent hover:border-foreground/40",
              )}
            >
              <span className="text-2xl" aria-hidden>{opt.emoji}</span>
              <span className="text-body-m font-medium">{opt.label}</span>
              <span className="text-body-s text-muted-foreground">{opt.description}</span>
            </button>
          ))}
        </div>
      </section>

      {weather && (
        <>
          {/* Phase: body */}
          <section>
            <p className="eyebrow mb-1">Where do you feel it?</p>
            <p className="mb-4 text-body-s text-muted-foreground">Select any that apply</p>
            <div className="flex flex-wrap gap-2">
              {BODY_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleBodyArea(area)}
                  aria-pressed={bodyAreas.includes(area)}
                  className={cn(
                    "rounded-full border px-4 py-2 font-mono text-label-mono uppercase transition-all duration-fast",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    bodyAreas.includes(area)
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground/40",
                  )}
                >
                  {area}
                </button>
              ))}
            </div>
          </section>

          {/* Phase: need */}
          <section>
            <p className="eyebrow mb-1">What do you need right now?</p>
            <p className="mb-4 text-body-s text-muted-foreground">Optional — best guess is enough</p>
            <div className="flex flex-wrap gap-2">
              {NEEDS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNeed(need === n ? null : n)}
                  aria-pressed={need === n}
                  className={cn(
                    "rounded-full border px-4 py-2 font-mono text-label-mono uppercase transition-all duration-fast",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    need === n
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground/40",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </section>

          {/* Note */}
          <section>
            <label htmlFor="mood-note" className="eyebrow mb-2 block">
              One sentence <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="mood-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Anything else worth naming…"
              className="w-full resize-none rounded-r2 border border-border bg-input px-4 py-3 font-sans text-body-m focus-visible:border-foreground focus-visible:outline-none"
            />
          </section>

          {error && <p role="alert" className="text-body-s text-attention">{error}</p>}

          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Log it"}
          </Button>
        </>
      )}
    </div>
  );
}
