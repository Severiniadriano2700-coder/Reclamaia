import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { stripe, isStripeConfigured } from "@/lib/stripe"
import { getPlan } from "@/lib/plans"
import { siteConfig } from "@/lib/site"

const bodySchema = z.object({
  planId: z.enum(["PRO", "BUSINESS"]),
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
    return NextResponse.json({ error: "Plan inválido" }, { status: 400 })
  }

  const plan = getPlan(parsed.data.planId)
  if (!plan.priceId) {
    return NextResponse.json(
      { error: "Este plan no tiene un precio de Stripe configurado." },
      { status: 500 }
    )
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
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${siteConfig.url}/dashboard/billing?checkout=success`,
    cancel_url: `${siteConfig.url}/dashboard/billing?checkout=canceled`,
    subscription_data: {
      metadata: { userId: session.user.id, plan: plan.id },
    },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
