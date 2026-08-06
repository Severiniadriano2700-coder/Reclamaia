import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { stripe, isStripeConfigured } from "@/lib/stripe"
import { PAY_PER_CLAIM_PRICE_CENTS } from "@/lib/plans"
import { siteConfig } from "@/lib/site"

const bodySchema = z.object({
  claimId: z.string().min(1),
})

export async function POST(req: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: "Stripe no está configurado en este entorno." },
      { status: 503 }
    )
  }

  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 })
  }

  const claim = await db.claim.findUnique({ where: { id: parsed.data.claimId } })
  if (!claim || claim.userId !== session.user.id) {
    return NextResponse.json({ error: "Reclamación no encontrada" }, { status: 404 })
  }
  if (!claim.requiresPayment || claim.paidAt) {
    return NextResponse.json({ error: "Esta reclamación ya está desbloqueada" }, { status: 400 })
  }

  const existingSubscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  })

  let customerId = existingSubscription?.stripeCustomerId ?? undefined
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email ?? undefined,
      name: session.user.name ?? undefined,
      metadata: { userId: session.user.id },
    })
    customerId = customer.id

    await db.subscription.upsert({
      where: { userId: session.user.id },
      update: { stripeCustomerId: customerId },
      create: { userId: session.user.id, stripeCustomerId: customerId },
    })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: PAY_PER_CLAIM_PRICE_CENTS,
          product_data: {
            name: `Reclamación: ${claim.title}`,
            description: "Desbloqueo de reclamación individual + 5 mensajes de asistente sobre esta reclamación.",
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${siteConfig.url}/dashboard/reclamaciones/${claim.id}?payment=success`,
    cancel_url: `${siteConfig.url}/dashboard/reclamaciones/${claim.id}?payment=canceled`,
    payment_intent_data: {
      metadata: { userId: session.user.id, claimId: claim.id },
    },
    metadata: { userId: session.user.id, claimId: claim.id },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
