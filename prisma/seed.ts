import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Launch seed: categories, the challenge deck sample, and a demo course shell. */
async function main() {
  // Library categories (content/06 §1)
  const categories = [
    "foundations",
    "inner-dialogue",
    "the-rewrite",
    "emotional-mastery",
    "identity-and-beliefs",
    "practice-and-habits",
    "thresholds",
    "rebuilding",
    "the-science",
    "field-notes",
  ];
  for (const [i, slug] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug },
      create: { slug, name: titleCase(slug), position: i },
      update: { position: i },
    });
  }

  // "Small Brave Things" deck sample (content/03 §J)
  const challenges: { domain: string; tierLevel: number; title: string; description: string }[] = [
    { domain: "voice-at-work", tierLevel: 1, title: "Ask one question early", description: "Ask one question in a meeting within the first ten minutes." },
    { domain: "social", tierLevel: 1, title: "One specific compliment", description: "Give one specific compliment out loud." },
    { domain: "voice-at-work", tierLevel: 1, title: "Say “I don't know”", description: "Say “I don't know” once, without apologizing for it." },
    { domain: "asking", tierLevel: 1, title: "State a preference", description: "State a preference where you'd usually say “either's fine.”" },
    { domain: "visibility", tierLevel: 2, title: "Send the message", description: "Send the message you've been drafting in your head for a week." },
    { domain: "social", tierLevel: 2, title: "Let the silence sit", description: "Let a silence sit for three seconds before filling it." },
    { domain: "asking", tierLevel: 2, title: "Decline without an essay", description: "Decline one thing without a three-line excuse. “I can't take that on” is complete." },
    { domain: "visibility", tierLevel: 2, title: "Opinion before the room's", description: "Share one opinion before hearing the room's." },
    { domain: "solitude", tierLevel: 1, title: "Ten unphoned minutes", description: "Eat, sit, or walk somewhere alone, un-phoned, ten minutes." },
    { domain: "visibility", tierLevel: 3, title: "Say what you're becoming", description: "Tell someone what you're working on becoming. Out loud." },
  ];
  for (const c of challenges) {
    const exists = await prisma.challenge.findFirst({ where: { title: c.title } });
    if (!exists) await prisma.challenge.create({ data: c });
  }

  // Demo course shell (content/01 catalog #1)
  await prisma.course.upsert({
    where: { slug: "the-anatomy-of-self-talk" },
    create: {
      slug: "the-anatomy-of-self-talk",
      title: "The Anatomy of Self-Talk",
      promise: "Where the inner voice comes from and why it sounds like that.",
      summary:
        "Six lessons on the origins, mechanics, and levers of inner speech — the foundation for every rewrite you'll ever do.",
      requiredTier: "ACADEMY",
      status: "PUBLISHED",
      position: 1,
      modules: {
        create: [
          {
            title: "Origins",
            position: 1,
            lessons: {
              create: [
                {
                  title: "The voice nobody hears but you",
                  position: 1,
                  durationMinutes: 12,
                  isPreview: true,
                  bodyMdx: "# The voice nobody hears but you\n\n_Lesson body ships with the content import._",
                  repPrompt: "Write down, verbatim, the last unkind sentence your inner voice said. Just quote it.",
                },
                {
                  title: "Whose voice is it, originally?",
                  position: 2,
                  durationMinutes: 14,
                  bodyMdx: "# Whose voice is it, originally?\n\n_Lesson body ships with the content import._",
                  repPrompt: "Pick your most recurring line and write its museum label: acquired when, from whom, protecting what.",
                },
              ],
            },
          },
        ],
      },
    },
    update: {},
  });

  console.log("Seed complete.");
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w === "and" ? "&" : w[0]!.toUpperCase() + w.slice(1)))
    .join(" ");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
