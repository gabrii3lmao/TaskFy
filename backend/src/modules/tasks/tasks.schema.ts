import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  type AnyPgColumn,
  check,
  primaryKey,
} from "drizzle-orm/pg-core";
import { projects } from "../projects/projects.schema.js";
import { users } from "../users/users.schema.js";
import { sql } from "drizzle-orm";

export const tasksStatusEnum = pgEnum("task_status", [
  "not_started",
  "in_progress",
  "completed",
]);

export const deadlineStatusEnum = pgEnum("deadline_status", [
  "on_time",
  "delayed",
  "ahead",
]);

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  parentTaskId: uuid("parent_task_id").references((): AnyPgColumn => tasks.id, {
    onDelete: "cascade",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  deadline: timestamp("deadline", { withTimezone: true }).notNull(),
  status: tasksStatusEnum("status").default("not_started").notNull(),
  deadlineStatus: deadlineStatusEnum("deadline_status")
    .default("on_time")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const taskAssignees = pgTable(
  "task_assignees",
  {
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.userId] }),
  }),
);

export const timeLogs = pgTable(
  "time_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    startTime: timestamp("start_time").defaultNow().notNull(),
    endTime: timestamp("end_time"),
  },
  (table) => {
    return {
      endTimeAfterStartTime: check(
        "end_time_after_start_time",
        sql`${table.endTime} > ${table.startTime}`,
      ),
    };
  },
);

// validacoes

import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, "O título deve ter no mínimo 3 caracteres"),
    description: z.string().optional(),
    deadline: z.coerce.date({
      error: () => ({ message: "Data limite inválida" }),
    }),
    projectId: z.string().uuid("ID do projeto inválido"),
    parentTaskId: z.string().uuid("ID da tarefa pai inválido").optional(),
    assigneeIds: z
      .array(z.string().uuid("ID de encarregado inválido"))
      .default([]),
  }),
});
