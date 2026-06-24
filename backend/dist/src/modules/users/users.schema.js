import { integer, pgTable, timestamp, uuid, varchar, } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    availableHours: integer("available_hours").notNull().default(40),
    refreshTokenHash: varchar("refresh_token_hash", { length: 255 }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
//# sourceMappingURL=users.schema.js.map