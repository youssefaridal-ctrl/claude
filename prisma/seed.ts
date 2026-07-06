import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** MVP seed: categories, challenge deck, full course catalog, five flagship articles. */
async function main() {
  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------
  const categoryDefs = [
    { slug: "foundations", name: "Foundations" },
    { slug: "inner-dialogue", name: "Inner Dialogue" },
    { slug: "the-rewrite", name: "The Rewrite" },
    { slug: "emotional-mastery", name: "Emotional Mastery" },
    { slug: "identity-and-beliefs", name: "Identity & Beliefs" },
    { slug: "practice-and-habits", name: "Practice & Habits" },
    { slug: "thresholds", name: "Thresholds" },
    { slug: "rebuilding", name: "Rebuilding" },
    { slug: "the-science", name: "The Science" },
    { slug: "field-notes", name: "Field Notes" },
  ];

  const categoryMap: Record<string, string> = {};
  for (const [i, cat] of categoryDefs.entries()) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: { slug: cat.slug, name: cat.name, position: i },
      update: { position: i },
    });
    categoryMap[cat.slug] = row.id;
  }

  // ---------------------------------------------------------------------------
  // Editorial user (author for seeded articles)
  // ---------------------------------------------------------------------------
  const editor = await prisma.user.upsert({
    where: { email: "editorial@selv.app" },
    create: {
      email: "editorial@selv.app",
      name: "SELV Editorial",
      role: "EDITOR",
    },
    update: {},
  });

  // ---------------------------------------------------------------------------
  // Challenge deck (content/03 §J)
  // ---------------------------------------------------------------------------
  const challenges = [
    { domain: "voice-at-work", tierLevel: 1, title: "Ask one question early", description: "Ask one question in a meeting within the first ten minutes." },
    { domain: "social", tierLevel: 1, title: "One specific compliment", description: "Give one specific compliment out loud." },
    { domain: "voice-at-work", tierLevel: 1, title: `Say "I don't know"`, description: `Say "I don't know" once, without apologizing for it.` },
    { domain: "asking", tierLevel: 1, title: "State a preference", description: `State a preference where you'd usually say "either's fine."` },
    { domain: "visibility", tierLevel: 2, title: "Send the message", description: "Send the message you've been drafting in your head for a week." },
    { domain: "social", tierLevel: 2, title: "Let the silence sit", description: "Let a silence sit for three seconds before filling it." },
    { domain: "asking", tierLevel: 2, title: "Decline without an essay", description: `Decline one thing without a three-line excuse. "I can't take that on" is complete.` },
    { domain: "visibility", tierLevel: 2, title: "Opinion before the room's", description: "Share one opinion before hearing the room's." },
    { domain: "solitude", tierLevel: 1, title: "Ten unphoned minutes", description: "Eat, sit, or walk somewhere alone, un-phoned, ten minutes." },
    { domain: "visibility", tierLevel: 3, title: "Say what you're becoming", description: "Tell someone what you're working on becoming. Out loud." },
  ];
  for (const c of challenges) {
    const exists = await prisma.challenge.findFirst({ where: { title: c.title } });
    if (!exists) await prisma.challenge.create({ data: c });
  }

  // ---------------------------------------------------------------------------
  // Courses — full Academy catalog (content/01 §Courses)
  // ---------------------------------------------------------------------------
  const courseDefs = [
    {
      slug: "the-anatomy-of-self-talk",
      title: "The Anatomy of Self-Talk",
      promise: "Where the inner voice comes from and why it sounds like that.",
      summary: "Six lessons on the origins, mechanics, and levers of inner speech — the foundation for every rewrite you'll ever do.",
      position: 1,
      requiredTier: "ACADEMY" as const,
      modules: [
        {
          title: "Origins",
          position: 1,
          lessons: [
            { title: "The voice nobody hears but you", position: 1, durationMinutes: 12, isPreview: true, repPrompt: "Write down, verbatim, the last unkind sentence your inner voice said. Just quote it." },
            { title: "Whose voice is it, originally?", position: 2, durationMinutes: 14, isPreview: false, repPrompt: "Pick your most recurring line and write its museum label: acquired when, from whom, protecting what." },
          ],
        },
        {
          title: "Mechanics",
          position: 2,
          lessons: [
            { title: "Feelings, facts, and forecasts", position: 1, durationMinutes: 11, isPreview: false, repPrompt: "Take yesterday's harshest self-judgment and sort it: is this a feeling, a fact, or a forecast?" },
            { title: "The labeling effect", position: 2, durationMinutes: 13, isPreview: false, repPrompt: "Name the emotion in the last thought that snagged you. Just the word." },
          ],
        },
        {
          title: "Levers",
          position: 3,
          lessons: [
            { title: "Distance as a tool", position: 1, durationMinutes: 10, isPreview: false, repPrompt: "Rewrite your last worry in third person, using your name." },
            { title: "The believability rule", position: 2, durationMinutes: 12, isPreview: false, repPrompt: "Rate today's harshest self-statement for believability 1–10. What would a 7 sound like?" },
          ],
        },
      ],
    },
    {
      slug: "the-confidence-equation",
      title: "The Confidence Equation",
      promise: "Evidence, appraisal, and why achievement alone never settles the question.",
      summary: "Five lessons on why competence and confidence diverge, and how to build the kind that doesn't depend on the last outcome.",
      position: 2,
      requiredTier: "ACADEMY" as const,
      modules: [
        {
          title: "The Equation",
          position: 1,
          lessons: [
            { title: "Why the trophy doesn't help", position: 1, durationMinutes: 13, isPreview: false, repPrompt: "Name one achievement that didn't settle the question. Write one sentence about why." },
            { title: "Competence vs. confidence", position: 2, durationMinutes: 12, isPreview: false, repPrompt: "List three things you're objectively competent at that still feel uncertain." },
            { title: "The appraisal loop", position: 3, durationMinutes: 10, isPreview: false, repPrompt: "Trace your last self-doubt to an appraisal. What were you comparing yourself to?" },
            { title: "Evidence you own", position: 4, durationMinutes: 11, isPreview: false, repPrompt: "Write three pieces of behavioral evidence for something you doubt about yourself." },
            { title: "Maintenance and meaning", position: 5, durationMinutes: 14, isPreview: false, repPrompt: `Write your working sentence for this domain: "I am someone who..."` },
          ],
        },
      ],
    },
    {
      slug: "practice-architecture",
      title: "Practice Architecture",
      promise: "Build a daily practice that survives motivation's disappearance.",
      summary: "Five lessons on habit design for practices that aren't automatically rewarding — where consistency comes from structure, not willpower.",
      position: 3,
      requiredTier: "ACADEMY" as const,
      modules: [
        {
          title: "The Architecture",
          position: 1,
          lessons: [
            { title: "Why motivation is a terrible plan", position: 1, durationMinutes: 10, isPreview: false, repPrompt: "Name one practice you've tried to maintain by motivation alone. What broke it?" },
            { title: "The minimum viable rep", position: 2, durationMinutes: 12, isPreview: false, repPrompt: "Design a three-minute version of your practice. Write it out." },
            { title: "Stacking and anchoring", position: 3, durationMinutes: 11, isPreview: false, repPrompt: "Identify one existing habit. Attach your minimum rep to it." },
            { title: "Grace-based tracking", position: 4, durationMinutes: 9, isPreview: false, repPrompt: "Define your personal grace rule: what counts as a kept week for you?" },
            { title: "Designing for the bad day", position: 5, durationMinutes: 13, isPreview: false, repPrompt: "Write your bad-day version of the practice. Honest, small, doable." },
          ],
        },
      ],
    },
    {
      slug: "emotions-are-data",
      title: "Emotions Are Data",
      promise: "Reading feelings as signals without obeying them as orders.",
      summary: "Six lessons on the information value of emotion, and how to read the signal without being consumed by the noise.",
      position: 4,
      requiredTier: "ACADEMY" as const,
      modules: [
        {
          title: "Reading the Signal",
          position: 1,
          lessons: [
            { title: "The construction of feeling", position: 1, durationMinutes: 14, isPreview: false, repPrompt: "Track one emotion today from first signal to action. Just observe." },
            { title: "What anxiety is actually saying", position: 2, durationMinutes: 13, isPreview: false, repPrompt: "Translate your last anxious thought: what information was it trying to deliver?" },
            { title: "Anger as a boundary map", position: 3, durationMinutes: 11, isPreview: false, repPrompt: "Locate a recent anger. What value was being violated?" },
            { title: "Shame vs. guilt", position: 4, durationMinutes: 12, isPreview: false, repPrompt: "Recall a recent shame response. What would guilt have said instead?" },
            { title: "The obeying habit", position: 5, durationMinutes: 10, isPreview: false, repPrompt: "Note one emotion you obeyed this week as an order rather than reading as data." },
            { title: "Signal extraction", position: 6, durationMinutes: 15, isPreview: false, repPrompt: `Take one current feeling and write its signal cleanly: "This is telling me..."` },
          ],
        },
      ],
    },
    {
      slug: "the-regulation-toolkit",
      title: "The Regulation Toolkit",
      promise: "Breath, labeling, reappraisal, movement: what works, when, and why.",
      summary: "Seven lessons on the science and practice of emotional regulation — the tools that actually move the dial.",
      position: 5,
      requiredTier: "ACADEMY" as const,
      modules: [
        {
          title: "The Toolkit",
          position: 1,
          lessons: [
            { title: "What regulation actually means", position: 1, durationMinutes: 11, isPreview: true, repPrompt: `Define your personal regulation goal: what does "regulated" feel like for you?` },
            { title: "Breath: the honest evidence", position: 2, durationMinutes: 13, isPreview: false, repPrompt: "Try box breathing once. Write exactly what happened." },
            { title: "Affect labeling", position: 3, durationMinutes: 10, isPreview: false, repPrompt: "Label five emotions today with the specificity exercise." },
            { title: "Reappraisal mechanics", position: 4, durationMinutes: 14, isPreview: false, repPrompt: "Take a recent stressor and write three alternative interpretations — including the most charitable." },
            { title: "Movement as regulation", position: 5, durationMinutes: 9, isPreview: false, repPrompt: "Identify the movement intervention you'll use for your dominant dysregulation pattern." },
            { title: "Choosing your tool", position: 6, durationMinutes: 11, isPreview: false, repPrompt: "Map your three most common regulation moments to their best tools." },
            { title: "Building a regulation menu", position: 7, durationMinutes: 13, isPreview: false, repPrompt: "Write your personal regulation menu: one tool per context, kept somewhere you'll find it." },
          ],
        },
      ],
    },
    {
      slug: "the-criticism-metabolism",
      title: "The Criticism Metabolism",
      promise: "Taking feedback without swallowing verdicts.",
      summary: "Four lessons on the distinction between information and verdict, and the skill of metabolizing criticism without it becoming identity.",
      position: 6,
      requiredTier: "ACADEMY" as const,
      modules: [
        {
          title: "Metabolism",
          position: 1,
          lessons: [
            { title: "Information vs. verdict", position: 1, durationMinutes: 12, isPreview: false, repPrompt: "Sort recent feedback: what was information and what was verdict?" },
            { title: "The identity trigger", position: 2, durationMinutes: 11, isPreview: false, repPrompt: "Name the criticism that lands hardest. What identity claim is it touching?" },
            { title: "The extraction protocol", position: 3, durationMinutes: 14, isPreview: false, repPrompt: "Take one piece of feedback. Extract the information; set the verdict down." },
            { title: "Recovering under observation", position: 4, durationMinutes: 10, isPreview: false, repPrompt: "Design your visible recovery move for public criticism." },
          ],
        },
      ],
    },
    {
      slug: "where-your-story-came-from",
      title: "Where Your Story Came From",
      promise: "Family scripts, cultural scripts, and the archaeology of 'who I am.'",
      summary: "Six lessons on the origins of identity narratives — who wrote your story, and whether you've ratified it.",
      position: 7,
      requiredTier: "ACADEMY" as const,
      modules: [
        {
          title: "The Archaeology",
          position: 1,
          lessons: [
            { title: "Your first narrator", position: 1, durationMinutes: 13, isPreview: false, repPrompt: "Write your earliest memory of being told who you were. The sentence, if you can find it." },
            { title: "Family scripts", position: 2, durationMinutes: 14, isPreview: false, repPrompt: "Identify two messages your family carried about confidence, visibility, or worthiness." },
            { title: "Cultural scripts", position: 3, durationMinutes: 11, isPreview: false, repPrompt: "Name one cultural message about who people like you are allowed to be." },
            { title: "The ratification question", position: 4, durationMinutes: 10, isPreview: false, repPrompt: "Which of your inherited stories have you ratified? Write the one you want to revisit." },
            { title: "Authoring a working sentence", position: 5, durationMinutes: 13, isPreview: false, repPrompt: "Write a working identity sentence for one area you want to reauthor." },
            { title: "The ongoing edit", position: 6, durationMinutes: 12, isPreview: false, repPrompt: "Commit your story to paper: where it came from, what you're keeping, what you're revising." },
          ],
        },
      ],
    },
    {
      slug: "the-rewrite-deep",
      title: "The Rewrite, Deep",
      promise: "Advanced dialogue transformation: believability engineering, relapse design.",
      summary: "Seven lessons for people who've done the foundational work and want to tackle their hardest narrator — the one that survives good days.",
      position: 8,
      requiredTier: "ACADEMY" as const,
      modules: [
        {
          title: "Deep Rewrite",
          position: 1,
          lessons: [
            { title: "The hardest line", position: 1, durationMinutes: 14, isPreview: false, repPrompt: "Write the sentence your inner voice saves for your worst days. Verbatim." },
            { title: "Believability engineering", position: 2, durationMinutes: 15, isPreview: false, repPrompt: "Rate your rewrite for believability. Iterate until it passes 7." },
            { title: "Load testing", position: 3, durationMinutes: 12, isPreview: false, repPrompt: "Test your rewrite under simulated pressure. What happens at 8 on the anxiety scale?" },
            { title: "The relapse design", position: 4, durationMinutes: 13, isPreview: false, repPrompt: "Write your relapse plan: what the old voice returning looks like, and your first move." },
            { title: "Counter-evidence stacking", position: 5, durationMinutes: 11, isPreview: false, repPrompt: "Build a counter-evidence stack for your hardest line: five behaviors, not conclusions." },
            { title: "The maintenance protocol", position: 6, durationMinutes: 10, isPreview: false, repPrompt: "Define your maintenance practice for this line. Frequency, format, review trigger." },
            { title: "Graduation criteria", position: 7, durationMinutes: 14, isPreview: false, repPrompt: "Write your graduation criteria: what does 'done' with this pattern look like?" },
          ],
        },
      ],
    },
  ];

  for (const def of courseDefs) {
    const { modules: moduleDefs, ...courseData } = def;
    const existing = await prisma.course.findUnique({ where: { slug: courseData.slug } });
    if (!existing) {
      await prisma.course.create({
        data: {
          ...courseData,
          status: "PUBLISHED",
          modules: {
            create: moduleDefs.map((mod) => ({
              title: mod.title,
              position: mod.position,
              lessons: {
                create: mod.lessons.map((l) => ({
                  title: l.title,
                  position: l.position,
                  durationMinutes: l.durationMinutes,
                  isPreview: l.isPreview,
                  bodyMdx: `# ${l.title}\n\n_Lesson body ships with the content import._`,
                  repPrompt: l.repPrompt,
                })),
              },
            })),
          },
        },
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Articles — five flagship essays (content/02)
  // ---------------------------------------------------------------------------
  const articleDefs = [
    {
      slug: "the-inner-critic-is-a-bodyguard",
      title: "The Inner Critic Is a Bodyguard With Terrible Manners",
      dek: "Your critic isn't trying to destroy you — it's protecting you with strategies it learned decades ago.",
      inBrief: "The inner critic has a protective function. It speaks loudest at thresholds. Understanding its job changes your relationship to it.",
      categorySlug: "inner-dialogue",
      readMinutes: 9,
      bodyMdx: `Your inner critic has a job. It learned that job when the stakes were higher than they are now, and it has never been told the world changed.

There's a sentence your inner voice says that you'd never say to anyone you love. You know the one. Here's the question almost nobody asks about that sentence: what is it for? Because psychological habits don't persist for decades unless they're doing a job. And the inner critic, for all its cruelty, has one of the oldest jobs there is. It's trying to keep you safe.

Watch the critic's timing and the pattern appears. It speaks loudest at thresholds — before you raise your hand, submit the application, say the honest thing. It goes quiet when you play small. That's not a coincidence. That's a security system designed for an environment that no longer exists.

The mechanism is threat-anticipation. Your brain learned, usually in childhood, that certain kinds of visibility or assertion carried social risk. The critic's job was to preemptively produce the criticism before someone else could, giving you a chance to course-correct before the damage was done. This is protective. It's also, in most modern contexts, miscalibrated.

Every critic line is a warning about something you care about, delivered in the worst possible dialect. "You're going to embarrass yourself" translates to: this matters to you, and you want to do it well. Translation strips the packaging and keeps the signal — and precision, unlike insult, calms the brain's alarm.

The reframe is not: my inner critic is actually kind. It isn't. The reframe is: my inner critic is a bodyguard with terrible manners. Its threat assessments are usually outdated. Its delivery is always counterproductive. But underneath the noise is information worth extracting.

The critic does not disappear. What changes — for most people, noticeably inside two to three weeks of deliberate practice — is your relationship to the voice: it becomes a character you recognize rather than a narrator you obey. In that gap, choice lives.`,
    },
    {
      slug: "why-affirmations-fail",
      title: "Why Affirmations Fail — and What to Say to Yourself Instead",
      dek: `"I am confident" bounces off the mind's fact-checker. Believable sentences don't.`,
      inBrief: "Positive affirmations backfire when the mind's fact-checker rejects them. Believable, evidence-based sentences work where hype doesn't.",
      categorySlug: "the-rewrite",
      readMinutes: 8,
      bodyMdx: `"I am confident" is a lie. And your brain knows it.

The self-help literature has spent decades recommending affirmations — positive, present-tense declarations about the self — as a tool for confidence. The evidence for this is, to put it charitably, thin. The evidence against it, for people who already doubt themselves, is fairly robust.

Here is what happens when someone with low self-esteem says "I am confident" in the mirror: the brain's fact-checking system, which is always running, immediately produces counterevidence. You said you're confident. Really? Let me show you the last twelve times that wasn't true. The affirmation triggers the rebuttal. The rebuttal wins, because it has evidence on its side.

The problem is not positive self-talk. The problem is implausible positive self-talk. The mind is not a whiteboard you can write over — it's a court, and it evaluates the claim against the record.

What works instead is what researchers call "self-affirmation" (a different thing from positive affirmations) and what practitioners call believable rewriting. The distinction is this: instead of asserting a trait you don't feel you have, you describe a behavior you actually performed. "I said the hard thing in the meeting" is checkable. "I am confident" is not.

Believability is the operative concept. A sentence doesn't need to feel triumphant to be useful — it needs to pass the mind's credibility test. "I'm someone who keeps showing up even when it's uncomfortable" passes. "I'm fearless" does not.

The practical rule: rate your self-statement on a believability scale of 1 to 10. If it's below 7, rewrite it. Lower the claim, keep the growth direction, add behavioral evidence. Iterate until it's something your own fact-checker can't easily dismiss.`,
    },
    {
      slug: "the-2am-tribunal",
      title: "The 2 A.M. Tribunal: Why Your Mind Re-Runs the Day",
      dek: "The late-night replay feels like quality control. It's a threat rehearsal — and it can be adjourned.",
      inBrief: "The nightly mental replay is post-event processing, not learning. It responds to closure signals, not resolution.",
      categorySlug: "emotional-mastery",
      readMinutes: 10,
      bodyMdx: `The lights are off. The day is over. And somewhere in your head, a courtroom comes to order.

Exhibit A: the joke that landed wrong. Exhibit B: the email you should have worded differently. Exhibit C — the tribunal has been waiting all day for this one — the moment in the meeting when you said the thing, and there was a pause, and someone changed the subject.

You know this court. It convenes at 2 a.m., accepts no defense counsel, and has never once returned a verdict of innocent. And here is the fact about it that changes everything: it isn't malfunctioning. It's a review process — running with the wrong settings, at the wrong hour, with no adjournment protocol.

Your brain reviews social experience for the same reason it reviews near-misses in traffic: the stakes used to be existence-level. The process has a name in the clinical literature — post-event processing — and the research on it converges on an uncomfortable finding: the replay doesn't do what it promises. It feels like learning. Measured, it isn't.

What the replay does instead: it rehearses threat responses. You re-experience the scenario from a defensive crouch, mining it for signs that the danger is ongoing. The processing loop activates when the brain detects unresolved social threat and stops only when it receives a closure signal.

This is the leverage point. The review process doesn't require resolution — the joke still landed wrong, the email is sent — it requires closure. A closure signal tells the system: this event has been processed and filed. It doesn't need rehearsing anymore.

The adjournment protocol is a written exercise done before bed. Write the charges — one observable fact per replay item, no editorializing. Extract one action or stamp it dismissed. Close the file on paper. The brain, which is looking for evidence of processing, accepts the record as the processing.

Most people report meaningful improvement within one week. Not because the moments stop mattering, but because they stop re-running.`,
    },
    {
      slug: "where-confidence-actually-comes-from",
      title: "Confidence Doesn't Come From Achievement. Here's Where It Actually Comes From.",
      dek: "If achievement produced confidence, the most accomplished would doubt themselves least. They don't.",
      inBrief: "Confidence is not the output of achievement but of self-appraisal — the story we tell about what our actions mean.",
      categorySlug: "foundations",
      readMinutes: 9,
      bodyMdx: `Here is the puzzle that a lot of high-achievers encounter and can't explain: they've done everything they were supposed to do. The credential, the promotion, the performance. And they still feel like someone is going to figure out they don't belong.

This is not a character flaw. It's evidence that the model is wrong.

The conventional model says: achieve things, build confidence. Accumulate external evidence of competence, and the inner voice will update accordingly. This model is intuitive, widely believed, and largely inaccurate.

What the research shows is more interesting. Confidence is not the output of achievement — it's the output of appraisal. It's not what you've done; it's the story you tell about what your actions mean. Two people can complete the same task and come away with different confidence levels, because they attribute the success differently: luck versus skill, externally driven versus internally motivated, a one-off versus a pattern.

The implication is uncomfortable: you could keep achieving and keep feeling the same, because the appraisal system isn't being addressed. The trophy is real. Your interpretation of what the trophy means is what needs to change.

This is why the practice of collecting behavioral evidence matters — not as a motivational technique, but as a correction to attribution. When you deliberately note what you did and why it worked, you're training the appraisal system to update on the evidence rather than default to its prior.

The prior, for most people, was set early. And it has inertia. But it can be revised. That's the whole project.`,
    },
    {
      slug: "talk-to-yourself-by-name",
      title: "Talk to Yourself by Name. (It's Not Weird.)",
      dek: "Distanced self-talk measurably reduces stress reactivity — and costs one pronoun.",
      inBrief: "Using your own name in self-talk creates psychological distance that reduces emotional reactivity and improves decision-making under pressure.",
      categorySlug: "the-rewrite",
      readMinutes: 7,
      bodyMdx: `There is a technique supported by two decades of research that feels strange for approximately one session, after which most people refuse to stop using it.

It costs nothing. It requires no new vocabulary. It works by changing one word.

Distanced self-talk is the practice of addressing yourself in the second or third person rather than the first. Instead of "I'm so nervous about this," you say "You're nervous about this — that makes sense given what's at stake." Or, most powerfully, you use your own name: "[Your name], what do you actually know about this situation?"

The mechanism is psychological distance. When you use "I," you're inside the experience. When you use your name or "you," you create a slight separation — enough to activate the parts of the brain associated with perspective-taking rather than threat-response.

The research, most prominently from Ethan Kross and colleagues at Michigan, shows consistent effects: reduced emotional reactivity, better performance under stress, lower rumination after difficult events, improved social reasoning. The effects appear within a single session and are robust across personality types.

The explanation is evolutionary. We've always been better at advising others than advising ourselves — the advice-giver has distance from the emotional stakes. Distanced self-talk manufactures that distance synthetically.

Practically: the easiest entry point is self-talk at decision moments. When you notice a spiral starting, or a high-stakes moment approaching, shift the pronoun. "[Name], what do you know? What do you need? What's actually at stake here?" Three questions. One pronoun change. The research says the brain processes them differently.

Most people find it absurd the first time. Most people use it regularly by the end of the week.`,
    },
  ];

  for (const def of articleDefs) {
    const { categorySlug, ...articleData } = def;
    const categoryId = categoryMap[categorySlug];
    if (!categoryId) continue;

    await prisma.article.upsert({
      where: { slug: articleData.slug },
      create: {
        ...articleData,
        categoryId,
        authorId: editor.id,
        status: "PUBLISHED",
        publishedAt: new Date("2026-06-01T00:00:00Z"),
        tags: [],
      },
      update: {
        title: articleData.title,
        dek: articleData.dek,
        inBrief: articleData.inBrief,
        bodyMdx: articleData.bodyMdx,
        categoryId,
        status: "PUBLISHED",
        publishedAt: new Date("2026-06-01T00:00:00Z"),
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
