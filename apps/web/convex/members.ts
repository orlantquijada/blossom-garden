import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { requireAdmin } from './auth'

const memberFields = {
  email: v.string(),
  name: v.string(),
  notes: v.optional(v.string()),
  phone: v.optional(v.string()),
  status: v.union(v.literal('regular'), v.literal('vip')),
}

function makeMemberCode(id: string) {
  return `BGD-${id.slice(-8).toUpperCase()}`
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return await ctx.db.query('members').order('desc').collect()
  },
})

export const get = query({
  args: { id: v.id('members') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return await ctx.db.get(args.id)
  },
})

export const getByCode = query({
  args: { memberCode: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return await ctx.db
      .query('members')
      .withIndex('by_memberCode', (q) => q.eq('memberCode', args.memberCode))
      .unique()
  },
})

export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    notes: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: v.optional(v.union(v.literal('regular'), v.literal('vip'))),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const now = Date.now()
    const { status, ...member } = args
    const id = await ctx.db.insert('members', {
      ...member,
      createdAt: now,
      memberCode: '',
      status: status ?? 'regular',
      updatedAt: now,
    })
    const memberCode = makeMemberCode(id)
    await ctx.db.patch(id, { memberCode })

    return { id, memberCode }
  },
})

export const update = mutation({
  args: {
    id: v.id('members'),
    ...memberFields,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const { id, ...patch } = args
    const existing = await ctx.db.get(id)

    if (!existing) {
      throw new Error('Member not found.')
    }

    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() })
  },
})

export const remove = mutation({
  args: { id: v.id('members') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const existing = await ctx.db.get(args.id)

    if (!existing) {
      throw new Error('Member not found.')
    }

    const logs = await ctx.db
      .query('scanLogs')
      .withIndex('by_memberId', (q) => q.eq('memberId', args.id))
      .collect()

    for (const log of logs) {
      await ctx.db.delete(log._id)
    }

    await ctx.db.delete(args.id)
  },
})
