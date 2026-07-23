import 'dotenv/config'
import { prisma } from '../lib/db.js'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Seeding dummy users...')
  
  const password = await bcrypt.hash('123456', 10)
  
  for (let i = 1; i <= 10; i++) {
    const email = `test${i}@gmail.com`
    const fullName = `test${i}`
    const username = `test${i}`
    
    await prisma.user.upsert({
      where: { email },
      update: { username },
      create: {
        email,
        username,
        fullName,
        password,
        bio: `Hello! I am test user ${i}`,
        phoneNumber: `+123456789${i.toString().padStart(2, '0')}`
      },
    })
  }

  console.log('Seeding finished.')
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
