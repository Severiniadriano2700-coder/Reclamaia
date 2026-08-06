import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { db } from "@/lib/db"
import { stripe, isStripeConfigured } from "@/lib/stripe"
import { getPlanByPriceId } from "@/lib/plans"

export async function POST(req: Request) {
  if (!isStripeConfigured || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe no está configurado." }, { status: 503 })
  }

  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Falta la firma del webhook" }, { status: 400 })
  }

  const payload = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session
      if (checkoutSession.mode === "payment") {
        await unlockClaimFromCheckout(checkoutSession)
      } else if (checkoutSession.subscription && typeof checkoutSession.subscription === "string") {
        await syncSubscriptionFromStripe(checkoutSession.subscription)
      }
      break
    }
    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription
      await syncSubscriptionFromStripe(subscription.id)
      break
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      await db.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { plan: "FREE", status: "CANCELED", cancelAtPeriodEnd: false },
      })
      break
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id
      const subscriptionRecord = customerId
        ? await db.subscription.findUnique({ where: { stripeCustomerId: customerId } })
        : null

      if (subscriptionRecord) {
        await db.invoice.upsert({
          where: { stripeInvoiceId: invoice.id ?? "" },
          update: {},
          create: {
            userId: subscriptionRecord.userId,
            stripeInvoiceId: invoice.id ?? crypto.randomUUID(),
            amountPaid: invoice.amount_paid,
            currency: invoice.currency,
            status: invoice.status ?? "paid",
            pdfUrl: invoice.invoice_pdf ?? undefined,
            hostedInvoiceUrl: invoice.hosted_invoice_url ?? undefined,
          },
        })
      }
      break
    }
    default:
      break
  }

  return NextResponse.json({ received: true })
}

async function unlockClaimFromCheckout(checkoutSession: Stripe.Checkout.Session) {
  const claimId = checkoutSession.metadata?.claimId
  const userId = checkoutSession.metadata?.userId
  if (!claimId || !userId) return

  const claim = await db.claim.findUnique({ where: { id: claimId } })
  if (!claim || claim.userId !== userId || claim.paidAt) return

  const paymentIntentId =
    typeof checkoutSession.payment_intent === "string"
      ? checkoutSession.payment_intent
      : checkoutSession.payment_intent?.id

  await db.claim.update({
    where: { id: claimId },
    data: {
      requiresPayment: false,
      paidAt: new Date(),
      stripePaymentIntentId: paymentIntentId ?? undefined,
    },
  })

  if (checkoutSession.amount_total != null) {
    await db.invoice.upsert({
      where: { stripeInvoiceId: paymentIntentId ?? checkoutSession.id },
      update: {},
      create: {
        userId,
        stripeInvoiceId: paymentIntentId ?? checkoutSession.id,
        amountPaid: checkoutSession.amount_total,
        currency: checkoutSession.currency ?? "eur",
        status: "paid",
      },
    })
  }
}

async function syncSubscriptionFromStripe(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const priceId = subscription.items.data[0]?.price.id
  const plan = getPlanByPriceId(priceId)
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id

  const userId =
    subscription.metadata?.userId ??
    (await db.subscription.findUnique({ where: { stripeCustomerId: customerId } }))?.userId

  if (!userId) return

  await db.subscription.upsert({
    where: { userId },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan: plan?.id ?? "FREE",
      status: subscription.status.toUpperCase() as never,
      currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan: plan?.id ?? "FREE",
      status: subscription.status.toUpperCase() as never,
      currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  })
}
