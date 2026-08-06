import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FinalCta() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <div className="grid-fade relative overflow-hidden rounded-3xl border border-border bg-primary px-8 py-16 text-center">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
            style={{ background: "var(--gold)" }}
          />
          <h2 className="relative font-heading text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
            Deja de posponer tu reclamación
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-balance text-primary-foreground/70">
            En el tiempo que tardas en leer esto podrías tener tu reclamación lista para enviar.
          </p>
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "lg" }), "relative mt-8 h-12 gap-2 px-7 text-base glow-gold")}
          >
            Empezar gratis ahora
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
