import { ZodError } from "zod";
import { HttpException } from "../core/errorHandler.js";
export const validate = (schema) => async (req, res, next) => {
    try {
        const parsed = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        req.body = parsed.body;
        return next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join(", ");
            return next(new HttpException(`Erro de validação: ${errorMessages}`, 400));
        }
        return next(error);
    }
};
//# sourceMappingURL=validationMiddleware.js.map