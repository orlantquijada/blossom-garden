import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("tasks").order("desc").take(20),
});

export const create = mutation({
  args: {
    dueAt: v.optional(v.number()),
    text: v.string(),
  },
  handler: async (ctx, args) =>
    await ctx.db.insert("tasks", {
      createdAt: Date.now(),
      status: "todo",
      ...args,
    }),
});
