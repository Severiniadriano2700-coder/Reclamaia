export type PlanId = "FREE" | "PRO" | "BUSINESS"

export interface PlanDefinition {
  id: PlanId
  name: string
  description: string
  price: number
  interval: "mes"
  /** FREE: lifetime claims included before pay-per-claim kicks in. PRO/BUSINESS: claims per calendar month. */
  claimsPerMonth: number | "unlimited"
  chatMessagesPerMonth: number | "unlimited"
  priceId?: string
  features: string[]
  highlighted?: boolean
}

/** Every plan beyond FREE's lifetime allowance is billed per additional claim at this price. */
export const PAY_PER_CLAIM_PRICE_EUR = 3.5
export const PAY_PER_CLAIM_PRICE_CENTS = Math.round(PAY_PER_CLAIM_PRICE_EUR * 100)
export const PAY_PER_CLAIM_CHAT_MESSAGES = 5
export const FREE_LIFETIME_CLAIMS = 1

export const plans: PlanDefinition[] = [
  {
    id: "FREE",
    name: "Gratis",
    description: "Prueba ReclamaAI sin compromiso.",
    price: 0,
    interval: "mes",
    claimsPerMonth: FREE_LIFETIME_CLAIMS,
    chatMessagesPerMonth: 0,
    features: [
      "1 reclamación gratis (de por vida)",
      "Descarga en PDF",
      "Editor de documentos",
      `A partir de la 2ª: ${PAY_PER_CLAIM_PRICE_EUR.toFixed(2).replace(".", ",")}€ por reclamación`,
      `${PAY_PER_CLAIM_CHAT_MESSAGES} mensajes del asistente incluidos por reclamación comprada`,
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    description: "Para quien reclama en serio.",
    price: 9,
    interval: "mes",
    claimsPerMonth: 20,
    chatMessagesPerMonth: 100,
    priceId: process.env.STRIPE_PRICE_PRO,
    highlighted: true,
    features: [
      "20 reclamaciones al mes",
      "Envío directo por email",
      "Plantillas guardadas",
      "Historial ilimitado",
      "100 mensajes al mes con el asistente",
      "Soporte prioritario",
    ],
  },
  {
    id: "BUSINESS",
    name: "Business",
    description: "Para gestorías y equipos legales.",
    price: 29,
    interval: "mes",
    claimsPerMonth: "unlimited",
    chatMessagesPerMonth: "unlimited",
    priceId: process.env.STRIPE_PRICE_BUSINESS,
    features: [
      "Reclamaciones ilimitadas",
      "Multiusuario",
      "Marca blanca en PDF",
      "API de integración",
      "Asistente de IA sin límite de mensajes",
      "Gestor de cuenta dedicado",
    ],
  },
]

export function getPlan(id: PlanId) {
  return plans.find((plan) => plan.id === id) ?? plans[0]
}

export function getPlanByPriceId(priceId: string | null | undefined) {
  if (!priceId) return undefined
  return plans.find((plan) => plan.priceId === priceId)
}
