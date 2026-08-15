"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, FileCheck2, Plane, Landmark, ShieldCheck, Package } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const examples = [
  {
    icon: Plane,
    label: "Vuelo cancelado",
    company: "Iberia",
    text: "Por medio del presente escrito, me dirijo a Iberia para exponer que el vuelo IB4821 fue cancelado sin previo aviso, incumpliendo el Reglamento (CE) 261/2004 y generando derecho a compensación de 250€.",
  },
  {
    icon: Landmark,
    label: "Comisión bancaria",
    company: "BBVA",
    text: "Solicito la devolución de la comisión de mantenimiento cobrada el pasado 12 de julio sin previo aviso ni justificación contractual, conforme a la normativa de transparencia bancaria vigente.",
  },
  {
    icon: ShieldCheck,
    label: "Seguro rechazado",
    company: "Mapfre",
    text: "La aseguradora ha denegado mi siniestro sin justificación suficiente, incumpliendo lo dispuesto en el artículo 20 de la Ley de Contrato de Seguro sobre la obligación de resolución motivada.",
  },
  {
    icon: Package,
    label: "Paquete perdido",
    company: "Amazon",
    text: "El pedido #48213 no fue entregado en el plazo comprometido pese a figurar como enviado. Solicito el reembolso íntegro conforme al artículo 66 bis del Real Decreto Legislativo 1/2007.",
  },
]

const TYPE_SPEED_MS = 18
const HOLD_MS = 1400
const CYCLE_PAUSE_MS = 900

function useTypewriterCycle(texts: string[]) {
  const [index, setIndex] = React.useState(0)
  const [displayed, setDisplayed] = React.useState("")

  React.useEffect(() => {
    let cancelled = false
    let charTimer: ReturnType<typeof setTimeout>
    let holdTimer: ReturnType<typeof setTimeout>

    function typeNext(pos: number) {
      if (cancelled) return
      const full = texts[index]
      if (pos <= full.length) {
        setDisplayed(full.slice(0, pos))
        charTimer = setTimeout(() => typeNext(pos + 1), TYPE_SPEED_MS)
      } else {
        holdTimer = setTimeout(() => {
          if (cancelled) return
          setDisplayed("")
          setIndex((i) => (i + 1) % texts.length)
        }, HOLD_MS)
      }
    }

    const startTimer = setTimeout(() => typeNext(0), CYCLE_PAUSE_MS)

    return () => {
      cancelled = true
      clearTimeout(charTimer)
      clearTimeout(holdTimer)
      clearTimeout(startTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return { current: examples[index], displayed }
}

export function Hero() {
  const { current, displayed } = useTypewriterCycle(examples.map((e) => e.text))

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 20 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section className="relative overflow-hidden pb-24 pt-40 sm:pt-48">
      <div className="grid-fade pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[140px]"
        style={{ background: "var(--gold)" }}
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          <Sparkles className="size-3.5 text-gold" />
          Generado por IA · Revisado con criterio legal
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-3xl text-balance font-heading text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Tu reclamación,{" "}
          <span className="text-gradient-gold">redactada como un abogado</span>, en dos minutos
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground"
        >
          Explica tu problema con tus propias palabras. Nuestra IA genera una reclamación
          formal, profesional y lista para enviar frente a aerolíneas, bancos, seguros y más.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#generar"
            className={cn(buttonVariants({ size: "lg" }), "h-12 gap-2 px-7 text-base glow-gold")}
          >
            Genera tu reclamación gratis
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#como-funciona"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 px-7 text-base")}
          >
            Ver cómo funciona
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-xs text-muted-foreground"
        >
          Sin tarjeta de crédito · 1 reclamación gratis al crear tu cuenta
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="relative mx-auto mt-20 max-w-3xl px-6"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="relative mx-auto max-w-md"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="glow-gold glass rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="size-4 text-gold" />
                <span className="text-sm font-medium">Reclamación formal</span>
              </div>
              <motion.span
                key={current.company}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-full bg-gold-muted px-2 py-0.5 text-[10px] font-medium text-gold"
              >
                {current.company}
              </motion.span>
            </div>
            <div className="mt-4 min-h-[132px] text-left text-[13px] leading-relaxed text-foreground/80">
              {displayed}
              <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-gold align-middle" />
            </div>
          </div>

          {examples.map((example, i) => {
            const positions = [
              "left-[-8%] top-[18%]",
              "right-[-10%] top-[8%]",
              "right-[-4%] bottom-[6%]",
              "left-[-4%] bottom-[16%]",
            ]
            const isActive = example.label === current.label
            return (
              <motion.div
                key={example.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: 1,
                  scale: isActive ? 1.08 : 1,
                  y: [0, -8, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.6 + i * 0.15 },
                  scale: { duration: 0.3 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 + i * 0.15 },
                }}
                className={cn(
                  "glass absolute hidden items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium shadow-lg transition-colors duration-300 sm:flex",
                  positions[i],
                  isActive ? "border-gold/60 text-gold" : "border-border text-foreground/80"
                )}
              >
                <example.icon className={cn("size-3.5", isActive ? "text-gold" : "text-muted-foreground")} />
                {example.label}
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}
