"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

/**
 * The live rewrite demo (design/03 §3.4) — the Method page's signature
 * interaction. A harsh sentence transformed by the three Rewrite operations,
 * each naming its mechanism. "This demo IS the product pitch."
 */

const STEPS = [
  {
    op: "البداية",
    mechanism: "الفكرة الخام",
    sentence: '"أنا دائماً أتجمد في الاجتماعات."',
    note: "الراوي يُقدّم هذا كحقيقة. انظر ماذا تفعل ثلاث عمليات بها.",
  },
  {
    op: "المسافة",
    mechanism: "التباعد الذاتي · كروس وآخرون",
    sentence: '"أنا أعاني من فكرة أنني سأتجمد في الاجتماعات."',
    note: "الفكرة أصبحت طقساً لا حقيقة. تسميتها فكرةً هو تنظيم بحد ذاته.",
  },
  {
    op: "الدليل",
    mechanism: "إعادة البناء المعرفي",
    sentence: '"تجمّدت مرتين الربع الماضي — وتكلّمت في أحد عشر اجتماعاً آخر، منها الصعب يوم الثلاثاء."',
    note: "ليست تفكيراً إيجابياً — بل تفكيراً دقيقاً. الناقد يكره الدقة.",
  },
  {
    op: "المؤلف",
    mechanism: "المصداقية ٧+ · لهجتك الخاصة",
    sentence: '"خضت غرفاً صعبة من قبل. أستطيع هذه بثمانين بالمئة — والثمانون يكفي."',
    note: "جملة تصمد أمام استجوابك الخاص. هذا الصوت الذي تتمرن عليه.",
  },
] as const;

export function RewriteDemo() {
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  const current = STEPS[step]!;

  return (
    <div className="rounded-r4 border border-border bg-card p-8 shadow-elev-1">
      <p className="eyebrow mb-6">جرّب إعادة الكتابة — مباشرةً</p>

      <div className="min-h-28" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-serif text-serif-feature">{current.sentence}</p>
            <p className="mt-3 text-body-s text-muted-foreground">{current.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3" role="group" aria-label="عمليات إعادة الكتابة">
        {STEPS.map((s, i) => (
          <button
            key={s.op}
            type="button"
            onClick={() => setStep(i)}
            aria-pressed={step === i}
            className={`min-h-11 rounded-r2 border px-4 text-body-s transition-all duration-fast
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
              ${step === i ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
          >
            {i === 0 ? "إعادة ضبط" : `${i} · ${s.op}`}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Badge>{current.mechanism}</Badge>
      </div>
    </div>
  );
}
