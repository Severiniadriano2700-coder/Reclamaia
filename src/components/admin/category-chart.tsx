"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { categoryLabel } from "@/lib/validations/claim"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  count: {
    label: "Reclamaciones",
    color: "var(--gold)",
  },
} satisfies ChartConfig

export function CategoryChart({ data }: { data: { category: string; count: number }[] }) {
  const formatted = data.map((d) => ({ ...d, label: categoryLabel(d.category) }))

  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <BarChart data={formatted} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" hide />
        <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={140} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
