"use client"

import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

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

export function DeleteAccount() {
  async function handleDelete() {
    const res = await fetch("/api/user/account", { method: "DELETE" })
    if (!res.ok) {
      toast.error("No se pudo eliminar la cuenta")
      return
    }
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
      <h3 className="font-heading text-base font-semibold tracking-tight text-destructive">Zona de peligro</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Eliminar tu cuenta borrará permanentemente todas tus reclamaciones, plantillas e historial.
      </p>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" className="mt-4 gap-2" />}>
          <Trash2 className="size-4" />
          Eliminar mi cuenta
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tu cuenta permanentemente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán todos tus datos, reclamaciones y suscripción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Sí, eliminar todo</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
