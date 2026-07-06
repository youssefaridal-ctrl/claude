import { describe, expect, it, vi, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock prisma before importing the service so the service never hits a DB.
// ---------------------------------------------------------------------------

vi.mock("@/lib/prisma", () => ({
  prisma: {
    article: {
      findMany: vi.fn().mockRejectedValue(new Error("no db")),
      findUnique: vi.fn().mockRejectedValue(new Error("no db")),
    },
    course: {
      findMany: vi.fn().mockRejectedValue(new Error("no db")),
      findFirst: vi.fn().mockRejectedValue(new Error("no db")),
    },
  },
}));

import {
  listPublishedArticles,
  getArticleBySlug,
  listPublishedCourses,
  getCourseBySlug,
} from "@/server/services/content";

afterEach(() => vi.clearAllMocks());

describe("listPublishedArticles — DB unavailable", () => {
  it("falls back to mock articles when Prisma rejects", async () => {
    const articles = await listPublishedArticles();
    expect(articles.length).toBeGreaterThan(0);
    expect(articles[0]).toHaveProperty("slug");
    expect(articles[0]).toHaveProperty("title");
    expect(articles[0]).toHaveProperty("dek");
  });

  it("returns ArticleRow shape from mock", async () => {
    const [first] = await listPublishedArticles();
    expect(typeof first!.minutes).toBe("number");
    expect(first!.publishedAt).toBeInstanceOf(Date);
    expect(first!.bodyMdx).toBeNull();
  });
});

describe("getArticleBySlug — DB unavailable", () => {
  it("returns the matching mock article by slug", async () => {
    const article = await getArticleBySlug("the-inner-critic-is-a-bodyguard");
    expect(article).not.toBeNull();
    expect(article!.slug).toBe("the-inner-critic-is-a-bodyguard");
  });

  it("returns null for an unknown slug", async () => {
    const article = await getArticleBySlug("does-not-exist-xyz");
    expect(article).toBeNull();
  });
});

describe("listPublishedCourses — DB unavailable", () => {
  it("falls back to mock courses when Prisma rejects", async () => {
    const courses = await listPublishedCourses();
    expect(courses.length).toBeGreaterThan(0);
    expect(courses[0]).toHaveProperty("slug");
    expect(courses[0]).toHaveProperty("lessons");
    expect(courses[0]).toHaveProperty("requiredTier");
  });

  it("injects requiredTier into mock courses", async () => {
    const courses = await listPublishedCourses();
    expect(courses.every((c) => typeof c.requiredTier === "string")).toBe(true);
  });
});

describe("getCourseBySlug — DB unavailable", () => {
  it("returns the matching mock course by slug", async () => {
    const course = await getCourseBySlug("the-anatomy-of-self-talk");
    expect(course).not.toBeNull();
    expect(course!.slug).toBe("the-anatomy-of-self-talk");
  });

  it("returns null for an unknown slug", async () => {
    const course = await getCourseBySlug("no-such-course");
    expect(course).toBeNull();
  });
});
