import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { updateProfileSchema } from "@/lib/validations/user"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const parsed = updateProfileSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const user = await db.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  })

  return NextResponse.json({ user: { id: user.id, name: user.name } })
}
