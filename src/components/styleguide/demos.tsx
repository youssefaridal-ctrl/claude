"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";

/** Interactive islands for the /styleguide reference page. */

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="compact">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave this rep?</DialogTitle>
          <DialogDescription>
            Your progress is saved. The chair is still here whenever you come back — no streak breaks,
            because streaks don&rsquo;t break here.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex gap-3">
          <Button size="compact">Stay with it</Button>
          <Button variant="ghost" size="compact">Leave for now</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TabsDemo() {
  return (
    <Tabs defaultValue="glance">
      <TabsList aria-label="Content depth">
        <TabsTrigger value="glance">Glance</TabsTrigger>
        <TabsTrigger value="read">Read</TabsTrigger>
        <TabsTrigger value="study">Study</TabsTrigger>
      </TabsList>
      <TabsContent value="glance">
        <p className="text-body-s text-muted-foreground">30-second cards. One idea, one rep.</p>
      </TabsContent>
      <TabsContent value="read">
        <p className="text-body-s text-muted-foreground">5–10 minute essays with the science layer.</p>
      </TabsContent>
      <TabsContent value="study">
        <p className="text-body-s text-muted-foreground">Multi-week Academy courses.</p>
      </TabsContent>
    </Tabs>
  );
}

export function ControlsDemo() {
  const [reminders, setReminders] = useState(true);
  const [progress, setProgress] = useState(40);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Switch checked={reminders} onCheckedChange={setReminders} aria-labelledby="sg-reminders" />
        <span id="sg-reminders" className="text-body-s">
          Practice reminder — an appointment with yourself
        </span>
      </div>
      <label className="flex items-center gap-1 text-body-s">
        <Checkbox defaultChecked />
        Include the 3-minute variation on hard days
      </label>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="eyebrow">Chapter progress</span>
          <span className="font-mono text-label-mono text-muted-foreground">{progress}% · rep 12 of 30</span>
        </div>
        <Progress value={progress} aria-label="Chapter progress" />
        <Button
          variant="ghost"
          size="compact"
          className="mt-3"
          onClick={() => setProgress((p) => (p >= 100 ? 0 : p + 10))}
        >
          Log a rep →
        </Button>
      </div>
    </div>
  );
}

export function FormDemo() {
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        setError("That email is missing an @ — e.g. you@domain.com");
      }}
    >
      <Field id="sg-email" label="Email" help="We only use this to sign you in. No newsletter ambush.">
        {(aria) => <Input type="text" placeholder="you@example.com" {...aria} />}
      </Field>
      <Field id="sg-identity" label="Who does this habit belong to?" error={error} optional={false}>
        {(aria) => <Textarea placeholder="I'm someone who…" {...aria} />}
      </Field>
      <Button type="submit" size="compact" variant="secondary">
        Trigger validation state
      </Button>
    </form>
  );
}
