import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create test user for cypress tests
  const testUser = await prisma.user.upsert({
    where: {
      email: 'test@example.com',
    },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
    },
  })

  console.log('Seeded test user:', testUser)

  // Create default Company Profit Margin rate if it doesn't exist
  const profitMarginRate = await prisma.rate.upsert({
    where: {
      name: 'Company Profit Margin',
    },
    update: {
      is_system: true, // Ensure existing rate is marked as system
    },
    create: {
      name: 'Company Profit Margin',
      description: 'Default profit margin applied to all jobs',
      value: 20.00, // 20% default profit margin
      is_system: true,
    },
  })

  console.log('Seeded profit margin rate:', profitMarginRate)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
