const { PrismaClient } = require('@prisma/client');

// Create a new Prisma client instance
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    // Test the connection
    await prisma.$connect();
    console.log('Successfully connected to the database');
    
    // Run a simple query
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Query result:', result);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();