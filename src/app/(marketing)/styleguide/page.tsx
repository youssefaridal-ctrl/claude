import { Compass, PenLine, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, InteractiveCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@/components/ui/icon";
import { ControlsDemo, DialogDemo, FormDemo, TabsDemo } from "@/components/styleguide/demos";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Styleguide — the Blueprint design system, live",
  noIndex: true,
});

/**
 * /styleguide — the living reference for the frozen design system
 * (blueprint v1.0.0). Every primitive rendered in one place so consistency
 * is verifiable by eye and by Playwright screenshot. Not linked from
 * navigation; noindex; ships to production intentionally so design review
 * happens against the real build.
 */

const COLOR_ROWS = [
  { name: "ink-950 · base dark", cls: "bg-ink-950", hex: "#0E0D0B" },
  { name: "ink-900 · surface dark", cls: "bg-ink-900", hex: "#161512" },
  { name: "ink-700 · border dark", cls: "bg-ink-700", hex: "#33302A" },
  { name: "ink-500 · muted", cls: "bg-ink-500", hex: "#6B665C" },
  { name: "ink-100 · hairline light", cls: "bg-ink-100", hex: "#DDD9D1" },
  { name: "bone-50 · base light", cls: "bg-bone-50 border border-border", hex: "#FAF8F4" },
  { name: "bone-100 · surface light", cls: "bg-bone-100 border border-border", hex: "#F2EFE8" },
  { name: "bone-200 · input light", cls: "bg-bone-200", hex: "#E7E2D8" },
  { name: "solar-500 · accent dark-mode", cls: "bg-solar-500", hex: "#E8A23D" },
  { name: "solar-600 · accent light-mode", cls: "bg-solar-600", hex: "#B4741A" },
  { name: "solar-700 · AAA accent text", cls: "bg-solar-700", hex: "#8A5810" },
];

const SPACE_STEPS = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-border py-14">
      <h2 id={`${id}-h`} className="eyebrow mb-8">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="container max-w-4xl py-16">
      <Badge variant="solar">Blueprint v1.0.0 · frozen</Badge>
      <h1 className="mt-4 text-display-l font-medium">The design system, live.</h1>
      <p className="mt-3 max-w-xl text-body-l text-muted-foreground">
        Every primitive on one page, in both themes (use the OS toggle). If a page doesn&rsquo;t look
        like it was built from this page, it wasn&rsquo;t — fix the page, not the system.
      </p>

      <Section id="colors" title="01 · Color — Ink / Bone / Solar">
        <ul className="grid gap-3 sm:grid-cols-2">
          {COLOR_ROWS.map((c) => (
            <li key={c.hex} className="flex items-center gap-4">
              <span className={`h-11 w-16 shrink-0 rounded-r2 ${c.cls}`} aria-hidden />
              <span className="text-body-s">{c.name}</span>
              <span className="ml-auto font-mono text-label-mono text-muted-foreground">{c.hex}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-body-s text-muted-foreground">
          Rule: Solar on ≤5% of any viewport. Semantic tokens (background, card, border…) swap per
          theme in <code className="font-mono">globals.css</code>.
        </p>
      </Section>

      <Section id="type" title="02 · Typography — two voices + annotation">
        <div className="space-y-6">
          <p className="text-display-xl font-medium">Display XL — the mirror.</p>
          <p className="text-display-m font-medium">Display M — section headers.</p>
          <p className="font-serif text-serif-feature italic">
            Serif feature — the mentor&rsquo;s voice. &ldquo;Take the pen back.&rdquo;
          </p>
          <p className="max-w-lg text-body-l">
            Body L for editorial reading: long-form essays at a 1.7 line height, 680px measure.
          </p>
          <p className="max-w-lg text-body-m text-muted-foreground">
            Body M — default UI text. Muted foreground keeps AAA contrast on both themes.
          </p>
          <p className="eyebrow">Label mono — eyebrows · meta · 07 / 12</p>
        </div>
      </Section>

      <Section id="spacing" title="03 · Spacing — the 8px scale">
        <div className="flex flex-wrap items-end gap-3">
          {SPACE_STEPS.map((px, i) => (
            <div key={px} className="flex flex-col items-center gap-2">
              <div className="w-6 rounded-sm bg-foreground/80" style={{ height: px }} aria-hidden />
              <span className="font-mono text-label-mono text-muted-foreground">
                s{i + 1}·{px}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-body-s text-muted-foreground">
          Component-internal: s1–s6. Layout rhythm: s6–s12. Nothing off-scale.
        </p>
      </Section>

      <Section id="buttons" title="04 · Buttons — hover primary for the Solar trace">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">
            Ghost <Icon icon={ArrowRight} size="inline" />
          </Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Delete entry</Button>
          <Button disabled>Disabled</Button>
          <Button size="compact">Compact</Button>
        </div>
      </Section>

      <Section id="cards" title="05 · Cards">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Badge className="w-fit">Static card</Badge>
              <CardTitle>Surface, r3, hairline, elev-1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-s text-muted-foreground">
                For content that isn&rsquo;t a link. No hover behavior, no lift.
              </p>
            </CardContent>
          </Card>
          <InteractiveCard>
            <CardHeader>
              <Badge variant="solar" className="w-fit">Interactive</Badge>
              <CardTitle>Lifts 4px, gains elev-2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-s text-muted-foreground">
                Whole card is the target; focus-within ring included.
              </p>
            </CardContent>
          </InteractiveCard>
        </div>
      </Section>

      <Section id="forms" title="06 · Forms — Field wires label/help/error">
        <FormDemo />
      </Section>

      <Section id="controls" title="07 · Controls — switch, checkbox, progress">
        <ControlsDemo />
      </Section>

      <Section id="tabs-dialog" title="08 · Tabs & dialog">
        <div className="space-y-10">
          <TabsDemo />
          <DialogDemo />
        </div>
      </Section>

      <Section id="badges" title="09 · Badges & status">
        <div className="flex flex-wrap gap-3">
          <Badge>Essay · 9 min</Badge>
          <Badge variant="filled">Chapter 3</Badge>
          <Badge variant="solar">Most members start here</Badge>
          <Badge variant="positive">Week kept</Badge>
          <Badge variant="attention">Needs review</Badge>
        </div>
      </Section>

      <Section id="icons" title="10 · Icons — 1.5px stroke, four sizes">
        <div className="flex items-end gap-8">
          {(["inline", "button", "nav", "feature"] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Icon icon={Compass} size={size} />
              <span className="font-mono text-label-mono text-muted-foreground">{size}</span>
            </div>
          ))}
          <Separator orientation="vertical" className="h-10" />
          <div className="flex gap-4 text-muted-foreground">
            <Icon icon={PenLine} size="nav" label="Rewrite" />
            <Icon icon={BookOpen} size="nav" label="Library" />
          </div>
        </div>
        <p className="mt-4 text-body-s text-muted-foreground">
          Architecture & writing metaphors only — no lightbulbs, no lotus flowers, no summit flags.
        </p>
      </Section>

      <Section id="loading" title="11 · Loading — luminance skeletons">
        <div className="max-w-sm space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-28 w-full rounded-r3" />
        </div>
      </Section>
    </div>
  );
}
