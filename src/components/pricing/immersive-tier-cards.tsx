"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { pricingTiers } from "@/lib/mock";
import { cn } from "@/lib/utils";

/* ─── World definitions ──────────────────────────────────────────── */

type World = {
  id: string;
  accentHex: string;
  bgFrom: string;
  bgTo: string;
  particleColor: string;
  label: string;
  tagline: string;
  icon: string;
  themes: { title: string; body: string }[];
  journey: string;
  forWhom: string;
  notFor: string;
};

const WORLDS: World[] = [
  {
    id: "free",
    accentHex: "#D4A84B",
    bgFrom: "#1A1205",
    bgTo: "#2E1E08",
    particleColor: "rgba(212,168,75,0.35)",
    label: "عالم الفجر",
    tagline: "البداية هي الشجاعة الوحيدة المطلوبة منك الآن.",
    icon: "◎",
    themes: [
      {
        title: "التشخيص — رسم الصوت الذي تملكه",
        body: "لا يمكنك تغيير ما لم تُسمّه. في المستوى المجاني، تبدأ بأربع دقائق من الأسئلة الصادقة — ليس استبياناً، بل مرآة. الناتج: ملف راويك الداخلي. من أين أتى؟ متى يظهر؟ ما الجملة الحرفية التي يكررها في أصعب لحظاتك؟",
      },
      {
        title: "خطة التكرار الأول — سبعة أيام مع نفسك",
        body: "لست هنا لتجربة منصة. أنت هنا لتجربة نفسك بطريقة مختلفة. خطة الأيام السبعة مصممة لتكون صادقة لا مريحة — ثلاث دقائق، مسجّلة كأدلة، حتى تعرف أن شيئاً ما يتحرك فعلاً.",
      },
      {
        title: "المشاع — قراءة بلا صمت",
        body: "الوصول للقراءة في مجتمع سيلف يُعرّفك على أشخاص يصفون بدقة ما تشعر به لكن لم تجد له كلمات. هذا وحده، لكثيرين، كان كافياً لبدء شيء جديد.",
      },
      {
        title: "لماذا هذا ليس مجرد 'نسخة تجريبية'",
        body: "لا تتلقى محتوى ناقصاً أو ميزات مُشوَّهة. التشخيص هو الباب الأمامي الحقيقي — البناء كله يبدأ من هنا، سواء بقيت مجاناً أو انتقلت. بياناتك، ملفك، سجلك: لك في كلتا الحالتين.",
      },
    ],
    journey:
      "في الأسبوع الأول ستكتشف الجملة الأكثر تكراراً في رأسك. في الأسبوع الثاني ستتساءل من كتبها. هذا التساؤل هو بداية كل شيء.",
    forWhom:
      "أنت فضولي، لكنك لم تقرر بعد. تريد أن تعرف قبل أن تلتزم. هذا بالضبط ما صُمم له المجاني.",
    notFor:
      "إذا كنت تعرف بالفعل أنك تريد بناء ممارسة يومية — انتقل مباشرة إلى الممارسة.",
  },
  {
    id: "practice",
    accentHex: "#C27B2A",
    bgFrom: "#100A02",
    bgTo: "#1E1005",
    particleColor: "rgba(194,123,42,0.4)",
    label: "ورشة الحرفي",
    tagline: "الثقة لا تُكتسب. تُبنى. بالتكرار، بالأدلة، يوماً بيوم.",
    icon: "◈",
    themes: [
      {
        title: "التكرارات — الممارسة اليومية الحقيقية",
        body: "اثنتا عشرة دقيقة. ليست مثالية — صادقة. تكرار موجّه غير محدود يعني أنك تفتح التطبيق كل يوم وهناك شيء محدد يُعيد تشكيل أنماطك بدلاً من قراءة كتاب آخر عن الأنماط.",
      },
      {
        title: "المتتبع — الهوية قبل الفعل",
        body: "لا تتتبع هنا عادات السلوك كما في التطبيقات الأخرى. تتتبع هنا بيانات الهوية: 'أنا شخص يطرح السؤال على أي حال' — ثم تُسجّل إن كنت اليوم كذلك الشخص أم لا. الفرق يبدو لغوياً. نتائجه ليست كذلك.",
      },
      {
        title: "سجل الأدلة — ذاكرة ضد الناقد",
        body: "في اليوم الصعب، عقلك يختار بانتقائية ما يتذكره. سجل الأدلة هو سردية مضادة مبنية منك أنت — حقائق، لحظات، جمل محددة — قابلة للبحث في اللحظة التي تحتاجها. المستقبل الذي تخاف منه لا يعرف أنك بنيت هذا السجل.",
      },
      {
        title: "المجتمع — المنتديات والدوائر والطقوس المباشرة",
        body: "لا غرف دردشة عامة. مساحات مُصنّفة حسب الموضوع — التشخيص، العمل والصوت، الانتكاسة والعودة — يكتب فيها أشخاص يصفون بدقة ما تعيشه. الطقوس المباشرة أسبوعية: تكرار موجّه بصحبة آخرين في الوقت الحقيقي.",
      },
    ],
    journey:
      "الأسبوع الأول: تُدرك الفجوة بين من تقول أنك وكيف تستجيب. الأسبوع الرابع: تلاحظ ردود فعل مختلفة في مواقف مألوفة. الشهر الثالث: تجد نفسك تبني أدلة لم تكن تعلم أنك بحاجة إليها.",
    forWhom:
      "يمكنك الالتزام باثنتي عشرة دقيقة يومياً في معظم الأيام. لا تريد فهماً إضافياً — تريد تغييراً فعلياً.",
    notFor:
      "إذا كنت تريد أيضاً الدورات الأكاديمية وجميع البرامج — الأكاديمية هي وجهتك.",
  },
  {
    id: "academy",
    accentHex: "#4A7DB5",
    bgFrom: "#050B14",
    bgTo: "#0A1520",
    particleColor: "rgba(74,125,181,0.35)",
    label: "مكتبة العمق",
    tagline: "الفهم وحده لا يكفي. لكنه يجعل الممارسة لا ترجع.",
    icon: "◇",
    themes: [
      {
        title: "دورات الأكاديمية — الآليات، لا الوصفات",
        body: "ثماني دورات مُنظّمة: تشريح الحديث الذاتي، معادلة الثقة، هندسة الممارسة، المشاعر بيانات، أدوات التنظيم، أيض النقد، من أين جاءت قصتك، إعادة الكتابة في العمق. كل دورة مبنية على بحث منشور، لا على ذوق أو تجربة شخصية.",
      },
      {
        title: "جميع البرامج مضمّنة — الأسس والصوت والراسخ",
        body: "لا تختار برنامجاً واحداً. الثلاثة متاحة: الأسس (ثمانية أسابيع لبناء ممارستك)، الصوت (ستة أسابيع على الجملة المهيمنة)، الراسخ (اثنا عشر أسبوعاً عندما تكبر الغرفة). تختار الأنسب وقتها — والبقية تنتظرك.",
      },
      {
        title: "ورش العمل — العلم تطبيقاً لا محاضرة",
        body: "ورش شهرية مع خبراء في العلوم المعرفية وعلم الأعصاب والممارسة السريرية. ليست محاضرات — بل جلسات مُصممة لتحويل فهمك إلى تعديل في أداتك الشخصية.",
      },
      {
        title: "لماذا الفهم يُرسّخ الممارسة",
        body: "يومٌ تعرف فيه لماذا تعمل المسافة الذاتية هو يوم يصعب على عقلك رفضها. الأكاديمية لا تُعطيك معلومات أكثر — تُعطيك يقيناً أعمق في الأدوات التي تستخدمها. هذا الفرق يظهر عند الضغط.",
      },
    ],
    journey:
      "الشهر الأول: تبدأ بدورة تشريح الحديث الذاتي وتُدرك أن راويك ليس أنت. الشهر الثالث: تستخدم أدوات التنظيم قبل الدخول لا بعد الخروج. الشهر السادس: لا تتذكر بوضوح كيف كنت تفكر قبل هذا.",
    forWhom:
      "تريد فهم الآليات، لا فقط تطبيق الأدوات. تقرأ البحث وتريد أن تعرف من أين تأتي التوصيات.",
    notFor:
      "إذا تريد العمق مع مجموعة من الأقران وجلسات فردية — الدائرة الداخلية هي مكانك.",
  },
  {
    id: "circle",
    accentHex: "#9B3A2A",
    bgFrom: "#0D0400",
    bgTo: "#180800",
    particleColor: "rgba(155,58,42,0.45)",
    label: "المضمار الداخلي",
    tagline: "بعض التحولات لا تحدث في الوحدة. تحتاج شاهداً.",
    icon: "◉",
    themes: [
      {
        title: "مجموعة الأقران — المرآة الحقيقية",
        body: "ثمانية أشخاص أو أقل. ليسوا عشوائيين — يجمعهم نمط مشترك من التشخيص، ومرحلة متقاربة من الممارسة. المجموعة لا تُعلّمك شيئاً لا تعرفه. تُرجع إليك ما لا تستطيع رؤيته من الداخل.",
      },
      {
        title: "الجلسات الفردية — بُعد آخر للعمل",
        body: "جلسات شهرية مع أحد منسّقي سيلف — ليست علاجاً ولا تدريباً عاماً. بل مراجعة مُنظّمة لتكراراتك وأدلتك وأنماط راويك. الفرق أنك لا تعيد شرح السياق — المنسق يعرف منهجك وسجلك.",
      },
      {
        title: "بالتقديم — ليس الجميع هنا",
        body: "التقديم ليس بوابة نخبوية. هو ضمان أن الشخص الداخل جاهز لهذا المستوى من العمق — وأن المجموعة ستستفيد من وجوده بقدر ما سيستفيد منها. السؤال ليس 'هل أنت مؤهل؟' بل 'هل هذا ما تحتاجه الآن؟'",
      },
      {
        title: "ما يحدث هنا لا يحدث في مكان آخر",
        body: "أن ترى شخصاً آخر يصف نمطك بكلماته — وأن تُدرك أنه لم يقرأ رأسك — هذه تجربة لا يُنتجها محتوى. الدائرة الداخلية مبنية على هذه التجربة بالذات: الإدراك الذي يأتي من الشهادة، لا من الدراسة.",
      },
    ],
    journey:
      "الشهر الأول: تلتقي مجموعتك وتُدرك أنك لم تكن تفكر أنك ستقول هذا. الشهر الثالث: تُلاحظ أنماطاً في الآخرين تُوضح أنماطك أنت. الشهر السادس: السجل الذي بنيته معاً يصبح مرجعاً لا تريد مغادرته.",
    forWhom:
      "أتممت الأسس أو ما يعادله. تريد مرآة لا صفحة. مستعد للعمل بصحبة شهود.",
    notFor: "إذا لم تبنِ ممارسة أساسية بعد — الأسس أولاً. الدائرة تُضاعف ما عندك.",
  },
];

