import { auth } from "@/auth"
import { getUsers } from "@/lib/data/admin"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { UserRowActions } from "@/components/admin/user-row-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const [users, session] = await Promise.all([getUsers(q), auth()])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Usuarios</h1>
        <p className="mt-1 text-sm text-muted-foreground">{users.length} usuarios encontrados.</p>
      </div>

      <form className="max-w-sm">
        <Input name="q" defaultValue={q} placeholder="Buscar por nombre o email…" />
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Reclamaciones</TableHead>
              <TableHead>Registrado</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <p className="font-medium">{user.name ?? "Sin nombre"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.subscription?.plan ?? "FREE"}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>{user.role}</Badge>
                </TableCell>
                <TableCell>{user._count.claims}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.createdAt.toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell>
                  <UserRowActions userId={user.id} role={user.role} isSelf={user.id === session?.user.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
