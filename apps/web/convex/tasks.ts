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

export const update = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal("todo"), v.literal("done")),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const existingTask = await ctx.db.get(args.id);

    if (!existingTask) {
      throw new Error("Task not found.");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      text: args.text,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const existingTask = await ctx.db.get(args.id);

    if (!existingTask) {
      throw new Error("Task not found.");
    }

    await ctx.db.delete(args.id);
  },
});
