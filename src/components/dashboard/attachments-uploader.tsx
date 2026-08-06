"use client"

import { Paperclip, X, FileText, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

import { UploadDropzone } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"

export interface AttachmentItem {
  url: string
  name: string
  size: number
  mimeType: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AttachmentsUploader({
  attachments,
  onChange,
}: {
  attachments: AttachmentItem[]
  onChange: (files: AttachmentItem[]) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Paperclip className="size-3.5" />
        Adjuntar documentación (opcional)
      </div>

      <UploadDropzone
        endpoint="claimAttachment"
        onClientUploadComplete={(res) => {
          onChange([
            ...attachments,
            ...res.map((r) => ({
              url: r.ufsUrl,
              name: r.name,
              size: r.size,
              mimeType: r.type || "application/octet-stream",
            })),
          ])
          toast.success(res.length > 1 ? "Archivos adjuntados" : "Archivo adjuntado")
        }}
        onUploadError={(err) => {
          toast.error(err.message || "No se pudo subir el archivo")
        }}
        appearance={{
          container: "rounded-xl border-dashed border-border bg-secondary/30 py-4",
          label: "text-xs text-foreground",
          allowedContent: "text-[11px] text-muted-foreground",
          button: "bg-gold text-gold-foreground text-xs ut-uploading:bg-gold/70",
        }}
        content={{
          label: "Arrastra o haz clic para subir",
          allowedContent: "Imágenes o PDF, hasta 8MB",
        }}
      />

      {attachments.length > 0 && (
        <ul className="space-y-1.5">
          {attachments.map((file, i) => (
            <li
              key={file.url}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs"
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
              <span className="shrink-0 text-muted-foreground">{formatSize(file.size)}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onChange(attachments.filter((_, idx) => idx !== i))}
                aria-label="Quitar archivo"
              >
                <X className="size-3" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
