import type {
  AiGenerationProvider,
  ClaimGenerationInput,
  ClaimAnalysisInput,
  ClaimAnalysis,
  ChatCompletionInput,
  ClaimSummary,
} from "../types"
import { useCaseFaqs } from "@/lib/use-case-faqs"

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "en borrador",
  GENERATING: "generándose",
  GENERATED: "generada",
  EDITED: "editada",
  SENT: "enviada",
  RESOLVED: "resuelta",
  REJECTED: "rechazada",
}

const SECTOR_KEYWORDS: Record<string, string[]> = {
  "Aerolíneas": ["vuelo", "avión", "aerolínea", "aeropuerto", "equipaje", "maleta", "embarque"],
  "Bancos": ["banco", "comisión", "hipoteca", "cuenta bancaria", "tarjeta de crédito", "préstamo"],
  "Amazon y ecommerce": ["amazon", "pedido", "envío", "paquete", "compra online"],
  "Hoteles": ["hotel", "reserva de alojamiento", "booking", "habitación"],
  "Seguros": ["seguro", "aseguradora", "siniestro", "póliza", "indemnización"],
  "Transporte": ["tren", "autobús", "renfe", "billete de tren", "autocar"],
  "Operadoras": ["móvil", "internet", "operadora", "fibra", "línea telefónica", "portabilidad"],
  "Tiendas online": ["tienda online", "devolución", "desistimiento"],
  "Plataformas digitales": ["suscripción", "plataforma", "cuenta bloqueada", "app"],
  "Administraciones públicas": ["ayuntamiento", "multa", "administración", "silencio administrativo", "recurso"],
}

function findMatchingSector(message: string) {
  const lower = message.toLowerCase()
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return sector
  }
  return null
}

function findMatchingClaim(message: string, claims: ClaimSummary[]) {
  const lower = message.toLowerCase()
  return claims.find((c) => c.companyName && lower.includes(c.companyName.toLowerCase()))
}

function buildChatReply(input: ChatCompletionInput): string {
  const lastMessage = input.messages[input.messages.length - 1]?.content ?? ""
  const lower = lastMessage.toLowerCase()

  if (/^(hola|buenas|hey|hi)\b/.test(lower.trim())) {
    return "¡Hola! Soy el asistente de Litiga IA. Puedo ayudarte con dudas sobre tus reclamaciones guardadas o sobre tus derechos como consumidor frente a aerolíneas, bancos, seguros y otros sectores. ¿En qué te ayudo?"
  }

  const matchedClaim = findMatchingClaim(lastMessage, input.claims)
  if (matchedClaim) {
    return `Tu reclamación "${matchedClaim.title}" está actualmente ${STATUS_LABEL[matchedClaim.status] ?? matchedClaim.status.toLowerCase()}. Se creó el ${matchedClaim.createdAt}. Puedes verla y editarla desde tu historial en el panel.`
  }

  if (/(mis reclamaciones|historial|cuántas reclamaciones|cuantas reclamaciones)/.test(lower)) {
    if (input.claims.length === 0) {
      return "Todavía no has generado ninguna reclamación. Puedes crear la primera desde \"Nueva reclamación\" en el panel."
    }
    const list = input.claims
      .slice(0, 5)
      .map((c) => `• ${c.title} — ${STATUS_LABEL[c.status] ?? c.status.toLowerCase()}`)
      .join("\n")
    return `Tienes ${input.claims.length} reclamación(es). Las más recientes:\n${list}`
  }

  const sector = findMatchingSector(lastMessage)
  if (sector) {
    const faqs = useCaseFaqs[sector] ?? []
    const match =
      faqs.find((f) => lower.split(" ").some((word) => word.length > 4 && f.question.toLowerCase().includes(word))) ??
      faqs[0]
    if (match) {
      return `${match.answer}\n\n(Puedes ver más dudas frecuentes sobre "${sector}" en la sección "Casos de uso" de la página principal.)`
    }
  }

  return "Puedo ayudarte con dudas sobre derechos del consumidor (aerolíneas, bancos, seguros, ecommerce, hoteles, transporte, operadoras, administraciones públicas) o sobre el estado de tus reclamaciones guardadas. ¿Puedes darme un poco más de detalle sobre tu caso?"
}

const LEGAL_BASIS: Record<string, string> = {
  AIRLINE:
    "el Reglamento (CE) n.º 261/2004 del Parlamento Europeo y del Consejo, sobre compensación y asistencia a los pasajeros aéreos, así como la Ley 48/1960 de Navegación Aérea",
  BANK:
    "la Orden ETD/699/2020 de transparencia bancaria, la normativa de supervisión del Banco de España y la Ley General para la Defensa de los Consumidores y Usuarios (Real Decreto Legislativo 1/2007)",
  ECOMMERCE:
    "la Ley 3/2014 de Ordenación del Comercio Minorista y el Real Decreto Legislativo 1/2007, Ley General para la Defensa de los Consumidores y Usuarios",
  HOTEL:
    "el Real Decreto Legislativo 1/2007, Ley General para la Defensa de los Consumidores y Usuarios, y la normativa autonómica de establecimientos turísticos",
  INSURANCE:
    "la Ley 50/1980 de Contrato de Seguro y la normativa de supervisión de la Dirección General de Seguros y Fondos de Pensiones",
  TRANSPORT:
    "el Reglamento (UE) n.º 181/2011 sobre los derechos de los viajeros de autobús y autocar, y la Ley General para la Defensa de los Consumidores y Usuarios",
  TELECOM:
    "la Ley General de Telecomunicaciones (Ley 11/2022) y la Carta de Derechos del Usuario de los servicios de comunicaciones electrónicas",
  RETAIL:
    "la Ley 3/2014 de Ordenación del Comercio Minorista y el Real Decreto Legislativo 1/2007, Ley General para la Defensa de los Consumidores y Usuarios",
  PUBLIC_ADMINISTRATION:
    "la Ley 39/2015 del Procedimiento Administrativo Común de las Administraciones Públicas",
  OTHER:
    "el Real Decreto Legislativo 1/2007, Ley General para la Defensa de los Consumidores y Usuarios",
}

