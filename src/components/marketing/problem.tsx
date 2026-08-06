import { Clock, FileQuestion, MessageSquareOff, ScrollText } from "lucide-react"

import { SectionHeading } from "@/components/marketing/section-heading"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"

const problems = [
  {
    icon: Clock,
    title: "Horas escribiendo un email que nadie lee",
    description: "Redactas, borras, vuelves a empezar. Al final envías algo que suena a queja, no a reclamación.",
  },
  {
    icon: ScrollText,
    title: "No conoces la normativa que te ampara",
    description: "El Reglamento 261/2004, la LGDCU, la Ley de Contrato de Seguro… nadie te lo explicó en el colegio.",
  },
  {
    icon: MessageSquareOff,
    title: "Las empresas ignoran reclamaciones informales",
    description: "Un email mal estructurado se archiva sin respuesta. Uno formal y bien fundamentado, no.",
  },
  {
    icon: FileQuestion,
    title: "Un abogado te cobra por algo que puede automatizarse",
    description: "Pagar 150€ por una carta de reclamación estándar no tiene sentido en 2026.",
  },
]

export function Problem() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="El problema"
        title="Reclamar tus derechos no debería ser tan difícil"
        description="Cada año millones de consumidores renuncian a reclamaciones legítimas simplemente porque no saben cómo redactarlas."
      />

      <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
        {problems.map((problem) => (
          <RevealItem key={problem.title}>
            <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-gold/40">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors group-hover:bg-gold-muted group-hover:text-gold">
                <problem.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold tracking-tight">
                {problem.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
