import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { getAiProvider, AiProviderError } from "@/lib/ai"
import { getChatUsageSummary, getClaimChatUsage } from "@/lib/data/dashboard"
import { categoryLabel } from "@/lib/validations/claim"
import { sendChatMessageSchema } from "@/lib/validations/chat"
import { withRateLimit } from "@/lib/rate-limit"

const HISTORY_LIMIT = 20

async function assertClaimChatAccess(userId: string, claimId: string) {
  const claim = await db.claim.findUnique({ where: { id: claimId } })
  if (!claim || claim.userId !== userId) return null
  if (claim.requiresPayment || !claim.paidAt) return null
  return claim
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const claimId = searchParams.get("claimId")

  if (claimId) {
    const claim = await assertClaimChatAccess(session.user.id, claimId)
    if (!claim) {
      return NextResponse.json({ error: "Reclamación no disponible para chat" }, { status: 403 })
    }
    const [messages, usage] = await Promise.all([
      db.chatMessage.findMany({ where: { userId: session.user.id, claimId }, orderBy: { createdAt: "asc" } }),
      getClaimChatUsage(claimId),
    ])
    return NextResponse.json({
      messages: messages.map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.createdAt })),
      usage: { limit: usage.limit, remaining: usage.remaining, plan: "PAY_PER_CLAIM" },
    })
  }

  const [messages, usage] = await Promise.all([
    db.chatMessage.findMany({
      where: { userId: session.user.id, claimId: null },
      orderBy: { createdAt: "asc" },
      take: 100,
    }),
    getChatUsageSummary(session.user.id),
  ])

  return NextResponse.json({
    messages: messages.map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.createdAt })),
    usage: {
      limit: usage.limit,
      remaining: usage.remaining,
      plan: usage.plan.id,
    },
  })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const claimId = searchParams.get("claimId")

  await db.chatMessage.deleteMany({ where: { userId: session.user.id, claimId } })

  return NextResponse.json({ success: true })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const rateLimited = await withRateLimit(req, "chat-send", 20, 60)
  if (rateLimited) return rateLimited

  const parsed = sendChatMessageSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 })
  }

  const userId = session.user.id
  const userMessage = parsed.data.message
  const claimId = parsed.data.claimId ?? null

  let scopedClaim: Awaited<ReturnType<typeof assertClaimChatAccess>> = null
  if (claimId) {
    scopedClaim = await assertClaimChatAccess(userId, claimId)
    if (!scopedClaim) {
      return NextResponse.json({ error: "Reclamación no disponible para chat" }, { status: 403 })
    }
    const usage = await getClaimChatUsage(claimId)
    if (usage.remaining <= 0) {
      return NextResponse.json(
        { error: "Has usado los 5 mensajes incluidos con esta reclamación." },
        { status: 403 }
      )
    }
  } else {
    const usage = await getChatUsageSummary(userId)
    if (typeof usage.remaining === "number" && usage.remaining <= 0) {
      return NextResponse.json(
        { error: "Has alcanzado el límite de mensajes del asistente de tu plan este mes." },
        { status: 403 }
      )
    }
  }

  const [history, claims] = await Promise.all([
    db.chatMessage.findMany({
      where: { userId, claimId },
      orderBy: { createdAt: "desc" },
      take: HISTORY_LIMIT,
    }),
    scopedClaim
      ? Promise.resolve([scopedClaim])
      : db.claim.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: { title: true, category: true, status: true, companyNameRaw: true, createdAt: true },
        }),
  ])

  await db.chatMessage.create({
    data: { userId, claimId, role: "USER", content: userMessage },
  })

  const conversation = [
    ...history.reverse().map((m) => ({
      role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    })),
    { role: "user" as const, content: userMessage },
  ]

  const claimSummaries = claims.map((c) => ({
    title: c.title,
    category: categoryLabel(c.category),
    status: c.status,
    companyName: c.companyNameRaw,
    createdAt: c.createdAt.toLocaleDateString("es-ES"),
  }))

  const provider = getAiProvider()
  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = ""
      try {
        for await (const token of provider.chat({ messages: conversation, claims: claimSummaries })) {
          full += token
          controller.enqueue(encoder.encode(token))
        }
      } catch (error) {
        const message =
          error instanceof AiProviderError
            ? "No se pudo obtener respuesta del asistente. Inténtalo de nuevo."
            : "Ha ocurrido un error inesperado."
        controller.enqueue(encoder.encode(`\n\n[[ERROR]] ${message}`))
      } finally {
        controller.close()
        if (full.trim()) {
          await db.chatMessage.create({
            data: { userId, claimId, role: "ASSISTANT", content: full },
          })
        }
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
