import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

// Function to connect to the postgres database
export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('Database Connected Successfully');
    } catch (error) {
        console.error("Database connection failed!");
        console.error(error);
    }
}