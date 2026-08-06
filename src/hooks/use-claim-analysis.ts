"use client"

import * as React from "react"

import type { AnalyzeClaimInput } from "@/lib/validations/analysis"
import type { ClaimAnalysis } from "@/lib/ai"

export function useClaimAnalysis() {
  const [analysis, setAnalysis] = React.useState<ClaimAnalysis | null>(null)
  const [loading, setLoading] = React.useState(false)

  const analyze = React.useCallback(async (input: AnalyzeClaimInput) => {
    setLoading(true)
    try {
      const res = await fetch("/api/claims/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error("No se pudo analizar")
      const body = await res.json()
      setAnalysis(body.analysis as ClaimAnalysis)
      return body.analysis as ClaimAnalysis
    } catch {
      setAnalysis(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = React.useCallback(() => setAnalysis(null), [])

  return { analysis, loading, analyze, reset }
}
