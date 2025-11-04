import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { redisCache } from "../../shared/redisCacheProvider";
import prisma from "../../prisma";
import { JWTService } from "../../services/JWTService";
import { z } from "zod";

export const putPass: RequestHandler = async (req, res) => {
    try {
        const { id, ...data } = req.body;

        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "ID do ingresso não foi fornecido",
            });
        }

        let userId: string | undefined = req.id;
        
        if (!userId) {
            const { authorization } = req.headers;
            if (!authorization) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Token de autorização não fornecido",
                });
            }

            const [type, token] = authorization.split(" ");
            if (type !== "Bearer" || !token) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Formato de token inválido",
                });
            }

            const decoded = JWTService.verify(token);
            if (decoded === "INVALID_TOKEN" || decoded === "JWT_SECRET_NOT_FOUND") {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Token inválido",
                });
            }

            userId = typeof decoded === "string" ? undefined : decoded.uid;
        }

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Usuário não identificado",
            });
        }

        const passExist = await prisma.ingresso.findFirst({
            where: { id, userId },
        });

        if (!passExist) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Ingresso não encontrado ou você não tem permissão para alterá-lo",
            });
        }

        // Valida dados antes de atualizar (não permite alterar userId)
        const updateSchema = z.object({
            price: z.number().positive().optional(),
            eventId: z.string().uuid().optional(),
            isUsed: z.boolean().optional(),
        }).strict();
        
        const validation = updateSchema.safeParse(data);
        if (!validation.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Erro de validação dos dados",
                errors: validation.error.issues,
            });
        }

        const updated = await prisma.ingresso.update({
            where: { id },
            data: validation.data,
        });

        await redisCache.invalidate("cache:ingresso");
        await redisCache.invalidate(`cache:ingresso:${id}`);

        return res.status(StatusCodes.OK).json({
            message: "Ingresso alterado com sucesso",
            pass: updated,
        });

    } catch (error) {
        console.error("Erro ao alterar ingresso:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao alterar ingresso"
        });
    }
};