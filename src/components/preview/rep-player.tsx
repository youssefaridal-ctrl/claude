"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * The rep experience, prototyped (design/03 §27): The Second Draft in four
 * steps, ending in the ledger file-away and "Done is done." In-memory only.
 */

type Phase = "intro" | "quote" | "distance" | "rewrite" | "done";

export function RepPlayer() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [quote, setQuote] = useState("");
  const [rewrite, setRewrite] = useState("");
  const reduced = useReducedMotion();

  const anim = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <Card className="bg-gradient-to-br from-card to-muted">
      <CardHeader>
        <p className="eyebrow">تمرين اليوم · ٤ دقائق · إعادة تأطير</p>
        <CardTitle>المسودة الثانية</CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div key="intro" {...anim}>
              <p className="text-body-m text-muted-foreground">
                خذ أقسى جملة اليوم، أعطها مسافة، وأعد كتابتها عند درجة مصداقية سبعة.
                كلتا المسودتين تذهبان إلى سجلّك — الزوج هو التقدم.
              </p>
              <Button className="mt-6" onClick={() => setPhase("quote")}>ابدأ التمرين</Button>
            </motion.div>
          )}

          {phase === "quote" && (
            <motion.div key="quote" {...anim}>
              <p className="eyebrow mb-3">الخطوة ١ من ٣ · اقتبسها</p>
              <Label htmlFor="rep-quote">
                ماذا قال الراوي اليوم؟ حرفياً — بكل قبحه النحوي.
              </Label>
              <Textarea
                id="rep-quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder='"ستُحرج نفسك…"'
                className="font-serif"
              />
              <Button className="mt-4" disabled={!quote.trim()} onClick={() => setPhase("distance")}>
                التالي
              </Button>
            </motion.div>
          )}

          {phase === "distance" && (
            <motion.div key="distance" {...anim} aria-live="polite">
              <p className="eyebrow mb-3">الخطوة ٢ من ٣ · أعطها مسافة</p>
              <p className="text-body-m text-muted-foreground">اقرأ هذا مرة، بتمهّل:</p>
              <p className="mt-4 font-serif text-serif-feature">
                "أنا أعاني من فكرة أنني {quote.trim().replace(/^[""]|[""]$/g, "")}"
              </p>
              <p className="mt-4 text-body-s text-muted-foreground">
                نفس الكلمات — ارتفاع مختلف. الفكرة أصبحت طقساً لا حقيقة.
              </p>
              <Button className="mt-6" onClick={() => setPhase("rewrite")}>التالي</Button>
            </motion.div>
          )}

          {phase === "rewrite" && (
            <motion.div key="rewrite" {...anim}>
              <p className="eyebrow mb-3">الخطوة ٣ من ٣ · أعد كتابتها</p>
              <Label htmlFor="rep-rewrite">
                المسودة الثانية — بلهجتك، مُرتكزة على حقيقة واحدة، مصداقية سبعة فما فوق.
              </Label>
              <Textarea
                id="rep-rewrite"
                value={rewrite}
                onChange={(e) => setRewrite(e.target.value)}
                placeholder='"خضت غرفاً صعبة من قبل…"'
                className="font-serif"
              />
              <Button className="mt-4" disabled={!rewrite.trim()} onClick={() => setPhase("done")}>
                أودِعها في السجل
              </Button>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div key="done" {...anim} className="text-center" role="status">
              <motion.div
                initial={reduced ? {} : { scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="rounded-r3 border border-solar-500/40 bg-background p-6 shadow-glow-solar"
              >
                <p className="font-serif text-serif-feature">"{rewrite.trim()}"</p>
                <Badge variant="solar" className="mt-4">مُودَعة · سجل الهوية</Badge>
              </motion.div>
              <p className="mt-8 font-serif text-serif-feature">المنجز منجز.</p>
              <p className="mt-2 text-body-s text-muted-foreground">
                غداً: جلسة البحث عن الأدلة، ٣ دقائق. مجدوَلة بالفعل — لا شيء تتذكره.
              </p>
              <Button
                variant="ghost"
                size="compact"
                className="mt-6"
                onClick={() => {
                  setQuote("");
                  setRewrite("");
                  setPhase("intro");
                }}
              >
                أجرِه مرة أخرى
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
