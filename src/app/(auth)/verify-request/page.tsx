import Link from "next/link"
import { MailCheck } from "lucide-react"

export default function VerifyRequestPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-gold-muted">
        <MailCheck className="size-6 text-gold" />
      </span>
      <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight">Revisa tu email</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Te hemos enviado un enlace de acceso seguro. Ábrelo desde este dispositivo para entrar en tu cuenta.
      </p>
      <Link href="/login" className="mt-6 text-sm font-medium text-foreground hover:text-gold">
        Volver al inicio de sesión
      </Link>
    </div>
  )
}
