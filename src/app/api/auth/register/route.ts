import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { registerSchema } from "@/lib/validations/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(req: Request) {
  const rateLimited = await withRateLimit(req, "auth-register", 5, 60)
  if (rateLimited) return rateLimited

  const body = await req.json().catch(() => null)
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { name, email, password } = parsed.data

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: "Ya existe una cuenta con ese email" },
      { status: 409 }
    )
  }

  const passwordHash = await hashPassword(password)

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      subscription: { create: { plan: "FREE", status: "ACTIVE" } },
    },
  })

  sendWelcomeEmail(user.email, user.name ?? "").catch(() => {})

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}
