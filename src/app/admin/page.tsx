import { Users, FileText, CreditCard, TrendingUp } from "lucide-react"

import { getAdminOverview, getSignupSeries } from "@/lib/data/admin"
import { SignupChart } from "@/components/admin/signup-chart"

export default async function AdminOverviewPage() {
  const [overview, series] = await Promise.all([getAdminOverview(), getSignupSeries()])

  const stats = [
    { icon: Users, label: "Usuarios totales", value: overview.totalUsers, hint: `+${overview.newUsersThisMonth} este mes` },
    { icon: FileText, label: "Reclamaciones totales", value: overview.totalClaims, hint: `+${overview.claimsThisMonth} este mes` },
    { icon: CreditCard, label: "Suscripciones activas", value: overview.activeSubscriptions },
    { icon: TrendingUp, label: "MRR estimado", value: `${overview.mrr}€` },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Resumen</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visión general de la plataforma.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
            <stat.icon className="size-4 text-gold" />
            <p className="mt-3 font-heading text-2xl font-semibold tracking-tight">{stat.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
            {stat.hint && <p className="mt-1 text-xs text-success">{stat.hint}</p>}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-base font-semibold tracking-tight">Registros (últimos 14 días)</h2>
        <div className="mt-4">
          <SignupChart data={series} />
        </div>
      </div>
    </div>
  )
}
