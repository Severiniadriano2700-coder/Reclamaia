"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { toast } from "sonner"
import { Copy, Download, Loader2, Mail, PencilLine, Eye } from "lucide-react"

import { cn } from "@/lib/utils"
import { exportNodeToPdf } from "@/lib/pdf"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DocumentViewer({
  content,
  onChange,
  editable = true,
  isStreaming = false,
  filename = "reclamacion.pdf",
  onSendEmail,
  className,
}: {
  content: string
  onChange?: (value: string) => void
  editable?: boolean
  isStreaming?: boolean
  filename?: string
  onSendEmail?: () => void
  className?: string
}) {
  const previewRef = React.useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = React.useState(false)
  const [tab, setTab] = React.useState<"preview" | "edit">("preview")

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    toast.success("Documento copiado al portapapeles")
  }

  async function handleExport() {
    if (!previewRef.current) return
    setExporting(true)
    try {
      await exportNodeToPdf(previewRef.current, filename)
    } catch {
      toast.error("No se pudo exportar el PDF")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-4 py-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "preview" | "edit")}>
          <TabsList>
            <TabsTrigger value="preview" className="gap-1.5">
              <Eye className="size-3.5" />
              Vista previa
            </TabsTrigger>
            {editable && (
              <TabsTrigger value="edit" className="gap-1.5">
                <PencilLine className="size-3.5" />
                Editar
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopy} disabled={!content}>
            <Copy className="size-3.5" />
            Copiar
          </Button>
          {onSendEmail && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onSendEmail} disabled={!content}>
              <Mail className="size-3.5" />
              Enviar
            </Button>
          )}
          <Button size="sm" className="gap-1.5" onClick={handleExport} disabled={!content || exporting}>
            {exporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            PDF
          </Button>
        </div>
      </div>

      {tab === "edit" && editable ? (
        <Textarea
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          className="min-h-[480px] resize-none rounded-none border-none bg-transparent p-6 font-mono text-sm leading-relaxed focus-visible:ring-0"
        />
      ) : (
        <div className="max-h-[560px] overflow-y-auto p-1">
          <div
            ref={previewRef}
            className="prose prose-sm mx-auto max-w-none rounded-xl bg-white p-8 text-neutral-900 shadow-sm prose-headings:font-heading prose-headings:tracking-tight prose-h1:text-xl prose-h1:border-b prose-h1:border-neutral-200 prose-h1:pb-3 prose-h2:mt-6 prose-h2:text-base prose-h2:text-neutral-800 prose-p:leading-relaxed prose-strong:text-neutral-900"
          >
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <p className="text-neutral-400">El documento aparecerá aquí…</p>
            )}
            {isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-neutral-400 align-middle" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
