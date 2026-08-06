import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/password"
import { updatePasswordSchema } from "@/lib/validations/user"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const parsed = updatePasswordSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    )
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user?.passwordHash) {
    return NextResponse.json(
      { error: "Esta cuenta inicia sesión con un proveedor externo y no tiene contraseña." },
      { status: 400 }
    )
  }

  const isValid = await verifyPassword(parsed.data.currentPassword, user.passwordHash)
  if (!isValid) {
    return NextResponse.json({ error: "La contraseña actual no es correcta" }, { status: 400 })
  }

  const passwordHash = await hashPassword(parsed.data.newPassword)
  await db.user.update({ where: { id: user.id }, data: { passwordHash } })

  return NextResponse.json({ success: true })
}
