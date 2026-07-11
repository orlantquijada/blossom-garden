import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

const memberFields = {
  email: v.string(),
  name: v.string(),
  notes: v.optional(v.string()),
  phone: v.optional(v.string()),
  status: v.union(v.literal("regular"), v.literal("vip")),
};

function makeMemberCode(id: string) {
  return `BGD-${id.slice(-8).toUpperCase()}`;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("members").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.id);
  },
});

export const getByCode = query({
  args: { memberCode: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("members")
      .withIndex("by_memberCode", (q) => q.eq("memberCode", args.memberCode))
      .unique();
  },
});

export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    notes: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: v.optional(v.union(v.literal("regular"), v.literal("vip"))),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();
    const { status, ...member } = args;
    const id = await ctx.db.insert("members", {
      ...member,
      createdAt: now,
      memberCode: "",
      status: status ?? "regular",
      updatedAt: now,
    });
    const memberCode = makeMemberCode(id);
    await ctx.db.patch(id, { memberCode });

    return { id, memberCode };
  },
});

export const signUp = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();
    const phone = args.phone?.trim() || undefined;

    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error("A name and valid email are required.");
    }

    if (name.length > 100 || email.length > 200 || (phone?.length ?? 0) > 40) {
      throw new Error("Input too long.");
    }

    const existing = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    // ponytail: returning the existing code doubles as dedupe and "recover my pass"
    if (existing) {
      return { memberCode: existing.memberCode };
    }

    const now = Date.now();
    const id = await ctx.db.insert("members", {
      createdAt: now,
      email,
      memberCode: "",
      name,
      phone,
      status: "regular",
      updatedAt: now,
    });
    const memberCode = makeMemberCode(id);
    await ctx.db.patch(id, { memberCode });

    return { memberCode };
  },
});

// Public: only name/code/status leave the server — never email, phone, or notes.
export const getCard = query({
  args: { memberCode: v.string() },
  handler: async (ctx, args) => {
    const memberCode = args.memberCode.trim().toUpperCase();
    const member = await ctx.db
      .query("members")
      .withIndex("by_memberCode", (q) => q.eq("memberCode", memberCode))
      .unique();

    if (!member) {
      return null;
    }

    return {
      memberCode: member.memberCode,
      name: member.name,
      status: member.status,
    };
  },
});

export const update = mutation({
  args: {
    id: v.id("members"),
    ...memberFields,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...patch } = args;
    const existing = await ctx.db.get(id);

    if (!existing) {
      throw new Error("Member not found.");
    }

    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(args.id);

    if (!existing) {
      throw new Error("Member not found.");
    }

    const logs = await ctx.db
      .query("scanLogs")
      .withIndex("by_memberId", (q) => q.eq("memberId", args.id))
      .collect();

    for (const log of logs) {
      await ctx.db.delete(log._id);
    }

    await ctx.db.delete(args.id);
  },
});
