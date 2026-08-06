import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const { id } = await params
  const template = await db.template.findUnique({ where: { id } })
  if (!template || template.userId !== session.user.id) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 })
  }

  await db.template.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
