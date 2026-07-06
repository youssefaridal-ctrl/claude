"use client";

import { useState } from "react";
import { previewPosts } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SEEKING_COPY: Record<string, string> = {
  SUPPORT: "seeking: support",
  PERSPECTIVES: "seeking: perspectives",
  ACCOUNTABILITY: "seeking: accountability",
};

interface DemoPost {
  id: string;
  title: string;
  seeking: string;
  author: string;
  comments: number;
  space: string;
}

/** Commons preview: seeking-labeled posts, "I see you" reactions (no counts shown). */
export function CommonsDemo() {
  const [posts, setPosts] = useState<DemoPost[]>([...previewPosts]);
  const [witnessed, setWitnessed] = useState<Set<string>>(new Set());
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [seeking, setSeeking] = useState<"SUPPORT" | "PERSPECTIVES" | "ACCOUNTABILITY">("SUPPORT");

  function publish() {
    setPosts([
      { id: `new-${Date.now()}`, title: title.trim(), seeking, author: "you", comments: 0, space: "general" },
      ...posts,
    ]);
    setComposing(false);
    setTitle("");
    setBody("");
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="eyebrow">The Forum · general</h2>
        <Button size="compact" variant="secondary" onClick={() => setComposing((c) => !c)}>
          {composing ? "Cancel" : "New post"}
        </Button>
      </div>

      {composing && (
        <Card className="mt-4">
          <CardContent className="p-6">
            <fieldset className="mb-5 border-0 p-0">
              <legend className="mb-2 block text-body-s font-medium">What are you seeking?</legend>
              <div role="radiogroup" aria-label="Seeking" className="flex flex-wrap gap-2">
                {(["SUPPORT", "PERSPECTIVES", "ACCOUNTABILITY"] as const).map((s) => (
                  <button
                    key={s}
                    role="radio"
                    aria-checked={seeking === s}
                    onClick={() => setSeeking(s)}
                    type="button"
                    className={cn(
                      "min-h-11 rounded-full border px-4 font-mono text-label-mono uppercase transition-colors duration-fast",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      seeking === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
                    )}
                  >
                    {s.toLowerCase()}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-body-s text-muted-foreground">
                This sets what responses you get. No advice unless you ask for perspectives — that&rsquo;s law here.
              </p>
            </fieldset>
            <Field id="post-title" label="Title">
              {(aria) => <Input value={title} onChange={(e) => setTitle(e.target.value)} {...aria} />}
            </Field>
            <Field id="post-body" label="Your post">
              {(aria) => <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} {...aria} />}
            </Field>
            <Button onClick={publish} disabled={!title.trim()}>Post to the Commons</Button>
          </CardContent>
        </Card>
      )}

      <ul className="mt-6 space-y-4">
        {posts.map((p) => {
          const seen = witnessed.has(p.id);
          return (
            <li key={p.id}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="filled">{SEEKING_COPY[p.seeking]}</Badge>
                    <Badge>{p.space}</Badge>
                    <span className="ml-auto font-mono text-label-mono text-muted-foreground">@{p.author}</span>
                  </div>
                  <h3 className="mt-3 text-body-l font-medium">{p.title}</h3>
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      type="button"
                      aria-pressed={seen}
                      onClick={() =>
                        setWitnessed((prev) => {
                          const next = new Set(prev);
                          if (next.has(p.id)) next.delete(p.id);
                          else next.add(p.id);
                          return next;
                        })
                      }
                      className={cn(
                        "min-h-11 rounded-full border px-4 text-body-s transition-colors duration-fast",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        seen ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
                      )}
                    >
                      {seen ? "Witnessed" : "I see you"}
                    </button>
                    <span className="text-body-s text-muted-foreground">
                      {p.comments} {p.comments === 1 ? "reply" : "replies"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-body-s text-muted-foreground">
        Notice what&rsquo;s missing: reaction counts. You can witness; you can&rsquo;t compete.
      </p>
    </div>
  );
}
