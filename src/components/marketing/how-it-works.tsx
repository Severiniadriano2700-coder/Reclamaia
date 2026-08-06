import { MessageSquareText, Wand2, PenLine, Send } from "lucide-react"

import { SectionHeading } from "@/components/marketing/section-heading"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"

const steps = [
  {
    icon: MessageSquareText,
    step: "01",
    title: "Cuéntanos tu caso",
    description: "Selecciona la categoría, la empresa y describe lo que pasó con tus propias palabras.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "La IA redacta el documento",
    description: "En segundos genera una reclamación formal con hechos, fundamentos legales y petición clara.",
  },
  {
    icon: PenLine,
    step: "03",
    title: "Revisa y edita",
    description: "Ajusta cualquier detalle en el editor. Tú tienes el control final del documento.",
  },
  {
    icon: Send,
    step: "04",
    title: "Descarga o envía",
    description: "Exporta a PDF, cópialo o envíalo directamente por email desde la plataforma.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="Cómo funciona"
        title="Cuatro pasos. Dos minutos. Un documento profesional."
      />

      <RevealGroup className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block" />
        {steps.map((step) => (
          <RevealItem key={step.step}>
            <div className="relative">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-2xl border border-border bg-background text-gold">
                <step.icon className="size-5" />
              </div>
              <span className="mt-4 block font-heading text-sm font-medium text-gold">
                {step.step}
              </span>
              <h3 className="mt-1 font-heading text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
