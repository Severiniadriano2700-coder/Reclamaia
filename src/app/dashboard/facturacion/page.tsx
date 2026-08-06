import { auth } from "@/auth"
import { getUserSubscription } from "@/lib/data/dashboard"
import { BillingPanel } from "@/components/dashboard/billing-panel"

export default async function FacturacionPage() {
  const session = await auth()
  const subscription = await getUserSubscription(session!.user.id)

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Facturación</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona tu plan, tu método de pago y tus facturas.
        </p>
      </div>
      <BillingPanel currentPlan={subscription.plan} />
    </div>
  )
}
