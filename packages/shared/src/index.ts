import { z } from "zod";

export const memberStatusSchema = z.enum(["regular", "vip"]);

export const memberSchema = z.object({
  createdAt: z.number(),
  email: z.string().email(),
  id: z.string(),
  memberCode: z.string().min(1),
  name: z.string().min(1),
  notes: z.string().optional(),
  phone: z.string().optional(),
  status: memberStatusSchema,
  updatedAt: z.number(),
});

export const createMemberSchema = memberSchema.pick({
  email: true,
  name: true,
  notes: true,
  phone: true,
});

export type Member = z.infer<typeof memberSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
