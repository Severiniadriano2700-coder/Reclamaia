import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error("Uso: npx tsx scripts/promote-admin.ts usuario@email.com")
    process.exit(1)
  }

  const user = await db.user.update({
    where: { email },
    data: { role: "ADMIN" },
  })
  console.log(`${user.email} promovido a ADMIN`)
}

main().finally(() => db.$disconnect())
