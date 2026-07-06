"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";

const TOPICS = [
  "Question about membership",
  "Something's not working",
  "Press",
  "Partnerships",
  "Accessibility",
  "Just want to say something",
];

/** Contact form — prototype submits locally and shows the post-submit state. */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  if (sent) {
    return (
      <div className="rounded-r4 border border-border bg-card p-10 text-center" role="status">
        <p className="font-serif text-serif-feature">Received.</p>
        <p className="mt-3 text-body-m text-muted-foreground">
          A person — not a bot — will reply, usually sooner than promised.
        </p>
        <p className="mt-4 font-mono text-label-mono text-muted-foreground">
          Your reference: #{Math.floor(1000 + Math.random() * 9000)}
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const next: typeof errors = {};
        if (!String(data.get("name") ?? "").trim()) next.name = "We'd like something to call you — first name is plenty.";
        const email = String(data.get("email") ?? "");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "That email is missing something — e.g. you@domain.com";
        if (!String(data.get("message") ?? "").trim()) next.message = "The message is the whole point — one sentence is fine.";
        setErrors(next);
        if (Object.keys(next).length === 0) setSent(true);
      }}
    >
      <Field id="name" label="Your name" error={errors.name}>
        {(aria) => <Input name="name" autoComplete="name" {...aria} />}
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        {(aria) => <Input name="email" type="email" autoComplete="email" {...aria} />}
      </Field>
      <Field id="topic" label="What's this about?">
        {(aria) => (
          <select
            name="topic"
            className="flex h-12 w-full rounded-r1 border border-border bg-input px-4 text-body-m focus-visible:border-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            {...aria}
          >
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        )}
      </Field>
      <Field id="message" label="Your message" error={errors.message}>
        {(aria) => <Textarea name="message" rows={6} {...aria} />}
      </Field>
      <Button type="submit">Send it</Button>
    </form>
  );
}
