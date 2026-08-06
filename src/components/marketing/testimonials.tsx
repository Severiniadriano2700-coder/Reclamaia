import { Star } from "lucide-react"

import { SectionHeading } from "@/components/marketing/section-heading"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"

const testimonials = [
  {
    initials: "ML",
    name: "María L.",
    role: "Reclamación a aerolínea",
    quote:
      "Cancelaron mi vuelo y no sabía por dónde empezar. En cinco minutos tenía una reclamación con la normativa citada. Me respondieron en una semana.",
  },
  {
    initials: "JR",
    name: "Javier R.",
    role: "Reclamación bancaria",
    quote:
      "Llevaba meses peleando por una comisión indebida. El documento que generó ReclamaAI sonaba más serio que mi propio email de reclamación.",
  },
  {
    initials: "CS",
    name: "Carla S.",
    role: "Gestoría independiente",
    quote:
      "Uso el plan Business para mis clientes. Ahorro horas cada semana en reclamaciones estándar y puedo centrarme en los casos complejos.",
  },
  {
    initials: "AP",
    name: "Andrés P.",
    role: "Reclamación a seguro",
    quote:
      "Mi aseguradora rechazó un parte sin justificación clara. La reclamación citaba la ley correcta y obtuve respuesta en 10 días.",
  },
]

export function Testimonials() {
  return (
    <section className="border-y border-border bg-secondary/20 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="Testimonios" title="Miles de personas ya reclaman mejor" />

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <RevealItem key={testimonial.name}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-gold-muted text-xs font-semibold text-gold">
                    {testimonial.initials}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
