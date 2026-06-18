export declare class AuthService {
    static register(name: string, email: string, passwordPlain: string): Promise<{
        id: string;
        name: string;
        email: string;
    } | undefined>;
    static login(email: string, passwordPlain: string): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map