export declare class AuthService {
    static register(name: string, email: string, passwordPlain: string): Promise<{
        id: string;
        name: string;
        email: string;
    } | undefined>;
    static login(email: string, passwordPlain: string): Promise<{
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    static refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    static logout(refreshToken: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map