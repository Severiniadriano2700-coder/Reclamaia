import { ClaimsTable } from "@/components/dashboard/claims-table"

export default function HistorialPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Historial</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todas tus reclamaciones generadas, en un solo lugar.
        </p>
      </div>
      <ClaimsTable />
    </div>
  )
}
