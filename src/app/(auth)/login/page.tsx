"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Loader2, Mail } from "lucide-react"

import { loginSchema, magicLinkSchema, type LoginInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { OAuthButtons } from "@/components/auth/oauth-buttons"

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginForm />
    </React.Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
  const [mode, setMode] = React.useState<"password" | "magic">("password")
  const [loading, setLoading] = React.useState(false)
  const [magicSent, setMagicSent] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
      callbackUrl,
    })
    setLoading(false)

    if (res?.error) {
      toast.error("Email o contraseña incorrectos")
      return
    }
    window.location.href = callbackUrl
  }

  async function onMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const parsed = magicLinkSchema.safeParse({ email: formData.get("email") })
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Email inválido")
      return
    }
    setLoading(true)
    await signIn("resend", { email: parsed.data.email, redirect: false, callbackUrl })
    setLoading(false)
    setMagicSent(true)
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Accede a tu cuenta para gestionar tus reclamaciones.
      </p>

      <div className="mt-6">
        <OAuthButtons callbackUrl={callbackUrl} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">o</span>
        <Separator className="flex-1" />
      </div>

      {mode === "password" ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="tu@email.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <button
                type="button"
                onClick={() => setMode("magic")}
                className="text-xs font-medium text-muted-foreground hover:text-gold"
              >
                Usar enlace mágico
              </button>
            </div>
            <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="h-11 w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Iniciar sesión
          </Button>
        </form>
      ) : magicSent ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-secondary/40 p-6 text-center">
          <Mail className="size-8 text-gold" />
          <p className="text-sm font-medium">Revisa tu bandeja de entrada</p>
          <p className="text-sm text-muted-foreground">Te hemos enviado un enlace de acceso.</p>
        </div>
      ) : (
        <form onSubmit={onMagicLink} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="magic-email">Email</Label>
            <Input id="magic-email" name="email" type="email" placeholder="tu@email.com" required />
          </div>
          <Button type="submit" className="h-11 w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Enviar enlace mágico
          </Button>
          <button
            type="button"
            onClick={() => setMode("password")}
            className="w-full text-center text-xs font-medium text-muted-foreground hover:text-gold"
          >
            Volver a usar contraseña
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-foreground hover:text-gold">
          Crea una gratis
        </Link>
      </p>
    </div>
  )
}
