import { z } from "zod";
import { createHandler } from "@/lib/api";
import { policies } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/server/services/subscription";
import { track } from "@/lib/analytics";

const SPACES = ["general", "inner-dialogue", "work-and-voice", "rebuilding", "wins"] as const;

/**
 * Crisis-safety net (design/02 §10): posts matching these patterns are
 * created FLAGGED → human review queue, and the author immediately receives
 * resource links. Word-boundary matching; this is a safety net, not a filter —
 * struggle is on-topic and must not be suppressed.
 */
const CRISIS_PATTERNS = [
  /\b(kill(ing)? myself|end (it all|my life)|suicid\w*|self[- ]harm)\b/i,
  /\b(don'?t want to (live|be here|wake up))\b/i,
];

const createPostSchema = z.object({
  space: z.enum(SPACES),
  seeking: z.enum(["SUPPORT", "PERSPECTIVES", "ACCOUNTABILITY"]),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(20_000),
  circleId: z.string().cuid().optional(),
});

export const POST = createHandler(
  { auth: "required", bodySchema: createPostSchema, rateLimit: policies.mutation },
  async ({ userId, body }) => {
    // The Commons opens with the Practice tier (design/02 §11).
    await requireTier(userId!, "PRACTICE");

    if (body.circleId) {
      const membership = await prisma.circleMembership.findFirst({
        where: { circleId: body.circleId, userId: userId!, leftAt: null },
      });
      if (!membership) {
        return Response.json(
          { title: "You can only post in a Circle you belong to.", status: 403 },
          { status: 403 },
        );
      }
    }

    const needsReview = CRISIS_PATTERNS.some((p) => p.test(`${body.title}\n${body.body}`));
    const post = await prisma.post.create({
      data: {
        authorId: userId!,
        space: body.space,
        seeking: body.seeking,
        title: body.title,
        body: body.body,
        circleId: body.circleId,
        status: needsReview ? "FLAGGED" : "VISIBLE",
      },
    });

    if (needsReview) {
      await prisma.notification.create({
        data: {
          userId: userId!,
          type: "SYSTEM",
          title: "We saw your post, and we want more for you than a forum can give.",
          body: "A human moderator will read it with care. Meanwhile — people who can help today, free, are one tap away.",
          href: "/resources",
        },
      });
    }

    await track("post_created", { userId: userId!, props: { space: body.space, seeking: body.seeking } });
    return Response.json({ post: { id: post.id, status: post.status } }, { status: 201 });
  },
);

export const GET = createHandler({ auth: "required" }, async ({ userId, req }) => {
  await requireTier(userId!, "PRACTICE");
  const space = req.nextUrl.searchParams.get("space") ?? "general";
  const posts = await prisma.post.findMany({
    where: { space, status: "VISIBLE", circleId: null },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      title: true,
      seeking: true,
      createdAt: true,
      author: { select: { profile: { select: { displayName: true } } } },
      _count: { select: { comments: true } },
      // Witness counts intentionally excluded: never shown publicly.
    },
  });
  return Response.json({ posts });
});
