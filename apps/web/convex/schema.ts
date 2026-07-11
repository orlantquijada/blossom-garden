import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  members: defineTable({
    createdAt: v.number(),
    email: v.string(),
    memberCode: v.string(),
    name: v.string(),
    notes: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: v.union(v.literal("regular"), v.literal("vip")),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_memberCode", ["memberCode"])
    .index("by_status", ["status"]),
  scanLogs: defineTable({
    memberCode: v.string(),
    memberId: v.id("members"),
    note: v.optional(v.string()),
    scannedAt: v.number(),
  }).index("by_memberId", ["memberId"]),
});
