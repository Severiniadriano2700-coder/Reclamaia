import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Borrador", className: "bg-secondary text-secondary-foreground" },
  GENERATING: { label: "Generando", className: "bg-secondary text-secondary-foreground" },
  GENERATED: { label: "Generada", className: "bg-gold-muted text-gold" },
  EDITED: { label: "Editada", className: "bg-gold-muted text-gold" },
  SENT: { label: "Enviada", className: "bg-blue-500/10 text-blue-500" },
  RESOLVED: { label: "Resuelta", className: "bg-success/10 text-success" },
  REJECTED: { label: "Rechazada", className: "bg-destructive/10 text-destructive" },
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT
  return (
    <Badge variant="secondary" className={cn(config.className, "border-transparent font-medium", className)}>
      {config.label}
    </Badge>
  )
}
