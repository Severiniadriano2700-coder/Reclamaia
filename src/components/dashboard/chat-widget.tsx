"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { MessageCircle, X, Send, RotateCcw, Loader2, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { useChat } from "@/hooks/use-chat"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const SUGGESTIONS = [
  "¿Qué puedo reclamar si me cancelan un vuelo?",
  "¿Cuál es el estado de mis reclamaciones?",
  "¿Cuánto tarda un banco en responder?",
]

export function ChatWidget() {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState("")
  const { messages, usage, loadingHistory, sending, error, sendMessage, clearConversation } = useChat()
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
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-lg shadow-black/20 glow-gold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Cerrar asistente" : "Abrir asistente"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "chat"}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="glass fixed bottom-24 right-6 z-50 flex h-[min(600px,calc(100vh-140px))] w-[min(380px,calc(100vw-48px))] flex-col overflow-hidden rounded-2xl border border-border shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-gold-muted text-gold">
                  <Sparkles className="size-3.5" />
                </span>
                <div>
                  <p className="text-sm font-medium leading-tight">Asistente Litiga IA</p>
                  {usage && (
                    <p className="text-[11px] leading-tight text-muted-foreground">
                      {usage.remaining === "unlimited"
                        ? "Mensajes ilimitados"
                        : `${usage.remaining} de ${usage.limit} mensajes este mes`}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={clearConversation}
                aria-label="Nueva conversación"
                title="Nueva conversación"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {loadingHistory ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Pregúntame sobre tus reclamaciones o tus derechos como consumidor.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-left text-xs transition-colors hover:border-gold/40"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex", m.role === "USER" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                        m.role === "USER"
                          ? "bg-gold text-gold-foreground"
                          : "bg-secondary text-secondary-foreground"
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
                <div className="rounded-xl border border-gold/30 bg-gold-muted px-3 py-2.5 text-center text-xs">
                  Has alcanzado tu límite de mensajes este mes.{" "}
                  <Link href="/dashboard/facturacion" className="font-medium text-gold hover:underline">
                    Mejora tu plan
                  </Link>
                </div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
