import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { claimCategoryValues } from "@/lib/validations/claim"

const createSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.enum(claimCategoryValues),
  content: z.string().min(1),
})

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const templates = await db.template.findMany({
    where: { OR: [{ userId: session.user.id }, { isPublic: true }] },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ templates })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const template = await db.template.create({
    data: { ...parsed.data, userId: session.user.id },
  })

  return NextResponse.json({ template }, { status: 201 })
}
