import { getAuditLogs } from "@/lib/data/admin"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function AdminLogsPage() {
  const logs = await getAuditLogs()

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Registro de auditoría de acciones sensibles.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {logs.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-muted-foreground">Todavía no hay eventos registrados.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Acción</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell className="text-muted-foreground">{log.actor?.email ?? "Sistema"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.targetType ? `${log.targetType} · ${log.targetId}` : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.createdAt.toLocaleString("es-ES")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
