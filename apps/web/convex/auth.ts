import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth";
import { betterAuth } from "better-auth/minimal";

import { components } from "./_generated/api";
import { query } from "./_generated/server";
import type { DataModel } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import authConfig from "./auth.config";

export const authComponent = createClient<DataModel>(components.betterAuth);

export function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth({
    baseURL: process.env.SITE_URL,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [convex({ authConfig })],
  });
}

export function isAdminEmail(email: string | undefined) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return !!email && adminEmails.includes(email.toLowerCase());
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!isAdminEmail(identity?.email)) {
    throw new Error("Unauthorized");
  }

  return identity;
}

export const isAdmin = query({
  args: {},
  handler: async (ctx) =>
    isAdminEmail((await ctx.auth.getUserIdentity())?.email),
});
