import { drizzle } from "drizzle-orm/postgres-js";
import { users } from "../modules/users/users.schema.js";
import { teams } from "../modules/teams/teams.schema.js";
import { teamMembers } from "../modules/teams/teams.schema.js";
import "dotenv/config";



export const db = drizzle(process.env.DATABASE_URL!);