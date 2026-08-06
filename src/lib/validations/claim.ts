import { z } from "zod"

export const claimCategories = [
  { value: "AIRLINE", label: "Aerolínea" },
  { value: "BANK", label: "Banco" },
  { value: "ECOMMERCE", label: "Tienda online" },
  { value: "HOTEL", label: "Hotel / Alojamiento" },
  { value: "INSURANCE", label: "Seguro" },
  { value: "TRANSPORT", label: "Transporte" },
  { value: "TELECOM", label: "Operadora" },
  { value: "RETAIL", label: "Comercio" },
  { value: "PUBLIC_ADMINISTRATION", label: "Administración pública" },
  { value: "OTHER", label: "Otro" },
] as const

export const claimCategoryValues = claimCategories.map((c) => c.value) as [
  (typeof claimCategories)[number]["value"],
  ...(typeof claimCategories)[number]["value"][],
]

export const generateClaimSchema = z.object({
  category: z.enum(claimCategoryValues),
  companyName: z.string().min(2, "Indica el nombre de la empresa").max(120),
  incidentDate: z.string().optional(),
  description: z.string().min(30, "Cuéntanos un poco más de lo ocurrido (mínimo 30 caracteres)").max(4000),
  desiredOutcome: z.string().min(10, "Indica qué resultado esperas (mínimo 10 caracteres)").max(1000),
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  dni: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
  referenceNumber: z.string().max(80).optional(),
  claimedAmount: z.string().max(40).optional(),
  improvementNotes: z.array(z.string()).max(6).optional(),
})

export type GenerateClaimInput = z.infer<typeof generateClaimSchema>

export function categoryLabel(value: string) {
  return claimCategories.find((c) => c.value === value)?.label ?? value
}
