import { PrismaClient, ClaimCategory } from "@prisma/client"

const db = new PrismaClient()

const companies: { name: string; slug: string; category: ClaimCategory }[] = [
  { name: "Iberia", slug: "iberia", category: "AIRLINE" },
  { name: "Ryanair", slug: "ryanair", category: "AIRLINE" },
  { name: "Vueling", slug: "vueling", category: "AIRLINE" },
  { name: "easyJet", slug: "easyjet", category: "AIRLINE" },
  { name: "Air Europa", slug: "air-europa", category: "AIRLINE" },
  { name: "Banco Santander", slug: "banco-santander", category: "BANK" },
  { name: "BBVA", slug: "bbva", category: "BANK" },
  { name: "CaixaBank", slug: "caixabank", category: "BANK" },
  { name: "ING", slug: "ing", category: "BANK" },
  { name: "Amazon", slug: "amazon", category: "ECOMMERCE" },
  { name: "AliExpress", slug: "aliexpress", category: "ECOMMERCE" },
  { name: "El Corte Inglés", slug: "el-corte-ingles", category: "ECOMMERCE" },
  { name: "Booking.com", slug: "booking", category: "HOTEL" },
  { name: "Airbnb", slug: "airbnb", category: "HOTEL" },
  { name: "Mapfre", slug: "mapfre", category: "INSURANCE" },
  { name: "Mutua Madrileña", slug: "mutua-madrilena", category: "INSURANCE" },
  { name: "AXA", slug: "axa", category: "INSURANCE" },
  { name: "Renfe", slug: "renfe", category: "TRANSPORT" },
  { name: "ALSA", slug: "alsa", category: "TRANSPORT" },
  { name: "Movistar", slug: "movistar", category: "TELECOM" },
  { name: "Vodafone", slug: "vodafone", category: "TELECOM" },
  { name: "Orange", slug: "orange", category: "TELECOM" },
  { name: "MásMóvil", slug: "masmovil", category: "TELECOM" },
]

async function main() {
  for (const company of companies) {
    await db.company.upsert({
      where: { slug: company.slug },
      update: {},
      create: company,
    })
  }
  console.log(`Seeded ${companies.length} companies.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
