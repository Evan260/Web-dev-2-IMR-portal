import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

dotenv.config();

const prisma = new PrismaClient();
async function main() {
  // Check if admin already exists
  const adminExists = await prisma.user.findUnique({
    where: {
      email: "admin@imr.com",
    },
  });

  if (!adminExists) {
    // Create admin user
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@imr.com",
        password: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
      },
    });
    console.log("Admin user created successfully");
  } else {
    console.log("Admin user already exists");
  }
}