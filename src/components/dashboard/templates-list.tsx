"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Copy, LayoutTemplate, FilePlus2 } from "lucide-react"

import { claimCategories, claimCategoryValues, categoryLabel } from "@/lib/validations/claim"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const templateSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.enum(claimCategoryValues),
  content: z.string().min(10),
})

type TemplateInput = z.infer<typeof templateSchema>

type Template = {
  id: string
  name: string
  category: string
  content: string
  isPublic: boolean
}

export function TemplatesList() {
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  const { data, isLoading } = useQuery<{ templates: Template[] }>({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await fetch("/api/templates")
      if (!res.ok) throw new Error("No se pudieron cargar las plantillas")
      return res.json()
    },
  })

  const form = useForm<TemplateInput>({
    resolver: zodResolver(templateSchema),
    defaultValues: { name: "", category: "OTHER", content: "" },
  })

  async function onSubmit(values: TemplateInput) {
    setSubmitting(true)
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error()
      toast.success("Plantilla guardada")
      form.reset()
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    } catch {
      toast.error("No se pudo guardar la plantilla")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/templates/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("No se pudo eliminar")
      return
    }
    toast.success("Plantilla eliminada")
    queryClient.invalidateQueries({ queryKey: ["templates"] })
  }

  function handleCopy(content: string) {
    navigator.clipboard.writeText(content)
    toast.success("Contenido copiado")
  }

  const templates = data?.templates ?? []

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Nueva plantilla
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva plantilla</DialogTitle>
              <DialogDescription>
                Guarda un texto reutilizable para futuras reclamaciones.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="template-name">Nombre</Label>
                <Input id="template-name" {...form.register("name")} placeholder="Reclamación estándar de vuelos" />
              </div>
              <div className="space-y-1.5">
                <Label>Categoría</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(v) => form.setValue("category", v as TemplateInput["category"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>{(value: string) => categoryLabel(value)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {claimCategories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="template-content">Contenido</Label>
                <Textarea id="template-content" className="min-h-32" {...form.register("content")} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  Guardar plantilla
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <LayoutTemplate className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Todavía no tienes plantillas guardadas.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((template) => (
            <div key={template.id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{categoryLabel(template.category)}</p>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(template.id)} aria-label="Eliminar">
                  <Trash2 className="size-3.5 text-muted-foreground" />
                </Button>
              </div>
              <p className="mt-3 line-clamp-3 flex-1 text-xs text-muted-foreground">{template.content}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => handleCopy(template.content)}
                >
                  <Copy className="size-3.5" />
                  Copiar
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-1.5"
                  nativeButton={false}
                  render={<Link href={`/dashboard/nueva?templateId=${template.id}`} />}
                >
                  <FilePlus2 className="size-3.5" />
                  Usar plantilla
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
