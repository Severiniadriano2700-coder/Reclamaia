import { getSignupSeries, getCategoryBreakdown, getPlanDistribution } from "@/lib/data/admin"
import { SignupChart } from "@/components/admin/signup-chart"
import { CategoryChart } from "@/components/admin/category-chart"
import { Badge } from "@/components/ui/badge"

export default async function AdminAnalyticsPage() {
  const [series, categories, plans] = await Promise.all([
    getSignupSeries(30),
    getCategoryBreakdown(),
    getPlanDistribution(),
  ])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Analíticas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tendencias de crecimiento y uso de la plataforma.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-base font-semibold tracking-tight">Registros (30 días)</h2>
        <div className="mt-4">
          <SignupChart data={series} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-semibold tracking-tight">Reclamaciones por categoría</h2>
          <div className="mt-4">
            <CategoryChart data={categories} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-semibold tracking-tight">Distribución de planes</h2>
          <div className="mt-4 space-y-3">
            {plans.map((plan) => (
              <div key={plan.plan} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <Badge variant="secondary">{plan.plan}</Badge>
                <span className="font-heading text-lg font-semibold">{plan.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
