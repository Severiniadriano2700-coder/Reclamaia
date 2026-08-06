import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NewClaimForm } from "@/components/dashboard/new-claim-form"

export default async function NewClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ templateId?: string }>
}) {
  const session = await auth()
  const { templateId } = await searchParams

  const [firstName = "", ...rest] = (session?.user.name ?? "").split(" ")
  const lastName = rest.join(" ")

  const template = templateId
    ? await db.template.findFirst({
        where: { id: templateId, OR: [{ userId: session!.user.id }, { isPublic: true }] },
      })
    : null

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Nueva reclamación</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {template
            ? `Partiendo de la plantilla "${template.name}".`
            : "Describe tu caso y genera un documento formal en segundos."}
        </p>
      </div>
      <NewClaimForm
        defaultFirstName={firstName}
        defaultLastName={lastName}
        defaultCategory={template?.category}
        defaultDescription={template?.content}
      />
    </div>
  )
}
