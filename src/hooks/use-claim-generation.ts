"use client"

import * as React from "react"

import type { GenerateClaimInput } from "@/lib/validations/claim"

export type GenerationStatus = "idle" | "generating" | "done" | "error"

export function useClaimGeneration() {
  const [content, setContent] = React.useState("")
  const [status, setStatus] = React.useState<GenerationStatus>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  const generate = React.useCallback(async (input: GenerateClaimInput) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setContent("")
    setError(null)
    setStatus("generating")

    try {
      const res = await fetch("/api/claims/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "No se pudo generar la reclamación.")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })

        if (chunk.includes("[[ERROR]]")) {
          throw new Error(chunk.split("[[ERROR]]")[1]?.trim() || "Error al generar")
        }

        full += chunk
        setContent(full)
      }

      setStatus("done")
      return full
    } catch (err) {
      if (controller.signal.aborted) return null
      setError(err instanceof Error ? err.message : "Error inesperado")
      setStatus("error")
      return null
    }
  }, [])

  const reset = React.useCallback(() => {
    abortRef.current?.abort()
    setContent("")
    setStatus("idle")
    setError(null)
  }, [])

  return { content, status, error, generate, reset }
}
