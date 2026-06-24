import z from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.email("Formato inválido de email").toLowerCase(),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Formato inválido de email"),
    password: z.string().min(1, "A senha é obrigatória"),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token é obrigatório"),
  }),
});
