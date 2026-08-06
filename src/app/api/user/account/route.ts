import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function DELETE() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  await db.user.delete({ where: { id: session.user.id } })

  return NextResponse.json({ success: true })
}