function formatToday() {
  return new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
}

function buildDocument(input: ClaimGenerationInput) {
  const claimant = [input.firstName, input.lastName].filter(Boolean).join(" ").trim() || "El/La reclamante"
  const legalBasis = LEGAL_BASIS[input.category] ?? LEGAL_BASIS.OTHER

  const headerLines = [
    `**De:** ${claimant}`,
    input.dni ? `**DNI/NIE:** ${input.dni}` : null,
    input.address ? `**Dirección:** ${input.address}` : null,
    `**Para:** ${input.companyName}`,
    `**Fecha:** ${formatToday()}`,
    `**Referencia / N.º de contrato, reserva o póliza:** ${input.referenceNumber || "No indicada"}`,
    "**Asunto:** Reclamación formal relativa a los hechos descritos a continuación",
  ].filter(Boolean)

  const amountLine = input.claimedAmount
    ? `\n\nEl importe reclamado asciende a ${input.claimedAmount}.`
    : ""

  return `# Reclamación formal

${headerLines.join("\n")}

## Exposición de hechos

Por medio del presente escrito, ${claimant} se dirige a ${input.companyName} con el fin de exponer los siguientes hechos${input.incidentDate ? `, ocurridos el ${input.incidentDate}` : ""}:

${input.description}${amountLine}

Los hechos descritos han supuesto un perjuicio directo para el/la reclamante, que se ha visto obligado/a a iniciar la presente reclamación al no haber obtenido una solución satisfactoria por otras vías.

## Fundamentos de derecho

La presente reclamación se fundamenta, entre otra normativa aplicable, en ${legalBasis}, así como en los principios generales de buena fe contractual y protección al consumidor reconocidos en el ordenamiento jurídico español y de la Unión Europea.

## Solicitud

En virtud de lo anterior, se SOLICITA a ${input.companyName}:

1. Que se dé respuesta motivada a la presente reclamación en el plazo máximo de 15 días hábiles desde su recepción.
2. Que se proceda a: ${input.desiredOutcome}${input.claimedAmount ? ` (importe reclamado: ${input.claimedAmount})` : ""}
3. Que se confirme por escrito la resolución adoptada al respecto.

## Despedida

Quedando a la espera de una pronta y favorable respuesta, se advierte que, de no obtener contestación satisfactoria en el plazo indicado, el/la reclamante se reserva el derecho a acudir a las vías que el ordenamiento jurídico reconoce, incluyendo el arbitraje de consumo, la denuncia ante el organismo regulador competente o la vía judicial.

Atentamente,

**Firma:**
${claimant}
${
  input.improvementNotes?.length
    ? `\n## Información adicional incorporada\n\n${input.improvementNotes.map((n) => `- ${n}`).join("\n")}\n`
    : ""
}
---
*Este documento ha sido generado como plantilla de ayuda por Litiga IA y no constituye asesoramiento legal vinculante. Se recomienda revisión antes de su envío.*`
}

const ATTACHMENT_PATTERN = /\b(adjunto|correo|email|captura|factura|justificante|documento adjunto)\b/i

function heuristicAnalysis(input: ClaimAnalysisInput): ClaimAnalysis {
  const strengths: string[] = []
  const improvements: string[] = []

  if (input.firstName && input.lastName) strengths.push("Identificación completa del reclamante.")
  if (input.description.trim().length > 40) strengths.push("Hechos claros y bien descritos.")
  if (input.desiredOutcome.trim().length > 15) strengths.push("Solicitud específica.")
  strengths.push("Buena fundamentación legal aplicada al caso.")

  if (!input.referenceNumber?.trim()) {
    improvements.push("Falta el número de reserva, contrato o póliza del caso.")
  }
  if (!ATTACHMENT_PATTERN.test(`${input.description} ${input.desiredOutcome}`)) {
    improvements.push("Sería recomendable adjuntar documentación de respaldo (email, factura o captura).")
  } else {
    strengths.push("Documentación de respaldo mencionada.")
  }
  if (!input.claimedAmount?.trim()) {
    improvements.push("Indicar el importe exacto reclamado aumentaría la precisión.")
  }

  const score = Math.max(55, 100 - improvements.length * 6)

  return { score, strengths: strengths.slice(0, 4), improvements: improvements.slice(0, 4) }
}

export class MockProvider implements AiGenerationProvider {
  readonly id = "mock" as const
  readonly model = "litigaia-demo-v1"

  async *generate(input: ClaimGenerationInput) {
    const document = buildDocument(input)
    const chunks = document.match(/[\s\S]{1,6}/g) ?? [document]

    for (const chunk of chunks) {
      await new Promise((resolve) => setTimeout(resolve, 12))
      yield chunk
    }
  }

  async analyze(input: ClaimAnalysisInput): Promise<ClaimAnalysis> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return heuristicAnalysis(input)
  }

  async *chat(input: ChatCompletionInput) {
    const reply = buildChatReply(input)
    const chunks = reply.match(/[\s\S]{1,4}/g) ?? [reply]

    for (const chunk of chunks) {
      await new Promise((resolve) => setTimeout(resolve, 10))
      yield chunk
    }
  }
}
