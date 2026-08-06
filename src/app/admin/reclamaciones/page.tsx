import { getAllClaims } from "@/lib/data/admin"
import { categoryLabel } from "@/lib/validations/claim"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function AdminClaimsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const claims = await getAllClaims(q)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Reclamaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">{claims.length} reclamaciones en la plataforma.</p>
      </div>

      <form className="max-w-sm">
        <Input name="q" defaultValue={q} placeholder="Buscar por título o empresa…" />
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reclamación</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">{claim.title}</TableCell>
                <TableCell>
                  <p className="text-sm">{claim.user.name}</p>
                  <p className="text-xs text-muted-foreground">{claim.user.email}</p>
                </TableCell>
                <TableCell>{categoryLabel(claim.category)}</TableCell>
                <TableCell>
                  <StatusBadge status={claim.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {claim.createdAt.toLocaleDateString("es-ES")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
