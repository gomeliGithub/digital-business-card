import { defineConfig } from "prisma/config";

const nodeEnvironment: string = process.env.NODE_ENV ?? 'development';

if ( !process.env.DATABASE_URL ) {
    try {
        const { config } = await import("dotenv");

        config({ 
            path: nodeEnvironment === "production" ? "config/.env.production" : "config/.env.development" 
        });
    } catch { }
}

export default defineConfig ({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: nodeEnvironment === 'production' ? "node dist/prisma/seed.js" : "tsx src/prisma/seed.ts"
    },
    datasource: {
        url: process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder",
    }
});