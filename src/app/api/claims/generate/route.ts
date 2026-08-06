import { NextResponse } from "next/server"

import { getAiProvider, AiProviderError } from "@/lib/ai"
import { generateClaimSchema, categoryLabel } from "@/lib/validations/claim"
import { withRateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const rateLimited = await withRateLimit(req, "claim-generate", 8, 60)
  if (rateLimited) return rateLimited

  const body = await req.json().catch(() => null)
  const parsed = generateClaimSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const provider = getAiProvider()
  const { category, ...rest } = parsed.data

  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const token of provider.generate({ category: categoryLabel(category), ...rest })) {
          controller.enqueue(encoder.encode(token))
        }
      } catch (error) {
        const message =
          error instanceof AiProviderError
            ? "No se pudo generar la reclamación. Inténtalo de nuevo en unos segundos."
            : "Ha ocurrido un error inesperado."
        controller.enqueue(encoder.encode(`\n\n[[ERROR]] ${message}`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Ai-Provider": provider.id,
    },
  })
}
