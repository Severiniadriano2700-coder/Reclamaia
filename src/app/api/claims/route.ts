import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { getUsageSummary } from "@/lib/data/dashboard"
import { generateClaimSchema } from "@/lib/validations/claim"

const createClaimSchema = generateClaimSchema.extend({
  generatedContent: z.string().min(1),
  files: z
    .array(
      z.object({
        url: z.string().url(),
        name: z.string().max(200),
        size: z.number().max(50 * 1024 * 1024),
        mimeType: z.string().max(100),
      })
    )
    .max(5)
    .optional(),
})

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const favorite = searchParams.get("favorite")
  const q = searchParams.get("q")

  const claims = await db.claim.findMany({
    where: {
      userId: session.user.id,
      ...(status ? { status: status as never } : {}),
      ...(favorite === "true" ? { isFavorite: true } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { companyNameRaw: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { company: true },
  })

  return NextResponse.json({ claims })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { remaining, payPerClaim } = await getUsageSummary(session.user.id)
  const needsPayment = typeof remaining === "number" && remaining <= 0

  if (needsPayment && !payPerClaim) {
    return NextResponse.json(
      { error: "Has alcanzado el límite de reclamaciones de tu plan este mes." },
      { status: 403 }
    )
  }

  const parsed = createClaimSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const {
    category,
    companyName,
    incidentDate,
    description,
    desiredOutcome,
    generatedContent,
    firstName,
    lastName,
    dni,
    address,
    referenceNumber,
    claimedAmount,
    files,
  } = parsed.data

  const claim = await db.claim.create({
    data: {
      userId: session.user.id,
      category,
      companyNameRaw: companyName,
      title: `Reclamación a ${companyName}`,
      incidentDate: incidentDate ? new Date(incidentDate) : undefined,
      description,
      desiredOutcome,
      generatedContent,
      claimantFirstName: firstName,
      claimantLastName: lastName,
      claimantDni: dni,
      claimantAddress: address,
      referenceNumber,
      claimedAmount,
      status: "GENERATED",
      requiresPayment: needsPayment,
      aiProvider: (process.env.AI_PROVIDER?.toUpperCase() as never) ?? "MOCK",
      files: files?.length
        ? { create: files.map((f) => ({ url: f.url, name: f.name, size: f.size, mimeType: f.mimeType })) }
        : undefined,
    },
    include: { files: true },
  })

  return NextResponse.json({ claim, requiresPayment: needsPayment }, { status: 201 })
}
