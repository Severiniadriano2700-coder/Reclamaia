"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Ban } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function SubscriptionCancelButton({ subscriptionId }: { subscriptionId: string }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  async function handleCancel() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/subscriptions/${subscriptionId}/cancel`, { method: "POST" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "No se pudo cancelar la suscripción")
      }
      toast.success("Suscripción marcada para cancelar al final del periodo")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Cancelar suscripción" />}>
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Ban className="size-3.5 text-muted-foreground" />}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cancelar esta suscripción?</AlertDialogTitle>
          <AlertDialogDescription>
            El usuario mantendrá el acceso hasta el final del periodo ya pagado y después pasará al plan
            gratuito.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Volver</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel}>Cancelar suscripción</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
