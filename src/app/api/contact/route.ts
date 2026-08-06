import { NextResponse } from "next/server"

import { contactSchema } from "@/lib/validations/contact"
import { sendContactMessage } from "@/lib/email"
import { withRateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  const rateLimited = await withRateLimit(req, "contact-send", 5, 60)
  if (rateLimited) return rateLimited

  const parsed = contactSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    await sendContactMessage(parsed.data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo enviar el mensaje."
    return NextResponse.json({ error: message }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
