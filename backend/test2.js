import "dotenv/config";
import jwt from "jsonwebtoken";
import prisma from "./src/db.js";

async function test() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found");
      return;
    }
    const token = jwt.sign({ userId: user.id }, "secretkey", { expiresIn: "7d" });
    console.log("Token:", token);
    
    // Now trigger the controller function directly to see if prisma.post exists!
    console.log("prisma.post exists?", !!prisma.post);
    if(prisma.post) {
       console.log("Testing create...");
       try {
         const p = await prisma.post.create({
            data: { title: "Test", content: "Test", type: "NOTE", userId: user.id }
         });
         console.log("Created post successfully:", p.id);
       } catch(e) {
         console.log("Create error:", e);
       }
    }
  } catch(e) {
    console.error(e);
  }
}
test();
