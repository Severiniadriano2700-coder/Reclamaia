import { Check, FileDown, History, LayoutTemplate, Mail, ShieldCheck } from "lucide-react"

import { SectionHeading } from "@/components/marketing/section-heading"
import { Reveal } from "@/components/motion/reveal"

const checklist = [
  "Redacción con estructura y lenguaje jurídico formal",
  "Fundamentos legales adaptados a cada sector",
  "Editor completo para ajustar cualquier detalle",
  "Historial ilimitado de todas tus reclamaciones",
  "Sin permanencia, cancela cuando quieras",
]

const features = [
  { icon: FileDown, label: "Exporta a PDF con un clic" },
  { icon: Mail, label: "Envío directo por email" },
  { icon: LayoutTemplate, label: "Plantillas guardadas y favoritas" },
  { icon: History, label: "Historial y seguimiento de estado" },
  { icon: ShieldCheck, label: "Datos cifrados y privados" },
]

export function Benefits() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Beneficios"
            align="left"
            title="Todo lo que necesitas para reclamar como un profesional"
            className="max-w-none"
          />

          <ul className="mt-8 space-y-3">
            {checklist.map((item, i) => (
              <Reveal key={item} delay={i * 0.05} as="div">
                <li className="flex items-start gap-3 text-sm text-foreground/90">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-muted text-gold">
                    <Check className="size-3" />
                  </span>
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1}>
          <div className="glow-gold rounded-2xl border border-border bg-card p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3.5"
                >
                  <feature.icon className="size-4 shrink-0 text-gold" />
                  <span className="text-sm font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
