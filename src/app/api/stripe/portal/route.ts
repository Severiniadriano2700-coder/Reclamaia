import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { stripe, isStripeConfigured } from "@/lib/stripe"
import { siteConfig } from "@/lib/site"

export async function POST() {
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

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  })

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No se encontró una suscripción de Stripe para esta cuenta." },
      { status: 404 }
    )
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${siteConfig.url}/dashboard/billing`,
  })

  return NextResponse.json({ url: portalSession.url })
}
