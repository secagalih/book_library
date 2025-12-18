import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
  } catch (error) {
    console.error('❌ Failed to connect to database: ' + error.message  , error);
    process.exit(1);
  }
}


const disconnectDB = async () => {
  await prisma.$disconnect();
}

export { connectDB, disconnectDB, prisma };