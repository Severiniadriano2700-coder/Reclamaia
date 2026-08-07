import { Brain, ShieldCheck, Zap } from "lucide-react"

import { SectionHeading } from "@/components/marketing/section-heading"
import { Reveal } from "@/components/motion/reveal"

const pillars = [
  {
    icon: Brain,
    title: "IA entrenada en derecho de consumo",
    description:
      "Conoce la normativa aplicable a cada sector — aerolíneas, banca, seguros, telecomunicaciones — y la aplica a tu caso concreto.",
  },
  {
    icon: Zap,
    title: "De la idea al documento en segundos",
    description:
      "Cuentas lo que pasó en lenguaje natural. La IA estructura los hechos, los fundamentos y la solicitud por ti.",
  },
  {
    icon: ShieldCheck,
    title: "Formato que las empresas toman en serio",
    description:
      "Un documento con estructura formal se gestiona distinto a un email suelto. Aumenta tus probabilidades de respuesta.",
  },
]

export function Solution() {
  return (
    <section id="solucion" className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="La solución"
          title="Litiga IA hace el trabajo de un asesor legal en el tiempo de un café"
          description="No sustituimos a un abogado en litigios complejos. Resolvemos el 90% de los casos: la reclamación inicial, bien hecha."
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.1}>
              <div className="text-center sm:text-left">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gold-muted text-gold sm:mx-0">
                  <pillar.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
