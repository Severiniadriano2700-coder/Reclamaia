import Link from "next/link"
import { FilePlus2, FileText, Send, CheckCircle2, Star, ArrowRight } from "lucide-react"

import { auth } from "@/auth"
import { getUsageSummary, getRecentClaims, getDashboardStats } from "@/lib/data/dashboard"
import { categoryLabel } from "@/lib/validations/claim"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/dashboard/status-badge"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const [{ plan, usage, remaining, payPerClaim }, recentClaims, stats] = await Promise.all([
    getUsageSummary(userId),
    getRecentClaims(userId),
    getDashboardStats(userId),
  ])

  const limit = plan.claimsPerMonth
  const usagePercent = limit === "unlimited" ? 0 : Math.min((usage.claimsGenerated / limit) * 100, 100)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Hola, {session!.user.name?.split(" ")[0] ?? "de nuevo"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí tienes un resumen de tu actividad en Litiga IA.
          </p>
        </div>
        <Button className="gap-2 glow-gold" nativeButton={false} render={<Link href="/dashboard/nueva" />}>
          <FilePlus2 className="size-4" />
          Nueva reclamación
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Reclamaciones totales" value={stats.total} />
        <StatCard icon={Send} label="Enviadas" value={stats.sent} />
        <StatCard icon={CheckCircle2} label="Resueltas" value={stats.resolved} />
        <StatCard icon={Star} label="Favoritas" value={stats.favorites} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              {payPerClaim ? "Plan Gratis" : `Uso mensual · Plan ${plan.name}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {payPerClaim
                ? remaining === 0
                  ? "Ya usaste tu reclamación gratuita. Las siguientes cuestan 3,50€ cada una."
                  : "Tienes 1 reclamación gratis disponible."
                : `${usage.claimsGenerated} de ${limit === "unlimited" ? "reclamaciones ilimitadas" : `${limit} reclamaciones`} usadas`}
            </p>
          </div>
          {limit !== "unlimited" && (
            <Badge variant={remaining === 0 ? "destructive" : "secondary"}>
              {payPerClaim ? (remaining === 0 ? "Gratis usada" : "1 gratis") : `${remaining} restantes`}
            </Badge>
          )}
        </div>
        {!payPerClaim && limit !== "unlimited" && <Progress value={usagePercent} className="mt-4 h-2" />}
        {plan.id === "FREE" && (
          <Link
            href="/dashboard/facturacion"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold hover:underline"
          >
            Hazte Pro para reclamaciones mensuales incluidas <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-heading text-base font-semibold tracking-tight">Reclamaciones recientes</h2>
          <Link href="/dashboard/historial" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Ver todas
          </Link>
        </div>

        {recentClaims.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <FileText className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Todavía no has generado ninguna reclamación.</p>
            <Button size="sm" nativeButton={false} render={<Link href="/dashboard/nueva" />}>
              Crear la primera
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recentClaims.map((claim) => (
              <li key={claim.id}>
                <Link
                  href={`/dashboard/reclamaciones/${claim.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-secondary/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{claim.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {categoryLabel(claim.category)} · {new Date(claim.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <StatusBadge status={claim.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Icon className="size-4 text-gold" />
      <p className="mt-3 font-heading text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
