import { integer, pgEnum, pgTable, timestamp, uuid, varchar, } from "drizzle-orm/pg-core";
import { users } from "../users/users.schema.js";
import z from "zod";
export const roleEnum = pgEnum("team_role", ["admin", "member", "supervisor"]);
export const teams = pgTable("teams", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
// tabela de associação MUITOS PARA MUITOS
export const teamMembers = pgTable("teams_member", {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
        .notNull()
        .references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    role: roleEnum("role").default("member").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
});
// validacoes
export const addMemberSchema = z.object({
    body: z.object({
        userId: z.uuid("ID de usuário inválido"),
        role: z.enum(["admin", "member", "supervisor"], {
            error: () => ({
                message: "Cargo inválido. Escolha admin, member ou supervisor",
            }),
        }),
    }),
    params: z.object({
        teamId: z.uuid("ID de time inválido"),
    }),
});
//# sourceMappingURL=teams.schema.js.map