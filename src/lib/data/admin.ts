import { db } from "@/lib/db"

export async function getAdminOverview() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [
    totalUsers,
    newUsersThisMonth,
    totalClaims,
    claimsThisMonth,
    activeSubscriptions,
    proCount,
    businessCount,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.claim.count(),
    db.claim.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.subscription.count({ where: { status: "ACTIVE", plan: { not: "FREE" } } }),
    db.subscription.count({ where: { plan: "PRO", status: "ACTIVE" } }),
    db.subscription.count({ where: { plan: "BUSINESS", status: "ACTIVE" } }),
  ])

  const mrr = proCount * 9 + businessCount * 29

  return {
    totalUsers,
    newUsersThisMonth,
    totalClaims,
    claimsThisMonth,
    activeSubscriptions,
    mrr,
    startOfLastMonth,
  }
}

export async function getSignupSeries(days = 14) {
  const users = await db.user.findMany({
    select: { createdAt: true },
    where: { createdAt: { gte: new Date(Date.now() - days * 86400000) } },
  })

  const buckets = new Map<string, number>()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000)
    buckets.set(date.toISOString().slice(0, 10), 0)
  }
  for (const user of users) {
    const key = user.createdAt.toISOString().slice(0, 10)
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }))
}

export async function getUsers(query?: string) {
  return db.user.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { subscription: true, _count: { select: { claims: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
}

export async function getAllClaims(query?: string) {
  return db.claim.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { companyNameRaw: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
}

export async function getSubscriptions() {
  return db.subscription.findMany({
    where: { plan: { not: "FREE" } },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
}

export async function getCategoryBreakdown() {
  const groups = await db.claim.groupBy({
    by: ["category"],
    _count: { category: true },
  })
  return groups
    .map((g) => ({ category: g.category, count: g._count.category }))
    .sort((a, b) => b.count - a.count)
}

export async function getPlanDistribution() {
  const groups = await db.subscription.groupBy({
    by: ["plan"],
    _count: { plan: true },
  })
  return groups.map((g) => ({ plan: g.plan, count: g._count.plan }))
}

export async function getAuditLogs() {
  return db.auditLog.findMany({
    include: { actor: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
}
