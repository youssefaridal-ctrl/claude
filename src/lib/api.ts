import { NextRequest, NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { auth } from "@/auth";
import { AppError, RateLimitError, UnauthorizedError, ValidationError } from "@/lib/errors";
import { enforceRateLimit, policies, type RateLimitPolicy } from "@/lib/rate-limit";
import { reqLogger } from "@/lib/logger";

export interface ApiContext<TBody> {
  req: NextRequest;
  body: TBody;
  userId: string | null;
  role: string | null;
  requestId: string;
  params: Record<string, string>;
}

interface HandlerOptions<TBody> {
  /** "required" returns 401 when unauthenticated; "optional" passes null userId. */
  auth?: "required" | "optional";
  bodySchema?: ZodType<TBody>;
  rateLimit?: RateLimitPolicy;
}

/**
 * Route-handler factory: one place for auth, validation, rate limiting,
 * error mapping (RFC 9457 problem details), and request logging.
 *
 *   export const POST = createHandler(
 *     { auth: "required", bodySchema: createHabitSchema, rateLimit: policies.mutation },
 *     async ({ body, userId }) => Response.json(await createHabit(userId!, body), { status: 201 }),
 *   );
 */
export function createHandler<TBody = unknown>(
  options: HandlerOptions<TBody>,
  handler: (ctx: ApiContext<TBody>) => Promise<Response>,
) {
  // Second argument typed to satisfy Next 15's generated RouteContext check
  // for both static and dynamic routes.
  return async (
    req: NextRequest,
    routeCtx: { params: Promise<unknown> },
  ): Promise<Response> => {
    const requestId = crypto.randomUUID();
    const log = reqLogger(requestId);
    try {
      const session = await auth();
      const userId = session?.user?.id ?? null;
      const role = (session?.user as { role?: string } | undefined)?.role ?? null;

      if (options.auth === "required" && !userId) throw new UnauthorizedError();

      const limitId = userId ?? ipOf(req);
      await enforceRateLimit(limitId, options.rateLimit ?? policies.api);

      let body = undefined as TBody;
      if (options.bodySchema) {
        const raw = await req.json().catch(() => {
          throw new ValidationError({ reason: "Body must be valid JSON." });
        });
        body = options.bodySchema.parse(raw);
      }

      const params = ((await routeCtx.params) ?? {}) as Record<string, string>;
      const res = await handler({ req, body, userId, role, requestId, params });
      res.headers.set("x-request-id", requestId);
      return res;
    } catch (err) {
      return toProblemResponse(err, requestId, log);
    }
  };
}

function ipOf(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function toProblemResponse(
  err: unknown,
  requestId: string,
  log: ReturnType<typeof reqLogger>,
): Response {
  if (err instanceof ZodError) {
    err = new ValidationError(err.flatten());
  }
  if (err instanceof AppError) {
    const headers: Record<string, string> = { "x-request-id": requestId };
    if (err instanceof RateLimitError) {
      headers["Retry-After"] = String(err.retryAfterSeconds);
    }
    if (err.status >= 500) log.error({ err }, err.message);
    return NextResponse.json(
      {
        type: `https://selv.example/errors/${err.code}`,
        title: err.message,
        status: err.status,
        detail: err.details ?? undefined,
        requestId,
      },
      { status: err.status, headers },
    );
  }
  log.error({ err }, "unhandled_error");
  return NextResponse.json(
    {
      type: "https://selv.example/errors/internal",
      // Blame-free error copy is a brand rule, even at the API layer.
      title: "Something went wrong on our side — not yours. We've logged it.",
      status: 500,
      requestId,
    },
    { status: 500, headers: { "x-request-id": requestId } },
  );
}
