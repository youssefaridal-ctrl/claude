"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

/**
 * The Inner Dialogue Audit (content/07 §3, design/03 §14a).
 * T4 distraction-free flow: one statement per screen, keyboard 1–5, progress
 * counter, autosave to localStorage, results before any email ask.
 */

const ITEMS = [
  "حين يسير شيء على ما يرام، أول ما يخطر ببالي أنني كنت محظوظاً فحسب.",
  "قبل أن أتكلم في مجموعة، أختبر الجملة: هل تبدو غبية؟",
  "بعد اللقاءات الاجتماعية، أُعيد تشغيل مقاطع أخطائي.",
  "أُخفّف ما أريده حتى لا أخيب أملي.",
  "أشعر أنني مسؤول عن مزاج من حولي.",
  "أخذ مساحة — وقتاً، اهتماماً، كلاماً — يبدو كدين سأسدّده لاحقاً.",
  "حين أتخيل تجربة شيء جديد، أبدأ بتصوّر كيف سيفشل.",
  '"جيد بما يكفي" تبدو في أذني مرادفاً للفشل.',
  "أُفضّل ألا أحاول على أن أُرى أكافح.",
  "أخطاء قديمة لا تزال تُستدعى كشهود ضدي، بعد سنوات.",
  "أوافق على أشياء في منتصف الجملة وأندم عليها بنهايتها.",
  "المجاملات تبدو أخطاءً ستُصحَّح قريباً.",
] as const;

const SCALE = ["أبداً", "نادراً", "أحياناً", "كثيراً", "دائماً"] as const;

const NARRATOR_COPY: Record<string, { name: string; core: string; work: string }> = {
  PERFECTIONIST: {
    name: "الكمالي",
    core: '"إذا لم يكن عديم العيوب، فهو فشل."',
    work: "العمل ليس خفض معاييرك — بل كتابتها. المعايير غير المكتوبة لا يمكن دحضها؛ المكتوبة يمكن الوفاء بها، والوفاء بها هو كيف يدخل الدليل.",
  },
  GUARD: {
    name: "الحارس",
    core: '"لا تحاول، ولن تخسر."',
    work: "الحارس يبيع الحماية ويُسلّم الضآلة. العمل هو عتبات تدريجية — أبواب صغيرة بما يكفي للمرور منها اليوم، مُسجَّلة كدليل على انتهاء صلاحية الخطر.",
  },
  GHOST: {
    name: "الشبح",
    core: '"خذ مساحة أقل."',
    work: "اختفاء مُكتسَب، مُؤدَّى كلياقة. العمل هو سلّم الظهور: ثماني درجات من سؤال واحد في اجتماع صغير إلى صوت يستند إليه الآخرون.",
  },
  PROSECUTOR: {
    name: "المدّعي",
    core: '"دعنا نراجع كل ما أخطأت فيه."',
    work: "محكمة الثانية صباحاً تنعقد لتسوية تهم لم تُعالَج. العمل هو بروتوكول التأجيل: عقد الجلسة مرة واحدة، على ورقة، في ساعة مناسبة — وإغلاق كل تهمة أو ردّها.",
  },
  PLEASER: {
    name: "المُرضي",
    core: '"أسعِدهم وستكون في أمان."',
    work: 'العمل هو نصوص الحدود بلهجتك الخاصة، مُدرَّبة قبل أن تحتاجها — لأن "لا" جملة يمكن التحضير لها.',
  },
  PROPHET: {
    name: "المتنبئ",
    core: '"ستسوء الأمور. دائماً ما يحدث هذا."',
    work: "توقعات بالألم، مُلبَّسة بالواقعية. العمل هو تتبّع التوقع مقابل الواقع: اكتب التوقع، عِش اللحظة، سجّل دقة المتنبئ. هي أدنى مما تبدو.",
  },
};

const STORAGE_KEY = "selv.audit.v1";

interface AuditResult {
  dominant: string;
  secondary: string;
  narrators: Record<string, number>;
  anonToken: string | null;
}

