import { db } from "../../core/db.js";
import { users } from "./users.schema.js";
import { ilike, or } from "drizzle-orm";

export class UsersService {
  static async searchUsers(query: string) {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(
        or(ilike(users.name, `%${query}%`), ilike(users.email, `%${query}%`)),
      )
      .limit(10);

      return result;
  }
}
