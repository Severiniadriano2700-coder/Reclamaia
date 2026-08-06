"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Save, Star, Trash2, Paperclip, FileText, Image as ImageIcon, Lock } from "lucide-react"

import { categoryLabel, type GenerateClaimInput } from "@/lib/validations/claim"
import { cn } from "@/lib/utils"
import { PAY_PER_CLAIM_PRICE_EUR } from "@/lib/plans"
import { useClaimGeneration } from "@/hooks/use-claim-generation"
import { useClaimAnalysis } from "@/hooks/use-claim-analysis"
import { DocumentViewer } from "@/components/claims/document-viewer"
import { ClaimScoreCard } from "@/components/claims/claim-score-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { SendClaimDialog } from "@/components/dashboard/send-claim-dialog"
import { UnlockClaimButton } from "@/components/dashboard/unlock-claim-button"
import { ClaimChatPanel } from "@/components/dashboard/claim-chat-panel"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type ClaimDetailData = {
  id: string
  title: string
  category: string
  status: string
  isFavorite: boolean
  generatedContent: string | null
  createdAt: string
  sentToEmail: string | null
  companyNameRaw: string | null
  description: string
  desiredOutcome: string
  claimantFirstName: string | null
  claimantLastName: string | null
  claimantDni: string | null
  claimantAddress: string | null
  referenceNumber: string | null
  claimedAmount: string | null
  files: { id: string; url: string; name: string; size: number; mimeType: string }[]
  requiresPayment: boolean
  paidAt: string | null
}

const PRICE_LABEL = `${PAY_PER_CLAIM_PRICE_EUR.toFixed(2).replace(".", ",")}€`

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ClaimDetail({
  claim,
  userEmail,
}: {
  claim: ClaimDetailData
  userEmail?: string | null
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { generate, status: generationStatus } = useClaimGeneration()
  const { analysis, loading: analyzing, analyze, reset: resetAnalysis } = useClaimAnalysis()
  const [content, setContent] = React.useState(claim.generatedContent ?? "")
  const [isFavorite, setIsFavorite] = React.useState(claim.isFavorite)
  const [saving, setSaving] = React.useState(false)
  const [improving, setImproving] = React.useState(false)

  const isLocked = claim.requiresPayment && !claim.paidAt
  const isDirty = content !== (claim.generatedContent ?? "")
  const isStreaming = generationStatus === "generating"

  React.useEffect(() => {
    if (searchParams.get("payment") !== "success" || !isLocked) return
    let attempts = 0
    const interval = setInterval(() => {
      attempts += 1
      router.refresh()
      if (attempts >= 6) clearInterval(interval)
    }, 2000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const baseInput = React.useCallback(
    (): GenerateClaimInput => ({
      category: claim.category as GenerateClaimInput["category"],
      companyName: claim.companyNameRaw ?? "la empresa",
      description: claim.description,
      desiredOutcome: claim.desiredOutcome,
      firstName: claim.claimantFirstName ?? undefined,
      lastName: claim.claimantLastName ?? undefined,
      dni: claim.claimantDni ?? undefined,
      address: claim.claimantAddress ?? undefined,
      referenceNumber: claim.referenceNumber ?? undefined,
      claimedAmount: claim.claimedAmount ?? undefined,
    }),
    [claim]
  )

  React.useEffect(() => {
    if (content && !isLocked) analyze({ ...baseInput(), generatedContent: content })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/claims/${claim.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedContent: content }),
      })
      if (!res.ok) throw new Error()
      toast.success("Cambios guardados")
      router.refresh()
    } catch {
      toast.error("No se pudieron guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  async function handleImprove() {
    if (!analysis) return
    setImproving(true)
    resetAnalysis()
    try {
      const finalContent = await generate({
        ...baseInput(),
        improvementNotes: analysis.improvements,
      })
      if (finalContent) {
        setContent(finalContent)
        await analyze({ ...baseInput(), generatedContent: finalContent })
      }
    } finally {
      setImproving(false)
    }
  }

  async function toggleFavorite() {
    setIsFavorite((v) => !v)
    await fetch(`/api/claims/${claim.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !isFavorite }),
    })
  }

  async function handleDelete() {
    const res = await fetch(`/api/claims/${claim.id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("No se pudo eliminar")
      return
    }
    toast.success("Reclamación eliminada")
    router.push("/dashboard/historial")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">{claim.title}</h1>
            <StatusBadge status={claim.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {categoryLabel(claim.category)} · Creada el {new Date(claim.createdAt).toLocaleDateString("es-ES")}
            {claim.sentToEmail && <> · Enviada a {claim.sentToEmail}</>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isLocked && (
            <Button variant="outline" size="icon" onClick={toggleFavorite} aria-label="Favorita">
              <Star className={cn("size-4", isFavorite && "fill-gold text-gold")} />
            </Button>
          )}
          {!isLocked && (
            <SendClaimDialog
              claimId={claim.id}
              defaultEmail={userEmail ?? undefined}
              trigger={<Button variant="outline">Enviar por email</Button>}
            />
          )}
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" size="icon" aria-label="Eliminar" />}>
              <Trash2 className="size-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar esta reclamación?</AlertDialogTitle>
                <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {isLocked ? (
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-card">
          <div
            className="max-h-72 select-none overflow-hidden whitespace-pre-wrap p-6 text-sm leading-relaxed text-muted-foreground blur-sm"
            aria-hidden="true"
          >
            {content.slice(0, 800) || "Documento generado disponible tras el desbloqueo."}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 px-6 text-center backdrop-blur-sm">
            <span className="flex size-12 items-center justify-center rounded-full bg-gold-muted text-gold">
              <Lock className="size-5" />
            </span>
            <p className="font-heading text-lg font-semibold">Reclamación lista, pendiente de desbloqueo</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Ya usaste tu reclamación gratuita. Desbloquea esta por un pago único de {PRICE_LABEL} e incluye
              descarga en PDF, envío por email y 5 mensajes del asistente sobre esta reclamación.
            </p>
            <UnlockClaimButton claimId={claim.id} priceLabel={PRICE_LABEL} />
          </div>
        </div>
      ) : (
        <DocumentViewer
          content={content}
          onChange={setContent}
          isStreaming={isStreaming}
          filename={`${claim.title}.pdf`}
        />
      )}

      {!isLocked && claim.files.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Paperclip className="size-3.5" />
            Documentación adjunta
          </p>
          <ul className="space-y-1.5">
            {claim.files.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
              >
                {file.mimeType.startsWith("image/") ? (
                  <ImageIcon className="size-3.5 shrink-0 text-gold" />
                ) : (
                  <FileText className="size-3.5 shrink-0 text-gold" />
                )}
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 truncate hover:underline"
                >
                  {file.name}
                </a>
                <span className="shrink-0 text-xs text-muted-foreground">{formatSize(file.size)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isLocked && isDirty && !isStreaming && (
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Guardar cambios
        </Button>
      )}

      {!isLocked && (analyzing || analysis) && !isStreaming && (
        <ClaimScoreCard
          analysis={analysis}
          loading={analyzing}
          improving={improving}
          onImprove={handleImprove}
        />
      )}

      {claim.paidAt && <ClaimChatPanel claimId={claim.id} />}
    </div>
  )
}
