import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { sendClaimEmail } from "@/lib/email"
import { withRateLimit } from "@/lib/rate-limit"

const bodySchema = z.object({ to: z.string().email() })

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const rateLimited = await withRateLimit(req, "claim-send", 10, 60)
  if (rateLimited) return rateLimited

  const { id } = await params
  const claim = await db.claim.findUnique({ where: { id } })
  if (!claim || claim.userId !== session.user.id) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 })
  }
  if (!claim.generatedContent) {
    return NextResponse.json({ error: "Esta reclamación no tiene contenido generado." }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 })
  }

  try {
    await sendClaimEmail({
      to: parsed.data.to,
      claimTitle: claim.title,
      companyName: claim.companyNameRaw ?? "la empresa",
      content: claim.generatedContent,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo enviar el email"
    return NextResponse.json({ error: message }, { status: 502 })
  }

  await db.claim.update({
    where: { id },
    data: { status: "SENT", sentAt: new Date(), sentToEmail: parsed.data.to },
  })

  return NextResponse.json({ success: true })
}
