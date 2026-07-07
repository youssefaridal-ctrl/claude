"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type FieldErrors = Record<string, string>;

export function NewHabitForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string).trim();
    const identityStatement = (fd.get("identityStatement") as string).trim();
    const cue = (fd.get("cue") as string | null)?.trim() || undefined;
    const twoMinuteVersion = (fd.get("twoMinuteVersion") as string | null)?.trim() || undefined;
    const targetPerWeek = Number(fd.get("targetPerWeek") ?? 4);

    const fe: FieldErrors = {};
    if (!name) fe.name = "أعطِ هذه العادة اسماً.";
    if (!identityStatement || identityStatement.length < 8)
      fe.identityStatement = "أكمل جملة الهوية (ثمانية أحرف على الأقل).";
    if (Object.keys(fe).length) { setErrors(fe); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, identityStatement, cue, twoMinuteVersion, targetPerWeek }),
      });
      if (res.ok) {
        router.push("/practice/tracker");
        router.refresh();
      } else {
        const data = (await res.json()) as { detail?: string };
        setServerError(data.detail ?? "حدث خطأ من جهتنا. حاول مرة أخرى.");
      }
    } catch {
      setServerError("تعذّر الوصول إلى الخادم. تحقق من اتصالك وحاول مجدداً.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-8">
      <div>
        <Label htmlFor="name">اسم العادة</Label>
        <Input
          id="name"
          name="name"
          placeholder="ركض صباحي، كتابة يومية، تمشٍّ مسائي…"
          maxLength={120}
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={!!errors.name}
        />
        <FieldError id="name-error">{errors.name}</FieldError>
      </div>

      <div>
        <Label htmlFor="identityStatement">جملة الهوية</Label>
        <p className="mb-2 text-body-s text-muted-foreground">
          أكمل: "أنا شخص يـ…" — العادة تنتمي لهذا الشخص، لا لقاعدة.
        </p>
        <Input
          id="identityStatement"
          name="identityStatement"
          placeholder="يلتزم بنفسه في الصباح"
          maxLength={300}
          aria-describedby="is-hint is-error"
          aria-invalid={!!errors.identityStatement}
        />
        <p id="is-hint" className="mt-1 text-body-s text-muted-foreground">
          هذا يصبح الـ"لأنني" في كل إدخال سجل لهذه العادة.
        </p>
        <FieldError id="is-error">{errors.identityStatement}</FieldError>
      </div>

      <div>
        <Label htmlFor="cue">
          نية التنفيذ <span className="text-muted-foreground">(اختياري)</span>
        </Label>
        <p className="mb-2 text-body-s text-muted-foreground">
          "بعد [الإشارة]، سأؤدي هذه العادة." البحث يُضاعف الالتزام الفعلي.
        </p>
        <Input
          id="cue"
          name="cue"
          placeholder="بعد أن أحضّر أول قهوة"
          maxLength={300}
        />
      </div>

      <div>
        <Label htmlFor="twoMinuteVersion">
          النسخة ذات الدقيقتين <span className="text-muted-foreground">(اختياري)</span>
        </Label>
        <p className="mb-2 text-body-s text-muted-foreground">
          أصغر نسخة لا تزال تُحسب. في الأيام الصعبة، هذا يكفي.
        </p>
        <Input
          id="twoMinuteVersion"
          name="twoMinuteVersion"
          placeholder="أرتدي حذائي وأمشي حتى نهاية الشارع"
          maxLength={300}
        />
      </div>

      <div>
        <Label htmlFor="targetPerWeek">الهدف الأسبوعي</Label>
        <p className="mb-2 text-body-s text-muted-foreground">
          أيام الأسبوع التي تهدف فيها للالتزام. الهدف هو الأسبوع، لا السلسلة.
        </p>
        <Select id="targetPerWeek" name="targetPerWeek" defaultValue="4" className="max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "يوم" : "أيام"} في الأسبوع{n === 4 ? " (موصى به)" : ""}
            </option>
          ))}
        </Select>
      </div>

      {serverError && (
        <p role="alert" className="text-body-s text-attention">
          {serverError}
        </p>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "يضيف…" : "أضف العادة"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
