import { db } from "@/lib/db"
import { getPlan, PAY_PER_CLAIM_CHAT_MESSAGES } from "@/lib/plans"

export async function getUserSubscription(userId: string) {
  const subscription = await db.subscription.findUnique({ where: { userId } })
  return subscription ?? { plan: "FREE" as const, status: "ACTIVE" as const, cancelAtPeriodEnd: false, currentPeriodEnd: null }
}

export async function getMonthlyUsage(userId: string) {
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const claimsGenerated = await db.claim.count({
    where: { userId, createdAt: { gte: periodStart, lt: periodEnd } },
  })

  return { claimsGenerated, periodStart, periodEnd }
}

/** Claims that were free at creation time (never required a one-time payment). */
export async function getFreeClaimsUsed(userId: string) {
  return db.claim.count({ where: { userId, requiresPayment: false, paidAt: null } })
}

export async function getUsageSummary(userId: string) {
  const subscription = await getUserSubscription(userId)
  const plan = getPlan(subscription.plan)

  if (plan.id === "FREE") {
    const freeClaimsUsed = await getFreeClaimsUsed(userId)
    const limit = plan.claimsPerMonth
    const remaining = typeof limit === "number" ? Math.max(limit - freeClaimsUsed, 0) : "unlimited"
    return {
      subscription,
      plan,
      usage: { claimsGenerated: freeClaimsUsed },
      limit,
      remaining,
      payPerClaim: true,
    }
  }

  const usage = await getMonthlyUsage(userId)
  const limit = plan.claimsPerMonth
  const remaining = limit === "unlimited" ? "unlimited" : Math.max(limit - usage.claimsGenerated, 0)

  return { subscription, plan, usage, limit, remaining, payPerClaim: false }
}

export async function getChatUsageSummary(userId: string) {
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const [subscription, messagesSent] = await Promise.all([
    getUserSubscription(userId),
    db.chatMessage.count({
      where: { userId, role: "USER", claimId: null, createdAt: { gte: periodStart, lt: periodEnd } },
    }),
  ])

  const plan = getPlan(subscription.plan)
  const limit = plan.chatMessagesPerMonth
  const remaining = limit === "unlimited" ? "unlimited" : Math.max(limit - messagesSent, 0)

  return { plan, limit, messagesSent, remaining }
}

/** 5 messages included with each individually-purchased claim, scoped to that claim only. */
export async function getClaimChatUsage(claimId: string) {
  const messagesSent = await db.chatMessage.count({
    where: { claimId, role: "USER" },
  })
  const remaining = Math.max(PAY_PER_CLAIM_CHAT_MESSAGES - messagesSent, 0)
  return { limit: PAY_PER_CLAIM_CHAT_MESSAGES, messagesSent, remaining }
}

export async function getRecentClaims(userId: string, take = 5) {
  return db.claim.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    include: { company: true },
  })
}

export async function getDashboardStats(userId: string) {
  const [total, sent, resolved, favorites] = await Promise.all([
    db.claim.count({ where: { userId } }),
    db.claim.count({ where: { userId, status: "SENT" } }),
    db.claim.count({ where: { userId, status: "RESOLVED" } }),
    db.claim.count({ where: { userId, isFavorite: true } }),
  ])
  return { total, sent, resolved, favorites }
}
