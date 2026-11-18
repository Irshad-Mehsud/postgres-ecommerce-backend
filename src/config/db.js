import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("✅ PostgreSQL connected");
    } catch (error) {
        console.error("PostgreSQL connection failed:", error.message);
        process.exit(1);
    }
};

export { prisma };
export default connectDB;