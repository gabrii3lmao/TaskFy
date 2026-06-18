export * from "../modules/users/users.schema.js";
export * from "../modules/teams/teams.schema.js";
export * from "../modules/projects/projects.schema.js";
export * from "../modules/tasks/tasks.schema.js";
export * from "../modules/notifications/notifications.schema.js";
import "dotenv/config";
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<Record<string, never>> & {
    $client: import("postgres").Sql<{}>;
};
//# sourceMappingURL=db.d.ts.map