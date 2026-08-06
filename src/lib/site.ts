export const siteConfig = {
  name: "ReclamaAI",
  tagline: "Reclamaciones legales profesionales en menos de dos minutos",
  description:
    "ReclamaAI usa inteligencia artificial para redactar reclamaciones legales profesionales frente a aerolíneas, bancos, seguros, hoteles y grandes plataformas. Explica tu caso, la IA genera el documento, tú lo envías.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://reclama-ai.com",
  ogImage: "/og-image.png",
  keywords: [
    "reclamación legal IA",
    "reclamar aerolínea",
    "reclamación bancaria",
    "carta de reclamación profesional",
    "generador de reclamaciones",
    "reclamar Amazon",
    "reclamar seguro",
    "IA legal",
  ],
  links: {
    twitter: "https://twitter.com/reclamaai",
    linkedin: "https://linkedin.com/company/reclamaai",
  },
  supportEmail: "soporte@reclama-ai.com",
} as const

export type SiteConfig = typeof siteConfig
