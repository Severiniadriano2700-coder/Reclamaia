"use client"

import * as React from "react"
import { toast } from "sonner"
import { Check, Loader2, ExternalLink } from "lucide-react"

import { plans, type PlanId } from "@/lib/plans"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BillingPanel({ currentPlan }: { currentPlan: PlanId }) {
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null)
  const [portalLoading, setPortalLoading] = React.useState(false)

  async function handleUpgrade(planId: "PRO" | "BUSINESS") {
    setLoadingPlan(planId)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })
      const body = await res.json()
      if (!res.ok || !body.url) throw new Error(body.error ?? "No se pudo iniciar el pago")
      window.location.href = body.url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error inesperado")
      setLoadingPlan(null)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const body = await res.json()
      if (!res.ok || !body.url) throw new Error(body.error ?? "No se pudo abrir el portal de facturación")
      window.location.href = body.url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error inesperado")
      setPortalLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan
          return (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col rounded-2xl border p-6",
                isCurrent ? "border-gold/50 bg-gold-muted/20 glow-gold" : "border-border bg-card"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold tracking-tight">{plan.name}</h3>
                {isCurrent && (
                  <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-gold-foreground">
                    Actual
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <p className="mt-4 font-heading text-3xl font-semibold tracking-tight">
                {plan.price === 0 ? "Gratis" : `${plan.price}€`}
                {plan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>}
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-gold" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.id !== "FREE" && !isCurrent && (
                <Button
                  className="mt-6 gap-2"
                  disabled={loadingPlan !== null}
                  onClick={() => handleUpgrade(plan.id as "PRO" | "BUSINESS")}
                >
                  {loadingPlan === plan.id && <Loader2 className="size-4 animate-spin" />}
                  Cambiar a {plan.name}
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {currentPlan !== "FREE" && (
        <Button variant="outline" className="gap-2" onClick={handlePortal} disabled={portalLoading}>
          {portalLoading ? <Loader2 className="size-4 animate-spin" /> : <ExternalLink className="size-4" />}
          Gestionar facturación y facturas
        </Button>
      )}
    </div>
  )
}
