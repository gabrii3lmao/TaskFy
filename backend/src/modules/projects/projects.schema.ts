import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { teams } from "../teams/teams.schema.js";
import { users } from "../users/users.schema.js";
import z from "zod";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  deadline: timestamp("deadline", { withTimezone: true }).notNull(),
  teamId: uuid("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  supervisorId: uuid("supervisor_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// validation
export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3, "O título deve ter no mínimo 3 caracteres"),
    description: z
      .string()
      .min(10, "A descrição deve ter no mínimo 10 caracteres"),
    deadline: z.coerce.date({
      error: () => ({ message: "Data limite inválida" }),
    }),
    teamId: z.uuid("ID da equipe inválido"),
    supervisorId: z.uuid("ID do supervisor inválido"),
  }),
});
