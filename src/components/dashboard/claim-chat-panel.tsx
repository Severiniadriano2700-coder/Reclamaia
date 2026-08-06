"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import { Loader2, Send, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { useChat } from "@/hooks/use-chat"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function ClaimChatPanel({ claimId }: { claimId: string }) {
  const [input, setInput] = React.useState("")
  const { messages, usage, loadingHistory, sending, error, sendMessage } = useChat(claimId)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const limitReached = usage && typeof usage.remaining === "number" && usage.remaining <= 0

  function handleSend() {
    if (!input.trim() || limitReached) return
    sendMessage(input)
    setInput("")
  }

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-gold-muted text-gold">
            <Sparkles className="size-3.5" />
          </span>
          <div>
            <p className="text-sm font-medium leading-tight">Chat sobre esta reclamación</p>
            {usage && (
              <p className="text-[11px] leading-tight text-muted-foreground">
                {usage.remaining} de {usage.limit} mensajes incluidos
              </p>
            )}
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
        {loadingHistory ? (
          <div className="flex justify-center py-6">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Pregunta cualquier duda sobre esta reclamación: plazos, siguientes pasos, cómo responder…
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "USER" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  m.role === "USER" ? "bg-gold text-gold-foreground" : "bg-secondary text-secondary-foreground"
                )}
              >
                {m.role === "ASSISTANT" ? (
                  m.content ? (
                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <Loader2 className="size-3.5 animate-spin" />
                  )
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))
        )}
        {error && <p className="text-center text-xs text-destructive">{error}</p>}
      </div>

      <div className="border-t border-border p-3">
        {limitReached ? (
          <p className="rounded-xl border border-gold/30 bg-gold-muted px-3 py-2.5 text-center text-xs">
            Has usado los {usage?.limit} mensajes incluidos con esta reclamación.
          </p>
        ) : (
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Escribe tu pregunta…"
              className="min-h-9 flex-1 resize-none text-sm"
              rows={1}
            />
            <Button
              size="icon"
              className="shrink-0"
              onClick={handleSend}
              disabled={sending || !input.trim()}
              aria-label="Enviar"
            >
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
