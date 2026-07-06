import { z } from "zod";
import { createHandler } from "@/lib/api";
import { policies } from "@/lib/rate-limit";
import { createHabit, listHabits } from "@/server/services/habits";

const createHabitSchema = z.object({
  name: z.string().min(1).max(120),
  // Identity-first is enforced at the API boundary, not just the UI.
  identityStatement: z
    .string()
    .min(8, "Every habit needs its identity statement: 'I'm someone who…'")
    .max(300),
  cue: z.string().max(300).optional(),
  twoMinuteVersion: z.string().max(300).optional(),
  targetPerWeek: z.number().int().min(1).max(7).optional(),
});

export const GET = createHandler({ auth: "required" }, async ({ userId }) => {
  const habits = await listHabits(userId!);
  return Response.json({ habits });
});

export const POST = createHandler(
  { auth: "required", bodySchema: createHabitSchema, rateLimit: policies.mutation },
  async ({ userId, body }) => {
    const habit = await createHabit(userId!, body);
    return Response.json({ habit }, { status: 201 });
  },
);