/* ─── Ambient canvas (particle field) ───────────────────────────── */

function AmbientCanvas({ color, active }: { color: string; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const count = active ? 60 : 24;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.2,
      o: Math.random(),
    }));

    let frame = 0;
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      frame++;
      for (const p of pts) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        const pulse = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.01 + p.o * Math.PI * 2));
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = color.replace(")", `,${pulse * (active ? 0.7 : 0.4)})`).replace("rgba(", "rgba(");
        ctx!.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [color, active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}

/* ─── Main component ─────────────────────────────────────────────── */

export function ImmersiveTierCards() {
  const [active, setActive] = useState<string | null>(null);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const expandRef = useRef<HTMLDivElement>(null);

  function open(id: string) {
    setActive(id);
    setTimeout(() => expandRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
  }
  function close() {
    setActive(null);
  }

  const activeWorld = WORLDS.find((w) => w.id === active);
  const activeTier = active ? pricingTiers[WORLDS.findIndex((w) => w.id === active)] : null;

  return (
    <div>
      {/* Billing toggle */}
      <div
        role="radiogroup"
        aria-label="دورة الفوترة"
        className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full border border-border p-1"
      >
        {(["monthly", "annual"] as const).map((opt) => (
          <button
            key={opt}
            role="radio"
            aria-checked={billing === opt}
            onClick={() => setBilling(opt)}
            className={cn(
              "min-h-11 rounded-full px-5 text-body-s transition-colors duration-fast",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              billing === opt
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt === "monthly" ? "شهري" : "سنوي · شهران مجاناً"}
          </button>
        ))}
      </div>

      {/* 4 world cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {WORLDS.map((world, i) => {
          const tier = pricingTiers[i]!;
          const isActive = active === world.id;

          return (
            <motion.button
              key={world.id}
              onClick={() => (isActive ? close() : open(world.id))}
              aria-expanded={isActive}
              aria-label={`دخول عالم ${tier.name}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl text-right transition-all",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                isActive ? "ring-2" : "hover:scale-[1.015]",
              )}
              style={{
                background: `linear-gradient(135deg, ${world.bgFrom}, ${world.bgTo})`,
                ringColor: world.accentHex,
                minHeight: "280px",
              } as React.CSSProperties}
              whileHover={{ y: isActive ? 0 : -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Ambient particles */}
              <AmbientCanvas color={world.particleColor} active={isActive} />

              {/* Radial glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(ellipse at 30% 50%, ${world.accentHex}18, transparent 65%)`,
                  opacity: isActive ? 1 : 0.5,
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-between p-7 text-right">
                <div className="flex items-start justify-between">
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300"
                    style={{ color: world.accentHex }}
                  >
                    {world.label}
                  </span>
                  <span
                    className="text-2xl transition-transform duration-500 group-hover:scale-110"
                    style={{ color: world.accentHex }}
                    aria-hidden
                  >
                    {isActive ? "✕" : world.icon}
                  </span>
                </div>

                <div className="mt-8">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                    {tier.monthly === null
                      ? "بالتقديم"
                      : tier.monthly === 0
                      ? "مجاني"
                      : billing === "monthly"
                      ? `${tier.monthly}$ / شهر`
                      : `${tier.annual}$ / سنة`}
                  </p>
                  <h3 className="mt-2 text-3xl font-medium text-white">{tier.name}</h3>
                  <p
                    className="mt-2 text-sm leading-relaxed text-white/60"
                    style={{ fontFamily: "serif" }}
                  >
                    {tier.identity}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <span
                    className="text-xs text-white/40 transition-all duration-300 group-hover:text-white/70"
                  >
                    {isActive ? "اضغط للإغلاق" : "اضغط للدخول →"}
                  </span>
                  <motion.div
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/30"
                  >
                    ↓
                  </motion.div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Immersive expanded world */}
      <AnimatePresence mode="wait">
        {activeWorld && activeTier && (
          <motion.div
            ref={expandRef}
            key={activeWorld.id}
            initial={{ opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, y: -20, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-5 overflow-hidden rounded-2xl"
            style={{ background: `linear-gradient(160deg, ${activeWorld.bgFrom}, ${activeWorld.bgTo})` }}
          >
            {/* Background canvas */}
            <AmbientCanvas color={activeWorld.particleColor} active />

            {/* Radial glow overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 20% 20%, ${activeWorld.accentHex}20, transparent 55%)`,
              }}
            />

            <div className="relative z-10 px-8 py-12 md:px-14 md:py-16">
              {/* World header */}
              <div className="mb-14 border-b pb-10" style={{ borderColor: `${activeWorld.accentHex}25` }}>
                <p
                  className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: activeWorld.accentHex }}
                >
                  {activeWorld.label}
                </p>
                <h2 className="text-4xl font-medium text-white md:text-5xl">{activeTier.name}</h2>
                <p className="mt-5 max-w-2xl font-serif text-xl italic leading-relaxed text-white/70">
                  {activeWorld.tagline}
                </p>
              </div>

              {/* Rich themes */}
              <div className="grid gap-10 md:grid-cols-2">
                {activeWorld.themes.map((theme, idx) => (
                  <motion.div
                    key={theme.title}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.09, duration: 0.5, ease: "easeOut" }}
                  >
                    <div
                      className="mb-1 h-px w-10"
                      style={{ background: activeWorld.accentHex }}
                      aria-hidden
                    />
                    <h3
                      className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em]"
                      style={{ color: activeWorld.accentHex }}
                    >
                      {theme.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.85] text-white/65">
                      {theme.body}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Journey arc */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-14 rounded-xl border p-7"
                style={{ borderColor: `${activeWorld.accentHex}20`, background: "rgba(255,255,255,0.03)" }}
              >
                <p
                  className="mb-3 font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: activeWorld.accentHex }}
                >
                  رحلة التحول
                </p>
                <p className="font-serif text-lg italic leading-[1.9] text-white/75">
                  {activeWorld.journey}
                </p>
              </motion.div>

              {/* For whom / Not for */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-10 grid gap-6 md:grid-cols-2"
              >
                <div className="rounded-xl border p-6" style={{ borderColor: `${activeWorld.accentHex}18` }}>
                  <p
                    className="mb-3 font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: activeWorld.accentHex }}
                  >
                    هذا لك إذا
                  </p>
                  <p className="text-[14px] leading-[1.8] text-white/60">{activeWorld.forWhom}</p>
                </div>
                <div className="rounded-xl border p-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">
                    ليس الوقت المناسب إذا
                  </p>
                  <p className="text-[14px] leading-[1.8] text-white/40">{activeWorld.notFor}</p>
                </div>
              </motion.div>

              {/* Features & CTA */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-12 flex flex-col gap-8 border-t pt-10 md:flex-row md:items-start md:justify-between"
                style={{ borderColor: `${activeWorld.accentHex}20` }}
              >
                <div>
                  <p
                    className="mb-4 font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: activeWorld.accentHex }}
                  >
                    ما يشمله
                  </p>
                  <ul className="space-y-2">
                    {activeTier.features.map((f) => (
                      <li key={f} className="flex gap-3 text-[14px] text-white/55">
                        <span style={{ color: activeWorld.accentHex }} aria-hidden>
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col items-start gap-4 md:items-end">
                  <p className="text-4xl font-medium text-white">
                    {activeTier.monthly === null ? (
                      <span className="text-2xl text-white/70">بالتقديم</span>
                    ) : activeTier.monthly === 0 ? (
                      "$0"
                    ) : billing === "monthly" ? (
                      <>
                        ${activeTier.monthly}
                        <span className="text-base text-white/40">/شهر</span>
                      </>
                    ) : (
                      <>
                        ${activeTier.annual}
                        <span className="text-base text-white/40">/سنة</span>
                      </>
                    )}
                  </p>
                  <Link
                    href={activeTier.monthly === null ? "/contact" : "/signin"}
                    className="inline-flex min-h-12 items-center rounded-xl px-8 text-sm font-medium text-black transition-all hover:brightness-110 active:scale-95"
                    style={{ background: activeWorld.accentHex }}
                  >
                    {activeTier.cta}
                  </Link>
                  <button
                    onClick={close}
                    className="text-[13px] text-white/30 underline underline-offset-4 hover:text-white/60"
                  >
                    إغلاق العالم
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
