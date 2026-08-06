"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, FileCheck2, Plane, Landmark, ShieldCheck } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const floatingBadges = [
  { icon: Plane, label: "Vuelo cancelado", className: "left-[-8%] top-[18%]", delay: 0.6 },
  { icon: Landmark, label: "Comisión bancaria", className: "right-[-10%] top-[8%]", delay: 0.8 },
  { icon: ShieldCheck, label: "Seguro rechazado", className: "right-[-4%] bottom-[6%]", delay: 1 },
]

export function Hero() {
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
      >
        <div className="relative mx-auto max-w-md">
          <div className="glow-gold glass rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="size-4 text-gold" />
                <span className="text-sm font-medium">Reclamación formal</span>
              </div>
              <span className="rounded-full bg-gold-muted px-2 py-0.5 text-[10px] font-medium text-gold">
                Generada
              </span>
            </div>
            <div className="mt-4 space-y-2.5">
              <div className="h-2.5 w-3/4 rounded-full bg-muted" />
              <div className="h-2.5 w-full rounded-full bg-muted" />
              <div className="h-2.5 w-5/6 rounded-full bg-muted" />
              <div className="h-2.5 w-2/3 rounded-full bg-muted" />
              <div className="mt-4 h-2.5 w-1/2 rounded-full bg-gold-muted" />
              <div className="h-2.5 w-4/5 rounded-full bg-muted" />
              <div className="h-2.5 w-3/5 rounded-full bg-muted" />
            </div>
          </div>

          {floatingBadges.map(({ icon: Icon, label, className, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.5, delay },
                scale: { duration: 0.5, delay },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
              }}
              className={`glass absolute hidden items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium shadow-lg sm:flex ${className}`}
            >
              <Icon className="size-3.5 text-gold" />
              {label}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
