import "dotenv/config";
import prisma from './src/db.js';

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log("Success! Found users:", users.length);
  } catch (err) {
    console.error("Database connection error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
