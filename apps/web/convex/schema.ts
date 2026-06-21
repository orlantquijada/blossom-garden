import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    createdAt: v.number(),
    dueAt: v.optional(v.number()),
    status: v.union(v.literal("todo"), v.literal("done")),
    text: v.string(),
  }),
});
