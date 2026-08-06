"use client"

import * as React from "react"
import { Loader2, Lock } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function UnlockClaimButton({ claimId, priceLabel }: { claimId: string; priceLabel: string }) {
  const [loading, setLoading] = React.useState(false)

  async function handleUnlock() {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || !body.url) {
        throw new Error(body.error ?? "No se pudo iniciar el pago")
      }
      window.location.href = body.url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al iniciar el pago")
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleUnlock} disabled={loading} size="lg" className="gap-2 glow-gold">
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
      Desbloquear por {priceLabel}
    </Button>
  )
}
