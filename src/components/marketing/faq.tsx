import { SectionHeading } from "@/components/marketing/section-heading"
import { Reveal } from "@/components/motion/reveal"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "¿ReclamaAI sustituye a un abogado?",
    answer:
      "No. ReclamaAI genera una reclamación extrajudicial profesional para el primer contacto formal con la empresa. Para litigios complejos o procedimientos judiciales, recomendamos asesoramiento legal especializado.",
  },
  {
    question: "¿Es legalmente válido el documento generado?",
    answer:
      "El documento sigue una estructura formal de reclamación extrajudicial habitual en derecho de consumo español. No es un dictamen legal vinculante, pero es válido para iniciar el proceso de reclamación ante cualquier empresa u organismo.",
  },
  {
    question: "¿Qué pasa si la empresa no responde?",
    answer:
      "Puedes escalar tu reclamación a arbitraje de consumo, a la autoridad reguladora correspondiente (AESA, Banco de España, DGSFP...) o a la vía judicial. El propio documento incluye esta advertencia.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "Sí. Tus datos se almacenan cifrados y nunca se comparten con terceros sin tu consentimiento. Puedes eliminar tu cuenta y todos tus datos en cualquier momento desde el panel.",
  },
  {
    question: "¿Puedo cancelar mi suscripción cuando quiera?",
    answer:
      "Sí, no hay permanencia. Puedes cancelar tu plan en cualquier momento desde el panel de facturación y seguirás teniendo acceso hasta el final del periodo pagado.",
  },
  {
    question: "¿Qué modelos de IA utiliza ReclamaAI?",
    answer:
      "Utilizamos modelos de lenguaje de última generación optimizados para redacción jurídica en español, con revisión continua de la calidad de los documentos generados.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <SectionHeading eyebrow="Preguntas frecuentes" title="Todo lo que necesitas saber" />

      <Reveal delay={0.1}>
        <Accordion className="mt-14 w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.question} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  )
}
