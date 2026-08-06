"use client"

import * as React from "react"
import Link from "next/link"
import {
  Plane,
  Landmark,
  ShoppingCart,
  Building2,
  ShieldCheck,
  Bus,
  Smartphone,
  Store,
  Globe2,
  Building,
  ArrowRight,
} from "lucide-react"

import { useCaseFaqs } from "@/lib/use-case-faqs"
import { SectionHeading } from "@/components/marketing/section-heading"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const useCases = [
  { icon: Plane, label: "Aerolíneas" },
  { icon: Landmark, label: "Bancos" },
  { icon: ShoppingCart, label: "Amazon y ecommerce" },
  { icon: Building2, label: "Hoteles" },
  { icon: ShieldCheck, label: "Seguros" },
  { icon: Bus, label: "Transporte" },
  { icon: Smartphone, label: "Operadoras" },
  { icon: Store, label: "Tiendas online" },
  { icon: Globe2, label: "Plataformas digitales" },
  { icon: Building, label: "Administraciones públicas" },
]

export function UseCases() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="Casos de uso"
        title="Reclama frente a quien haga falta"
        description="ReclamaAI conoce los sectores donde más reclamaciones se pierden por falta de tiempo o conocimiento legal. Pulsa en cada uno para ver las dudas más habituales."
      />

      <RevealGroup className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {useCases.map((useCase) => (
          <RevealItem key={useCase.label}>
            <Dialog>
              <DialogTrigger
                render={
                  <button
                    type="button"
                    className="group flex w-full flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-6 text-center transition-colors hover:border-gold/40"
                  />
                }
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-gold transition-colors group-hover:bg-gold-muted">
                  <useCase.icon className="size-5" />
                </span>
                <span className="text-sm font-medium">{useCase.label}</span>
                <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  Ver dudas frecuentes
                </span>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-gold-muted text-gold">
                      <useCase.icon className="size-4" />
                    </span>
                    <DialogTitle>{useCase.label}</DialogTitle>
                  </div>
                  <DialogDescription>
                    Las 10 dudas más frecuentes de usuarios que han reclamado frente a este sector.
                  </DialogDescription>
                </DialogHeader>

                <Accordion className="mt-2 w-full">
                  {(useCaseFaqs[useCase.label] ?? []).map((faq, i) => (
                    <AccordionItem key={faq.question} value={`${useCase.label}-${i}`}>
                      <AccordionTrigger className="text-left text-sm font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <Button className="mt-2 w-full gap-2 glow-gold" nativeButton={false} render={<Link href="#generar" />}>
                  Generar mi reclamación
                  <ArrowRight className="size-4" />
                </Button>
              </DialogContent>
            </Dialog>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
