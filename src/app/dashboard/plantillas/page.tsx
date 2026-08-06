import { TemplatesList } from "@/components/dashboard/templates-list"

export default function PlantillasPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Plantillas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Guarda textos reutilizables para agilizar futuras reclamaciones.
        </p>
      </div>
      <TemplatesList />
    </div>
  )
}
