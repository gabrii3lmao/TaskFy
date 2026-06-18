import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "../users/users.schema.js";
import { tasks } from "../tasks/tasks.schema.js";
import { projects } from "../projects/projects.schema.js";
import { z } from "zod";

export const notificationTypeEnum = pgEnum("notification_type", [
  "task_completed",
  "delay_report",
  "deadline_approaching",
  "task_assigned",
  "project_assigned",
  "system",
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  taskId: uuid("task_id").references(() => tasks.id, {
    onDelete: "set null",
  }),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
