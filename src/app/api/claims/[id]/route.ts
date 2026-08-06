import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { db } from "@/lib/db"

const updateSchema = z.object({
  generatedContent: z.string().min(1).optional(),
  isFavorite: z.boolean().optional(),
  status: z.enum(["DRAFT", "GENERATED", "EDITED", "SENT", "RESOLVED", "REJECTED"]).optional(),
})

async function getOwnedClaim(id: string, userId: string) {
  const claim = await db.claim.findUnique({ where: { id }, include: { company: true, files: true } })
  if (!claim || claim.userId !== userId) return null
  return claim
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const { id } = await params
  const claim = await getOwnedClaim(id, session.user.id)
  if (!claim) return NextResponse.json({ error: "No encontrada" }, { status: 404 })

  return NextResponse.json({ claim })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const { id } = await params
  const existing = await getOwnedClaim(id, session.user.id)
  if (!existing) return NextResponse.json({ error: "No encontrada" }, { status: 404 })

  const parsed = updateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const data = { ...parsed.data }
  if (data.generatedContent && existing.status === "GENERATED") {
    Object.assign(data, { status: "EDITED" as const })
  }

  const claim = await db.claim.update({ where: { id }, data })

  return NextResponse.json({ claim })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const { id } = await params
  const existing = await getOwnedClaim(id, session.user.id)
  if (!existing) return NextResponse.json({ error: "No encontrada" }, { status: 404 })

  await db.claim.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
