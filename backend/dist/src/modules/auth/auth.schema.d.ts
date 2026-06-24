import z from "zod";
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
export declare const refreshSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodString;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
//# sourceMappingURL=auth.schema.d.ts.map