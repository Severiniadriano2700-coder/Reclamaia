import Link from "next/link"
import { Check } from "lucide-react"

import { plans } from "@/lib/plans"
import { SectionHeading } from "@/components/marketing/section-heading"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Pricing() {
  return (
    <section id="precios" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="Precios"
        title="Un plan para cada forma de reclamar"
        description="Empieza gratis. Cambia o cancela tu plan cuando quieras, sin permanencia."
      />

      <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <RevealItem key={plan.id}>
            <div
              className={cn(
                "relative flex h-full flex-col rounded-2xl border p-7",
                plan.highlighted
                  ? "glow-gold border-gold/50 bg-card"
                  : "border-border bg-card"
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground">
                  Más popular
                </span>
              )}
              <h3 className="font-heading text-lg font-semibold tracking-tight">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-semibold tracking-tight">
                  {plan.price === 0 ? "Gratis" : `${plan.price}€`}
                </span>
                {plan.price > 0 && <span className="text-sm text-muted-foreground">/{plan.interval}</span>}
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-gold" />
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn("mt-8 h-11 w-full", plan.highlighted && "glow-gold")}
                variant={plan.highlighted ? "default" : "outline"}
                nativeButton={false}
                render={<Link href={plan.id === "FREE" ? "/register" : `/register?plan=${plan.id}`} />}
              >
                {plan.id === "FREE" ? "Empezar gratis" : `Elegir ${plan.name}`}
              </Button>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
