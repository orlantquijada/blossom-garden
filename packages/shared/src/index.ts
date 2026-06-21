import { formatDistanceToNowStrict } from "date-fns";
import { z } from "zod";

export const taskStatusSchema = z.enum(["todo", "done"]);

export const taskSchema = z.object({
  createdAt: z.number(),
  dueAt: z.number().optional(),
  id: z.string(),
  status: taskStatusSchema,
  text: z.string().min(1),
});

export const createTaskSchema = taskSchema.pick({
  dueAt: true,
  text: true,
});

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const formatTaskAge = (createdAt: number) =>
  formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true });
