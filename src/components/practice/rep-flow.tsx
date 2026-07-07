"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";

type Phase = "intro" | "quote" | "distance" | "rewrite" | "done";

const DISTANCE_PREAMBLE = "أنا أعاني من فكرة أنني";

export function RepFlow() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [quote, setQuote] = useState("");
  const [rewrite, setRewrite] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const anim = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: reduced ? { opacity: 0 } : { opacity: 0, y: -8 },
    transition: { duration: 0.28 },
  };

  const saveToLedger = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const normalised = quote.trim().replace(/^[""""]|[""""]$/g, "");
      await Promise.all([
        fetch("/api/ledger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: rewrite.trim(),
            becauseClause: `إعادة كتابة: "${normalised}"`,
            source: "REP",
            themeTags: ["إعادة-تأطير", "المسودة-الثانية"],
          }),
        }),
      ]);
      setPhase("done");
    } catch {
      setError("لم يُحفَظ — الخطأ من جانبنا لا من جانبك. كلماتك تستحق البقاء. حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  }, [quote, rewrite]);

  return (
    <div className="mx-auto max-w-xl">
      <AnimatePresence mode="wait">

        {phase === "intro" && (
          <motion.div key="intro" {...anim} className="text-center">
            <p className="eyebrow mb-4">تمرين اليوم</p>
            <h1 className="font-serif text-display-m font-medium">المسودة الثانية</h1>
            <p className="mt-6 text-body-l text-muted-foreground">
              خذ أقسى جملة داخلية اليوم، أعطها مسافة،
              ثم أعد كتابتها عند درجة سبعة من المصداقية. كلتاهما تذهبان إلى سجلّك.
              الزوج هو التقدم.
            </p>
            <p className="mt-4 text-body-s text-muted-foreground">~٤ دقائق</p>
            <Button className="mt-8" onClick={() => setPhase("quote")}>
              ابدأ التمرين
            </Button>
          </motion.div>
        )}

        {phase === "quote" && (
          <motion.div key="quote" {...anim}>
            <p className="eyebrow mb-6">الخطوة ١ من ٣ · اقتبسها</p>
            <Label htmlFor="rep-quote" className="text-heading-s font-medium">
              ماذا قال الراوي اليوم؟
            </Label>
            <p className="mb-4 mt-2 text-body-m text-muted-foreground">
              حرفياً — بكل قبحه النحوي. لا يمكنك إعادة كتابة سطر لم تسمّه.
            </p>
            <Textarea
              id="rep-quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder='"ستُحرجَ نفسك."'
              rows={4}
              className="font-serif text-body-l"
              aria-describedby="quote-hint"
            />
            <p id="quote-hint" className="mt-2 text-body-s text-muted-foreground">
              الإجابات الصادقة تتفوق على المُبهِرة.
            </p>
            <Button
              className="mt-6"
              disabled={!quote.trim()}
              onClick={() => setPhase("distance")}
            >
              التالي
            </Button>
          </motion.div>
        )}

        {phase === "distance" && (
          <motion.div key="distance" {...anim}>
            <p className="eyebrow mb-6">الخطوة ٢ من ٣ · أعطها مسافة</p>
            <p className="text-body-m text-muted-foreground">اقرأ هذا مرة، بصوت عالٍ إن أمكن:</p>
            <blockquote
              aria-live="polite"
              className="mt-6 rounded-r3 border border-border bg-card p-6 font-serif text-serif-feature"
            >
              &ldquo;{DISTANCE_PREAMBLE}{" "}
              {quote.trim().replace(/^[""""]|[""""]$/g, "")}&rdquo;
            </blockquote>
            <p className="mt-6 text-body-m text-muted-foreground">
              نفس الكلمات — ارتفاع مختلف. الفكرة أصبحت طقساً الآن، لا حقيقة. بيدك أن تحملها أو تضعها.
            </p>
            <Button className="mt-8" onClick={() => setPhase("rewrite")}>
              التالي
            </Button>
          </motion.div>
        )}

        {phase === "rewrite" && (
          <motion.div key="rewrite" {...anim}>
            <p className="eyebrow mb-6">الخطوة ٣ من ٣ · أعد كتابتها</p>
            <Label htmlFor="rep-rewrite" className="text-heading-s font-medium">
              اكتب المسودة الثانية.
            </Label>
            <p className="mb-4 mt-2 text-body-m text-muted-foreground">
              لا التأكيد الذي تتمنى أنه صحيح — بل النسخة التي يمكنك تصديقها بسبعة من عشرة.
              الصادق يتفوق على الكامل.
            </p>
            <Textarea
              id="rep-rewrite"
              value={rewrite}
              onChange={(e) => setRewrite(e.target.value)}
              placeholder='"أنا قلق، والقلق يعني أنني أهتم. هذا ليس دليلاً على الفشل."'
              rows={4}
              className="font-serif text-body-l"
            />
            {error && (
              <p role="alert" className="mt-3 text-body-s text-attention">{error}</p>
            )}
            <Button
              className="mt-6"
              disabled={!rewrite.trim() || saving}
              onClick={saveToLedger}
            >
              {saving ? "جارٍ الحفظ في السجل…" : "أودِعها — المنجز منجز"}
            </Button>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" {...anim} className="text-center">
            <p className="font-mono text-label-mono uppercase text-muted-foreground">التمرين مكتمل</p>
            <p className="mt-6 font-serif text-display-m">المنجز منجز.</p>
            <div className="mt-6 rounded-r3 border border-border bg-card p-6 text-right">
              <p className="eyebrow mb-3">مُودَعة في سجلّك</p>
              <p className="font-serif text-body-l text-muted-foreground">&ldquo;{rewrite.trim()}&rdquo;</p>
            </div>
            <p className="mt-6 text-body-m text-muted-foreground">
              المسودة الثانية دليل. ثلاثون تمريناً وينتهي الفصل — كلماتك، مُنضَّدة.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setPhase("intro");
                  setQuote("");
                  setRewrite("");
                  setError(null);
                }}
              >
                تمرين آخر
              </Button>
              <a href="/ledger" className="text-body-s text-accent underline-offset-4 hover:underline">
                عرض سجلّك ←
              </a>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
