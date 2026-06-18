import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../core/db.js";
import { users } from "../users/users.schema.js";
import { eq } from "drizzle-orm";
import { HttpException } from "../../core/errorHandler.js";
export class AuthService {
    static async register(name, email, passwordPlain) {
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email));
        if (existingUser.length > 0) {
            throw new HttpException("Email já está em uso", 400);
        }
        const passwordHash = await bcrypt.hash(passwordPlain, 10);
        const [newUser] = await db
            .insert(users)
            .values({
            name,
            email,
            passwordHash,
        })
            .returning({ id: users.id, name: users.name, email: users.email });
        return newUser;
    }
    static async login(email, passwordPlain) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user) {
            throw new HttpException("Credenciais inválidas", 401);
        }
        const isValidPassword = await bcrypt.compare(passwordPlain, user.passwordHash);
        if (!isValidPassword) {
            throw new HttpException("Credenciais inválidas", 401);
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return { token, user: { id: user.id, name: user.name, email: user.email } };
    }
}
//# sourceMappingURL=auth.service.js.map