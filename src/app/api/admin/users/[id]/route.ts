import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { db } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) return { error: NextResponse.json({ error: "No autenticado" }, { status: 401 }) }
  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "No autorizado" }, { status: 403 }) }
  }
  return { session }
}

const updateRoleSchema = z.object({ role: z.enum(["USER", "ADMIN"]) })

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  const parsed = updateRoleSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  if (id === session!.user.id) {
    return NextResponse.json({ error: "No puedes cambiar tu propio rol" }, { status: 400 })
  }

  const user = await db.user.update({ where: { id }, data: { role: parsed.data.role } })

  await db.auditLog.create({
    data: {
      actorId: session!.user.id,
      action: "user.role_changed",
      targetType: "User",
      targetId: id,
      metadata: { newRole: parsed.data.role },
    },
  })

  return NextResponse.json({ user: { id: user.id, role: user.role } })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  if (id === session!.user.id) {
    return NextResponse.json({ error: "No puedes eliminar tu propia cuenta desde aquí" }, { status: 400 })
  }

  await db.user.delete({ where: { id } })

  await db.auditLog.create({
    data: {
      actorId: session!.user.id,
      action: "user.deleted",
      targetType: "User",
      targetId: id,
    },
  })

  return NextResponse.json({ success: true })
}
