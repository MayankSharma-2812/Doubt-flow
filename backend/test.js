import "dotenv/config";
import prisma from "./src/db.js";

async function test() {
  console.log(Object.keys(prisma));
  console.log(!!prisma.post);
}

test();
