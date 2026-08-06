import { getSubscriptions } from "@/lib/data/admin"
import { Badge } from "@/components/ui/badge"
import { SubscriptionCancelButton } from "@/components/admin/subscription-cancel-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function AdminSubscriptionsPage() {
  const subscriptions = await getSubscriptions()

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Suscripciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {subscriptions.length} suscripciones de pago activas o en gestión.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Renovación</TableHead>
              <TableHead>Cancela al final</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <p className="text-sm">{sub.user.name}</p>
                  <p className="text-xs text-muted-foreground">{sub.user.email}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{sub.plan}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={sub.status === "ACTIVE" ? "default" : "outline"}>{sub.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {sub.currentPeriodEnd?.toLocaleDateString("es-ES") ?? "—"}
                </TableCell>
                <TableCell>{sub.cancelAtPeriodEnd ? "Sí" : "No"}</TableCell>
                <TableCell>
                  {!sub.cancelAtPeriodEnd && <SubscriptionCancelButton subscriptionId={sub.id} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
