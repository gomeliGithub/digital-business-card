import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

const nodeEnvironment: string = process.env.NODE_ENV ?? 'development';

if ( nodeEnvironment === 'production' ) config({ path: "config/.env.production" });
else config({ path: "config/.env.development" });

export default defineConfig ({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: nodeEnvironment === 'production' ? "node dist/prisma/seed.js" : "tsx src/prisma/seed.ts"
    },
    datasource: {
        url: env("DATABASE_URL")
    }
});