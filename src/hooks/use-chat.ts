"use client"

import * as React from "react"

export interface ChatMessageItem {
  id: string
  role: "USER" | "ASSISTANT"
  content: string
}

export interface ChatUsage {
  limit: number | "unlimited"
  remaining: number | "unlimited"
  plan: string
}

export function useChat(claimId?: string) {
  const [messages, setMessages] = React.useState<ChatMessageItem[]>([])
  const [usage, setUsage] = React.useState<ChatUsage | null>(null)
  const [loadingHistory, setLoadingHistory] = React.useState(true)
  const [sending, setSending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const query = claimId ? `?claimId=${claimId}` : ""

  const loadHistory = React.useCallback(async () => {
    setLoadingHistory(true)
    try {
      const res = await fetch(`/api/chat${query}`)
      if (!res.ok) throw new Error()
      const body = await res.json()
      setMessages(body.messages)
      setUsage(body.usage)
    } catch {
      // silent: chat widget degrades gracefully to empty state
    } finally {
      setLoadingHistory(false)
    }
  }, [query])

  React.useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const sendMessage = React.useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || sending) return

    setError(null)
    setSending(true)

    const userMsg: ChatMessageItem = { id: `local-${Date.now()}`, role: "USER", content: trimmed }
    const assistantId = `local-${Date.now() + 1}`
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "ASSISTANT", content: "" }])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, claimId }),
      })

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "No se pudo enviar el mensaje")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })

        if (chunk.includes("[[ERROR]]")) {
          throw new Error(chunk.split("[[ERROR]]")[1]?.trim() || "Error del asistente")
        }

        full += chunk
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: full } : m))
        )
      }

      setUsage((prev) =>
        prev
          ? { ...prev, remaining: typeof prev.remaining === "number" ? Math.max(prev.remaining - 1, 0) : prev.remaining }
          : prev
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado")
      setMessages((prev) => prev.filter((m) => m.id !== assistantId && m.id !== userMsg.id))
    } finally {
      setSending(false)
    }
  }, [sending, claimId])

  const clearConversation = React.useCallback(async () => {
    await fetch(`/api/chat${query}`, { method: "DELETE" })
    setMessages([])
  }, [query])

  return { messages, usage, loadingHistory, sending, error, sendMessage, clearConversation }
}
