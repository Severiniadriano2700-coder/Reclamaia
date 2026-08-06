import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { stripe, isStripeConfigured } from "@/lib/stripe"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { id } = await params
  const subscription = await db.subscription.findUnique({ where: { id } })
  if (!subscription) return NextResponse.json({ error: "No encontrada" }, { status: 404 })

  if (isStripeConfigured && subscription.stripeSubscriptionId) {
    try {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al cancelar en Stripe"
      return NextResponse.json({ error: message }, { status: 502 })
    }
  }

  const updated = await db.subscription.update({
    where: { id },
    data: { cancelAtPeriodEnd: true },
  })

  await db.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "subscription.cancel_requested",
      targetType: "Subscription",
      targetId: id,
      metadata: { userId: subscription.userId },
    },
  })

  return NextResponse.json({ subscription: updated })
}
