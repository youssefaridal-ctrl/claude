import { prisma } from "@/lib/prisma";
import { articles as mockArticles, courses as mockCourses } from "@/lib/mock";

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export type ArticleRow = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  author: string;
  minutes: number;
  type: string;
  publishedAt: Date | null;
  bodyMdx: string | null;
};

export async function listPublishedArticles(): Promise<ArticleRow[]> {
  try {
    const rows = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: {
        slug: true,
        title: true,
        dek: true,
        category: { select: { name: true } },
        author: { select: { name: true } },
        readMinutes: true,
        publishedAt: true,
        bodyMdx: true,
      },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        dek: r.dek,
        category: r.category?.name ?? "Essay",
        author: r.author?.name ?? "SELV Editorial",
        minutes: r.readMinutes,
        type: "ESSAY",
        publishedAt: r.publishedAt,
        bodyMdx: r.bodyMdx,
      }));
    }
  } catch {
    // DB unavailable — fall through to mock
  }
  return mockArticles.map((a) => ({
    ...a,
    publishedAt: new Date("2026-06-01"),
    bodyMdx: null,
  }));
}

export async function getArticleBySlug(slug: string): Promise<ArticleRow | null> {
  try {
    const row = await prisma.article.findUnique({
      where: { slug, status: "PUBLISHED" },
      select: {
        slug: true,
        title: true,
        dek: true,
        category: { select: { name: true } },
        author: { select: { name: true } },
        readMinutes: true,
        publishedAt: true,
        bodyMdx: true,
      },
    });
    if (row) {
      return {
        slug: row.slug,
        title: row.title,
        dek: row.dek,
        category: row.category?.name ?? "Essay",
        author: row.author?.name ?? "SELV Editorial",
        minutes: row.readMinutes,
        type: "ESSAY",
        publishedAt: row.publishedAt,
        bodyMdx: row.bodyMdx,
      };
    }
  } catch {
    // fall through
  }
  const mock = mockArticles.find((a) => a.slug === slug);
  return mock ? { ...mock, publishedAt: new Date("2026-06-01"), bodyMdx: null } : null;
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export type CourseRow = {
  slug: string;
  title: string;
  promise: string;
  summary: string | null;
  path: string;
  lessons: number;
  hours: string;
  preview: boolean;
  requiredTier: string;
};

const courseInclude = {
  modules: {
    include: {
      lessons: {
        select: { id: true as const, isPreview: true as const, durationMinutes: true as const },
      },
    },
  },
} as const;

type DbCourse = NonNullable<Awaited<ReturnType<typeof prisma.course.findFirst<{ include: typeof courseInclude }>>>>;

function dbCourseToCourseRow(row: DbCourse): CourseRow {
  const allLessons = row.modules.flatMap((m) => m.lessons);
  const totalMinutes = allLessons.reduce((s, l) => s + (l.durationMinutes ?? 0), 0);
  const hours = totalMinutes >= 60 ? `${Math.round(totalMinutes / 60)}h` : `${totalMinutes}m`;
  return {
    slug: row.slug,
    title: row.title,
    promise: row.promise,
    summary: row.summary,
    path: "Academy",
    lessons: allLessons.length,
    hours,
    preview: allLessons.some((l) => l.isPreview),
    requiredTier: row.requiredTier,
  };
}

export async function listPublishedCourses(): Promise<CourseRow[]> {
  try {
    const rows = await prisma.course.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { position: "asc" },
      include: courseInclude,
    });
    if (rows.length > 0) return rows.map(dbCourseToCourseRow);
  } catch {
    // fall through
  }
  return mockCourses.map((c) => ({ ...c, summary: null, requiredTier: "ACADEMY" }));
}

export async function getCourseBySlug(slug: string): Promise<CourseRow | null> {
  try {
    const row = await prisma.course.findFirst({
      where: { slug },
      include: courseInclude,
    });
    if (row) return dbCourseToCourseRow(row);
  } catch {
    // fall through
  }
  const mock = mockCourses.find((c) => c.slug === slug);
  return mock ? { ...mock, summary: null, requiredTier: "ACADEMY" } : null;
}