export function AuditFlow() {
  const reduced = useReducedMotion();
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resume an interrupted audit.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as number[];
        if (Array.isArray(parsed) && parsed.length < ITEMS.length) {
          setAnswers(parsed);
          setStep(parsed.length);
        }
      }
    } catch {
      // localStorage unavailable — proceed fresh
    }
  }, []);

  const submit = useCallback(async (finalAnswers: number[]) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/assessments/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as AuditResult;
      setResult(data);
      localStorage.removeItem(STORAGE_KEY);
      if (data.anonToken) localStorage.setItem("selv.audit.token", data.anonToken);
    } catch {
      setError("حدث خطأ من جانبنا — لا من جانبك. إجاباتك محفوظة؛ حاول مجدداً بعد لحظة.");
    } finally {
      setSubmitting(false);
    }
  }, []);

  const answer = useCallback(
    (value: number) => {
      const next = [...answers];
      next[step] = value;
      setAnswers(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // non-fatal
      }
      if (step + 1 < ITEMS.length) {
        setStep(step + 1);
      } else {
        void submit(next);
      }
    },
    [answers, step, submit],
  );

  // Keyboard 1–5 (design/03 §14a: keyboard-first).
  useEffect(() => {
    if (result) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= 5) answer(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, result]);

  if (result) {
    const copy = NARRATOR_COPY[result.dominant];
    const secondaryCopy = NARRATOR_COPY[result.secondary];
    return (
      <div className="mx-auto max-w-2xl py-16">
        <p className="eyebrow mb-4">ملف حوارك الداخلي</p>
        <h1 className="text-display-m font-medium">
          راويك المهيمن: <span className="text-accent">{copy?.name}</span>
        </h1>
        <p className="mt-6 font-serif text-serif-feature italic">{copy?.core}</p>
        <p className="mt-6 text-body-l text-muted-foreground">{copy?.work}</p>
        {secondaryCopy && (
          <p className="mt-4 text-body-s text-muted-foreground">
            في الكواليس: {secondaryCopy.name} — يعملان بالتناوب.
          </p>
        )}
        <div className="mt-10 rounded-r3 border border-border bg-card p-6">
          <h2 className="text-heading-s font-medium">احتفظ بهذا الملف</h2>
          <p className="mt-2 text-body-s text-muted-foreground">
            احفظه في حساب واحصل على خطة الأسبوع الأول — تمرين يومي مُطابق لراويك.
            أو خذ لقطة شاشة. كلاهما مسموح.
          </p>
          <Button asChild className="mt-4">
            <a href="/signin?from=audit">احفظ ملفي</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center py-16">
      <p className="eyebrow mb-10 text-center" aria-live="polite">
        {String(step + 1).padStart(2, "0")} / {ITEMS.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.fieldset
          key={step}
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
          transition={{ duration: 0.3 }}
          disabled={submitting}
          className="border-0 p-0"
        >
          <legend className="mb-10 text-center font-serif text-serif-feature">{ITEMS[step]}</legend>
          <div className="grid gap-3" role="group" aria-label="Answer scale">
            {SCALE.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => answer(i)}
                className="flex min-h-12 items-center justify-between rounded-r2 border border-border bg-card px-5 text-left text-body-m transition-all duration-fast hover:border-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span>{label}</span>
                <kbd className="font-mono text-label-mono text-muted-foreground" aria-hidden>
                  {i + 1}
                </kbd>
              </button>
            ))}
          </div>
        </motion.fieldset>
      </AnimatePresence>

      {(step === 3 || step === 8) && (
        <p className="mt-8 text-center text-body-s text-muted-foreground">الإجابات الصادقة تتفوق على المُبهِرة.</p>
      )}
      {error && (
        <p role="alert" className="mt-8 text-center text-body-s text-attention">
          {error}
        </p>
      )}
      {submitting && (
        <p aria-live="polite" className="mt-8 text-center text-body-s text-muted-foreground">
          نقرأ إجاباتك…
        </p>
      )}
    </div>
  );
}
