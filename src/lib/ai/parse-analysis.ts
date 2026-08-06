import type { ClaimAnalysis } from "./types"

export function parseAnalysisResponse(raw: string): ClaimAnalysis {
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  const jsonText = jsonMatch ? jsonMatch[0] : raw

  try {
    const parsed = JSON.parse(jsonText) as Partial<ClaimAnalysis>
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)))
    const strengths = Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 6).map(String) : []
    const improvements = Array.isArray(parsed.improvements)
      ? parsed.improvements.slice(0, 6).map(String)
      : []

    return { score, strengths, improvements }
  } catch {
    return { score: 0, strengths: [], improvements: ["No se pudo analizar el documento."] }
  }
}
