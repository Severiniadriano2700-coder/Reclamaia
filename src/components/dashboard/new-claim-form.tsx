"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sparkles, Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { generateClaimSchema, claimCategories, categoryLabel, type GenerateClaimInput } from "@/lib/validations/claim"
import { useClaimGeneration } from "@/hooks/use-claim-generation"
import { useClaimAnalysis } from "@/hooks/use-claim-analysis"
import { DocumentViewer } from "@/components/claims/document-viewer"
import { ClaimScoreCard } from "@/components/claims/claim-score-card"
import { AttachmentsUploader, type AttachmentItem } from "@/components/dashboard/attachments-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function NewClaimForm({
  defaultFirstName = "",
  defaultLastName = "",
  defaultCategory,
  defaultDescription = "",
}: {
  defaultFirstName?: string
  defaultLastName?: string
  defaultCategory?: string
  defaultDescription?: string
}) {
  const router = useRouter()
  const { content, status, generate } = useClaimGeneration()
  const { analysis, loading: analyzing, analyze, reset: resetAnalysis } = useClaimAnalysis()
  const [editedContent, setEditedContent] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const [savedId, setSavedId] = React.useState<string | null>(null)
  const [improving, setImproving] = React.useState(false)
  const [attachments, setAttachments] = React.useState<AttachmentItem[]>([])
  const analyzedContentRef = React.useRef<string | null>(null)

  const form = useForm<GenerateClaimInput>({
    resolver: zodResolver(generateClaimSchema),
    defaultValues: {
      category: (defaultCategory as GenerateClaimInput["category"]) ?? "AIRLINE",
      companyName: "",
      description: defaultDescription,
      desiredOutcome: "",
      firstName: defaultFirstName,
      lastName: defaultLastName,
      dni: "",
      address: "",
      referenceNumber: "",
      claimedAmount: "",
      incidentDate: "",
    },
  })

  React.useEffect(() => {
    setEditedContent(content)
  }, [content])

  React.useEffect(() => {
    if (status === "done" && content && analyzedContentRef.current !== content) {
      analyzedContentRef.current = content
      analyze({ ...form.getValues(), generatedContent: content })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, content])

  async function onSubmit(values: GenerateClaimInput) {
    setSavedId(null)
    resetAnalysis()
    analyzedContentRef.current = null
    await generate(values)
  }

  async function handleImprove() {
    if (!analysis) return
    setImproving(true)
    try {
      const values = form.getValues()
      const finalContent = await generate({ ...values, improvementNotes: analysis.improvements })
      if (finalContent) {
        analyzedContentRef.current = finalContent
        await analyze({ ...values, generatedContent: finalContent })
      }
    } finally {
      setImproving(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const values = form.getValues()
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, generatedContent: editedContent, files: attachments }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "No se pudo guardar la reclamación")
      }
      const body = await res.json()
      setSavedId(body.claim.id)
      if (body.requiresPayment) {
        toast.info("Ya usaste tu reclamación gratuita. Desbloquea esta por 3,50€.")
      } else {
        toast.success("Reclamación guardada en tu historial")
      }
      router.push(`/dashboard/reclamaciones/${body.claim.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  const isGenerating = status === "generating"

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Datos del reclamante
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ana" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl>
                        <Input placeholder="García Ruiz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DNI / NIE</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle Mayor 1, Madrid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Datos de la reclamación
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue>{(value: string) => categoryLabel(value)}</SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {claimCategories.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Iberia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="referenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N.º de contrato / reserva / póliza</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. IB4821XZ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="incidentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha del incidente</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="claimedAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Importe reclamado (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. 250€" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Qué ha pasado?</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-32 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desiredOutcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Qué resultado esperas?</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-20 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AttachmentsUploader attachments={attachments} onChange={setAttachments} />
            </div>

            <Button type="submit" size="lg" className="h-11 w-full gap-2 glow-gold" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generando…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generar reclamación
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="space-y-3">
        <DocumentViewer
          content={editedContent}
          onChange={setEditedContent}
          isStreaming={isGenerating}
          filename={`${form.getValues("companyName") || "reclamacion"}.pdf`}
        />
        {status === "done" && !savedId && (
          <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Guardar en historial
          </Button>
        )}
        {(analyzing || analysis) && !isGenerating && (
          <ClaimScoreCard
            analysis={analysis}
            loading={analyzing}
            improving={improving}
            onImprove={handleImprove}
          />
        )}
      </div>
    </div>
  )
}
