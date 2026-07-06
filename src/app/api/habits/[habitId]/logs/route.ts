import { z } from "zod";
import { createHandler } from "@/lib/api";
import { policies } from "@/lib/rate-limit";
import { logHabit, unlogHabit } from "@/server/services/habits";

const logSchema = z.object({
  date: z.coerce.date().optional(),
  status: z.enum(["KEPT", "GRACE"]).optional(),
  timezone: z.string().max(64).optional(),
});

export const POST = createHandler(
  { auth: "required", bodySchema: logSchema, rateLimit: policies.mutation },
  async ({ userId, body, params }) => {
    const log = await logHabit(userId!, params.habitId!, body);
    return Response.json({ log }, { status: 201 });
  },
);

export const DELETE = createHandler(
  { auth: "required", bodySchema: logSchema, rateLimit: policies.mutation },
  async ({ userId, body, params }) => {
    await unlogHabit(userId!, params.habitId!, body.date ?? new Date(), body.timezone);
    return new Response(null, { status: 204 });
  },
);
