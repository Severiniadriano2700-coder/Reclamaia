import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { getAiProvider, AiProviderError } from "@/lib/ai"
import { analyzeClaimSchema } from "@/lib/validations/analysis"
import { categoryLabel } from "@/lib/validations/claim"
import { withRateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const rateLimited = await withRateLimit(req, "claim-analyze", 15, 60)
  if (rateLimited) return rateLimited

  const parsed = analyzeClaimSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const { category, ...rest } = parsed.data
  const provider = getAiProvider()

  try {
    const analysis = await provider.analyze({ category: categoryLabel(category), ...rest })
    return NextResponse.json({ analysis })
  } catch (error) {
    const message =
      error instanceof AiProviderError ? error.message : "No se pudo analizar la reclamación."
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
