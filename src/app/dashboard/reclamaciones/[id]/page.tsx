import { notFound } from "next/navigation"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ClaimDetail } from "@/components/dashboard/claim-detail"

export default async function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const claim = await db.claim.findUnique({ where: { id }, include: { files: true } })
  if (!claim || claim.userId !== session!.user.id) notFound()

  return (
    <ClaimDetail
      claim={{
        id: claim.id,
        title: claim.title,
        category: claim.category,
        status: claim.status,
        isFavorite: claim.isFavorite,
        generatedContent: claim.generatedContent,
        createdAt: claim.createdAt.toISOString(),
        sentToEmail: claim.sentToEmail,
        companyNameRaw: claim.companyNameRaw,
        description: claim.description,
        desiredOutcome: claim.desiredOutcome,
        claimantFirstName: claim.claimantFirstName,
        claimantLastName: claim.claimantLastName,
        claimantDni: claim.claimantDni,
        claimantAddress: claim.claimantAddress,
        referenceNumber: claim.referenceNumber,
        claimedAmount: claim.claimedAmount,
        files: claim.files.map((f) => ({ id: f.id, url: f.url, name: f.name, size: f.size, mimeType: f.mimeType })),
        requiresPayment: claim.requiresPayment,
        paidAt: claim.paidAt ? claim.paidAt.toISOString() : null,
      }}
      userEmail={session!.user.email}
    />
  )
}
