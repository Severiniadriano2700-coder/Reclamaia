"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sparkles, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { generateClaimSchema, claimCategories, categoryLabel, type GenerateClaimInput } from "@/lib/validations/claim"
import { useClaimGeneration } from "@/hooks/use-claim-generation"
import { SectionHeading } from "@/components/marketing/section-heading"
import { DocumentViewer } from "@/components/claims/document-viewer"
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

export function ClaimDemo() {
  const { content, status, generate } = useClaimGeneration()

  const form = useForm<GenerateClaimInput>({
    resolver: zodResolver(generateClaimSchema),
    defaultValues: {
      category: "AIRLINE",
      companyName: "",
      description: "",
      desiredOutcome: "",
      firstName: "",
      lastName: "",
      referenceNumber: "",
    },
  })

  async function onSubmit(values: GenerateClaimInput) {
    await generate(values)
  }

  const isGenerating = status === "generating"

  return (
    <section id="generar" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="Pruébalo ahora"
        title="Escribe tu caso y observa cómo se genera en tiempo real"
        description="Esto es una demo funcional. El documento se genera con el mismo motor que usan nuestros usuarios."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

              <FormField
                control={form.control}
                name="referenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N.º de contrato / reserva / póliza (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. IB4821XZ" {...field} />
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
                      <Textarea
                        placeholder="Mi vuelo IB1234 del 12 de enero fue cancelado 3 horas antes de la salida sin previo aviso ni alternativa..."
                        className="min-h-28 resize-none"
                        {...field}
                      />
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
                      <Textarea
                        placeholder="Compensación económica según el Reglamento 261/2004 y reembolso de gastos adicionales."
                        className="min-h-20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="h-12 w-full gap-2 glow-gold" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Generando reclamación…
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

          {status === "done" && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-gold/30 bg-gold-muted px-4 py-3 text-sm">
              <span>Crea una cuenta para guardar, editar y enviar esta reclamación.</span>
              <Link href="/register" className="flex shrink-0 items-center gap-1 font-medium text-gold hover:underline">
                Guardar <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}
        </div>

        <DocumentViewer
          content={content}
          editable={false}
          isStreaming={isGenerating}
          onSendEmail={
            status === "done"
              ? () => toast.info("Crea una cuenta gratuita para enviar reclamaciones por email.")
              : undefined
          }
          filename="reclamacion-demo.pdf"
        />
      </div>
    </section>
  )
}
