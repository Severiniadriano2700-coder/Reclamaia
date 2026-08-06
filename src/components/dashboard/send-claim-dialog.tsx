"use client"

import * as React from "react"
import { toast } from "sonner"
import { Loader2, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SendClaimDialog({
  claimId,
  defaultEmail,
  trigger,
}: {
  claimId: string
  defaultEmail?: string
  trigger: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState(defaultEmail ?? "")
  const [loading, setLoading] = React.useState(false)

  async function handleSend() {
    setLoading(true)
    try {
      const res = await fetch(`/api/claims/${claimId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "No se pudo enviar el email")
      }
      toast.success("Reclamación enviada por email")
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al enviar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar reclamación por email</DialogTitle>
          <DialogDescription>
            Recibirás una copia del documento en el email que indiques.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="send-email">Email de destino</Label>
          <Input
            id="send-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="empresa@ejemplo.com"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSend} disabled={loading || !email} className="gap-2">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
