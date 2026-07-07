"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const IDENTITIES = [
  "أصبح شخصاً يصل صوته قبل أن يصل الشك",
  "أصبح شخصاً يفي بوعوده الصغيرة لنفسه",
];

const INITIAL_MOVES = [
  { id: "m1", text: "اطرح السؤال الأول في اجتماع القيادة يوم الاثنين", done: true },
  { id: "m2", text: "ابدأ مسودة محاضرة المؤتمر (النسخة القبيحة)", done: true },
  { id: "m3", text: "نص حدود واحد، مكتوب قبل الخميس", done: false },
  { id: "m4", text: "غرفة البروفة: محادثة الراتب، مرتين", done: false },
];

/** Goal Planner preview: Identity → Season → Moves (design/03 §30). */
export function PlannerDemo() {
  const [moves, setMoves] = useState(INITIAL_MOVES);
  const done = moves.filter((m) => m.done).length;
  const pct = Math.round((done / moves.length) * 100);

  return (
    <div className="space-y-8">
      <section aria-label="بيانات الهوية">
        <h2 className="eyebrow mb-3">الهوية · الاتجاهات (بحد أقصى ٣)</h2>
        <div className="space-y-3">
          {IDENTITIES.map((s) => (
            <p key={s} className="border-r-2 border-r-foreground pr-4 font-serif text-body-l italic">
              {s}
            </p>
          ))}
        </div>
      </section>

      <Card>
        <CardContent className="p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="eyebrow mb-1">الموسم الحالي · الأسابيع ١–١٢</h2>
              <p className="text-heading-s font-medium">"قل الشيء الصحيح أبكر."</p>
            </div>
            <Badge>الأسبوع ٥ من ١٢</Badge>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between font-mono text-label-mono text-muted-foreground">
              <span>خطوات هذا الأسبوع</span>
              <span aria-live="polite">{done} من {moves.length}</span>
            </div>
            <Progress value={pct} aria-label="تقدم خطوات الأسبوع" accent={pct === 100} />
          </div>

          <ul className="mt-6 space-y-1">
            {moves.map((m) => (
              <li key={m.id}>
                <label className="flex cursor-pointer items-center gap-1 rounded-r2 pl-3 transition-colors duration-fast hover:bg-muted">
                  <Checkbox
                    checked={m.done}
                    onChange={() =>
                      setMoves((prev) => prev.map((x) => (x.id === m.id ? { ...x, done: !x.done } : x)))
                    }
                  />
                  <span className={m.done ? "text-body-m text-muted-foreground line-through decoration-1" : "text-body-m"}>
                    {m.text}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {pct === 100 && (
            <p role="status" className="mt-5 font-serif text-body-l">
              خطوات الأسبوع مكتملة. المنجز منجز — بقية الأسبوع مسموح لها أن تكون عادية.
            </p>
          )}
        </CardContent>
      </Card>

      <p className="text-body-s text-muted-foreground">
        هدفان أو ثلاثة في الموسم — الواجهة تُقيّد ذلك حرفياً. كل نعم لهدف رابع هو لا للثلاثة الأولى.
      </p>
    </div>
  );
}
