import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpException } from "../src/core/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// ======================
// MOCKS
// ======================
const whereMock = vi.fn();
const returningMock = vi.fn();
vi.mock("../src/core/db.js", () => ({
    db: {
        select: vi.fn(() => ({
            from: vi.fn(() => ({
                where: whereMock,
            })),
        })),
        insert: vi.fn(() => ({
            values: vi.fn(() => ({
                returning: returningMock,
            })),
        })),
    },
}));
vi.mock("bcryptjs", () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn(),
    },
}));
vi.mock("jsonwebtoken", () => ({
    default: {
        sign: vi.fn(),
    },
}));
// IMPORTS APÓS MOCKS
import { AuthService } from "../src/modules/auth/auth.service.js";
import { db } from "../src/core/db.js";
describe("AuthService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe("register", () => {
        it("deve lançar erro 400 se o email já estiver em uso", async () => {
            whereMock.mockResolvedValueOnce([
                {
                    id: "user-123",
                    email: "teste@teste.com",
                },
            ]);
            await expect(AuthService.register("Gabriel", "teste@teste.com", "123456")).rejects.toThrow("Email já está em uso");
            expect(db.insert).not.toHaveBeenCalled();
        });
        it("deve criar usuário com sucesso", async () => {
            whereMock.mockResolvedValueOnce([]);
            bcrypt.hash.mockResolvedValueOnce("hashed-password");
            returningMock.mockResolvedValueOnce([
                {
                    id: "user-123",
                    name: "Gabriel",
                    email: "teste@teste.com",
                },
            ]);
            const result = await AuthService.register("Gabriel", "teste@teste.com", "123456");
            expect(bcrypt.hash).toHaveBeenCalledWith("123456", expect.any(Number));
            expect(db.insert).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                id: "user-123",
                name: "Gabriel",
                email: "teste@teste.com",
            });
        });
    });
    describe("login", () => {
        it("deve lançar erro 401 se usuário não existir", async () => {
            whereMock.mockResolvedValueOnce([]);
            await expect(AuthService.login("inexistente@teste.com", "123456")).rejects.toThrow("Credenciais inválidas");
        });
        it("deve lançar erro 401 se senha estiver incorreta", async () => {
            whereMock.mockResolvedValueOnce([
                {
                    id: "user-123",
                    name: "Gabriel",
                    email: "teste@teste.com",
                    passwordHash: "hashed-password",
                },
            ]);
            bcrypt.compare.mockResolvedValueOnce(false);
            await expect(AuthService.login("teste@teste.com", "senha-errada")).rejects.toThrow("Credenciais inválidas");
            expect(bcrypt.compare).toHaveBeenCalledWith("senha-errada", "hashed-password");
        });
        it("deve retornar token e usuário no login com sucesso", async () => {
            const mockUser = {
                id: "user-123",
                name: "Gabriel",
                email: "teste@teste.com",
                passwordHash: "hashed-password",
            };
            whereMock.mockResolvedValueOnce([mockUser]);
            bcrypt.compare.mockResolvedValueOnce(true);
            jwt.sign.mockReturnValueOnce("fake-jwt-token");
            const result = await AuthService.login("teste@teste.com", "123456");
            expect(jwt.sign).toHaveBeenCalledWith(expect.objectContaining({
                userId: mockUser.id,
                email: mockUser.email,
            }), expect.any(String), expect.any(Object));
            expect(result).toEqual({
                token: "fake-jwt-token",
                user: {
                    id: mockUser.id,
                    name: mockUser.name,
                    email: mockUser.email,
                },
            });
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map