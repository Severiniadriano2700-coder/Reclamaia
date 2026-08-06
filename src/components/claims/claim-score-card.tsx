"use client"

import { CheckCircle2, AlertTriangle, Loader2, Wand2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { ClaimAnalysis } from "@/lib/ai"

function scoreColor(score: number) {
  if (score >= 90) return "text-success"
  if (score >= 70) return "text-gold"
  return "text-destructive"
}

function scoreRingColor(score: number) {
  if (score >= 90) return "var(--success)"
  if (score >= 70) return "var(--gold)"
  return "var(--destructive)"
}

export function ClaimScoreCard({
  analysis,
  loading,
  improving,
  onImprove,
  className,
}: {
  analysis: ClaimAnalysis | null
  loading?: boolean
  improving?: boolean
  onImprove?: () => void
  className?: string
}) {
  if (loading) {
    return (
      <div className={cn("flex items-center gap-3 rounded-2xl border border-border bg-card p-6", className)}>
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Analizando la calidad de la reclamación…</p>
      </div>
    )
  }

  if (!analysis) return null

  const circumference = 2 * Math.PI * 26
  const offset = circumference - (analysis.score / 100) * circumference

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Puntuación de la reclamación</p>
          <p className="text-xs text-muted-foreground">Evaluación automática de calidad y completitud.</p>
        </div>
        <div className="relative flex size-16 shrink-0 items-center justify-center">
          <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke={scoreRingColor(analysis.score)}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span className={cn("absolute font-heading text-sm font-semibold", scoreColor(analysis.score))}>
            {analysis.score}
          </span>
        </div>
      </div>

      {analysis.strengths.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Fortalezas</p>
          <ul className="space-y-1.5">
            {analysis.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.improvements.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Aspectos a mejorar</p>
          <ul className="space-y-1.5">
            {analysis.improvements.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-gold" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {onImprove && analysis.improvements.length > 0 && (
        <Button variant="outline" className="mt-5 w-full gap-2" onClick={onImprove} disabled={improving}>
          {improving ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
          Mejorar automáticamente
        </Button>
      )}
    </div>
  )
}
