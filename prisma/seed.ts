import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create mock clients
  const mockClients = [
    { id: 'mock-client-1', name: 'Mock Client 1' },
    { id: 'mock-client-2', name: 'Mock Client 2' },
  ]

  for (const client of mockClients) {
    // Create user for client first (required by schema)
    const user = await prisma.user.upsert({
      where: { email: `${client.id}@example.com` },
      update: {},
      create: {
        id: client.id, // Use same ID for easier reference
        email: `${client.id}@example.com`,
        name: client.name,
        role: 'CLIENT',
      },
    })

    // Create or update client
    await prisma.client.upsert({
      where: { id: client.id },
      update: {
        name: client.name,
      },
      create: {
        id: client.id,
        name: client.name,
        userId: user.id,
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
