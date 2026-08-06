import { AnimatedCounter } from "@/components/marketing/animated-counter"
import { Reveal } from "@/components/motion/reveal"

const stats = [
  { value: 48000, suffix: "+", label: "Reclamaciones generadas" },
  { value: 92, suffix: "%", label: "Tasa de respuesta de empresas" },
  { value: 2, suffix: " min", label: "Tiempo medio de generación" },
  { value: 150, prefix: "€", suffix: "+", label: "Ahorrados frente a un abogado" },
]

export function Stats() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-16 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="text-center">
            <p className="font-heading text-3xl font-semibold tracking-tight text-gold sm:text-4xl">
              <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
