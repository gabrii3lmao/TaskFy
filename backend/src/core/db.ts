import { drizzle } from "drizzle-orm/postgres-js";
export * from "../modules/users/users.schema.js";
export * from "../modules/teams/teams.schema.js";
export * from "../modules/projects/projects.schema.js";
export * from "../modules/tasks/tasks.schema.js";
import "dotenv/config";



export const db = drizzle(process.env.DATABASE_URL!);