import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: { memberId: v.optional(v.id("members")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { memberId } = args;

    if (memberId) {
      return await ctx.db
        .query("scanLogs")
        .withIndex("by_memberId", (q) => q.eq("memberId", memberId))
        .order("desc")
        .take(50);
    }

    return await ctx.db.query("scanLogs").order("desc").take(50);
  },
});

export const checkIn = mutation({
  args: {
    memberCode: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const memberCode = args.memberCode.trim().toUpperCase();
    const member = await ctx.db
      .query("members")
      .withIndex("by_memberCode", (q) => q.eq("memberCode", memberCode))
      .unique();

    if (!member) {
      throw new Error("Member not found.");
    }

    await ctx.db.insert("scanLogs", {
      memberCode: member.memberCode,
      memberId: member._id,
      note: args.note?.trim() || undefined,
      scannedAt: Date.now(),
    });

    return member;
  },
});
