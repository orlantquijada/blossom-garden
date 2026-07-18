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
      source: "staff",
    });

    return member;
  },
});

// ponytail: 2h dedupe window stops double-taps/spam; per-day visit rules can come later
const SELF_CHECK_IN_COOLDOWN_MS = 2 * 60 * 60 * 1000;

export const checkInSelf = mutation({
  args: {},
  handler: async (ctx) => {
    const email = (await ctx.auth.getUserIdentity())?.email?.toLowerCase();

    if (!email) {
      throw new Error("Sign in to check in.");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!member) {
      throw new Error("Member not found.");
    }

    const [latest] = await ctx.db
      .query("scanLogs")
      .withIndex("by_memberId", (q) => q.eq("memberId", member._id))
      .order("desc")
      .take(1);

    if (latest && Date.now() - latest.scannedAt < SELF_CHECK_IN_COOLDOWN_MS) {
      return { already: true };
    }

    await ctx.db.insert("scanLogs", {
      memberCode: member.memberCode,
      memberId: member._id,
      scannedAt: Date.now(),
      source: "self",
    });

    return { already: false };
  },
});

export const checkedInRecently = query({
  args: {},
  handler: async (ctx) => {
    const email = (await ctx.auth.getUserIdentity())?.email?.toLowerCase();

    if (!email) {
      return false;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!member) {
      return false;
    }

    const [latest] = await ctx.db
      .query("scanLogs")
      .withIndex("by_memberId", (q) => q.eq("memberId", member._id))
      .order("desc")
      .take(1);

    return (
      !!latest && Date.now() - latest.scannedAt < SELF_CHECK_IN_COOLDOWN_MS
    );
  },
});

export const remove = mutation({
  args: { id: v.id("scanLogs") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
