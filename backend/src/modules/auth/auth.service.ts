import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../core/db.js";
import { users } from "../users/users.schema.js";
import { eq } from "drizzle-orm";
import { HttpException } from "../../core/errorHandler.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export class AuthService {
  static async register(name: string, email: string, passwordPlain: string) {
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

  static async login(email: string, passwordPlain: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      throw new HttpException("Credenciais inválidas", 401);
    }

    const isValidPassword = await bcrypt.compare(
      passwordPlain,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new HttpException("Credenciais inválidas", 401);
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = crypto.randomUUID();
    const refreshHash = hashToken(refreshToken);

    await db
      .update(users)
      .set({
        refreshTokenHash: refreshHash,
        refreshTokenExpiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
      })
      .where(eq(users.id, user.id));

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  static async refresh(refreshToken: string) {
    const hash = hashToken(refreshToken);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.refreshTokenHash, hash));

    if (!user) {
      throw new HttpException("Refresh token inválido", 401);
    }

    if (
      !user.refreshTokenExpiresAt ||
      new Date(user.refreshTokenExpiresAt) < new Date()
    ) {
      throw new HttpException("Refresh token expirado", 401);
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const newRefreshToken = crypto.randomUUID();
    const newRefreshHash = hashToken(newRefreshToken);

    await db
      .update(users)
      .set({
        refreshTokenHash: newRefreshHash,
        refreshTokenExpiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
      })
      .where(eq(users.id, user.id));

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  static async logout(refreshToken: string) {
    const hash = hashToken(refreshToken);

    await db
      .update(users)
      .set({
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      })
      .where(eq(users.refreshTokenHash, hash));

    return { message: "Logout realizado com sucesso." };
  }
}
