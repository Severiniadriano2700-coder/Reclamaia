import { Check, Minus, X } from "lucide-react"

import { SectionHeading } from "@/components/marketing/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

type Cell = "yes" | "no" | "partial" | string

const rows: { label: string; manual: Cell; lawyer: Cell; litigaia: Cell }[] = [
  { label: "Tiempo necesario", manual: "2-4 horas", lawyer: "1-2 semanas", litigaia: "2 minutos" },
  { label: "Coste", manual: "Gratis (tu tiempo)", lawyer: "80€ - 300€", litigaia: "Desde 0€" },
  { label: "Estructura legal formal", manual: "no", lawyer: "yes", litigaia: "yes" },
  { label: "Normativa aplicable citada", manual: "partial", lawyer: "yes", litigaia: "yes" },
  { label: "Editable al instante", manual: "yes", lawyer: "no", litigaia: "yes" },
  { label: "Disponible 24/7", manual: "yes", lawyer: "no", litigaia: "yes" },
]

function CellValue({ value }: { value: Cell }) {
  if (value === "yes") return <Check className="mx-auto size-4 text-gold" />
  if (value === "no") return <X className="mx-auto size-4 text-muted-foreground/50" />
  if (value === "partial") return <Minus className="mx-auto size-4 text-muted-foreground" />
  return <span className="text-sm">{value}</span>
}

export function Comparison() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading
        eyebrow="La comparativa"
        title="Hazlo tú mismo, paga a un abogado, o hazlo bien en dos minutos"
      />

      <Reveal delay={0.1}>
        <div className="mt-14 overflow-hidden rounded-2xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/50">
                <th className="p-4 text-left font-medium text-muted-foreground">Criterio</th>
                <th className="p-4 text-center font-medium text-muted-foreground">Manual</th>
                <th className="p-4 text-center font-medium text-muted-foreground">Abogado</th>
                <th className={cn("p-4 text-center font-heading font-semibold text-gold")}>Litiga IA</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-card" : "bg-background"}>
                  <td className="p-4 font-medium">{row.label}</td>
                  <td className="p-4 text-center text-muted-foreground">
                    <CellValue value={row.manual} />
                  </td>
                  <td className="p-4 text-center text-muted-foreground">
                    <CellValue value={row.lawyer} />
                  </td>
                  <td className="bg-gold-muted/40 p-4 text-center font-medium">
                    <CellValue value={row.litigaia} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  )
}
