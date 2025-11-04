import { StatusCodes } from 'http-status-codes';
import { RequestHandler } from "express";
import prisma from '../../prisma';
import { JWTService } from '../../services/JWTService';




export const deletePass: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'ID não foi enviado'
            });
        }

        // Valida UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'ID inválido'
            });
        }

        // Obtém userId do req.id (sessão) ou do JWT
        let userId: string | undefined = req.id;
        
        if (!userId) {
            const { authorization } = req.headers;
            if (authorization) {
                const [type, token] = authorization.split(" ");
                if (type === "Bearer" && token) {
                    const decoded = JWTService.verify(token);
                    if (decoded !== "INVALID_TOKEN" && decoded !== "JWT_SECRET_NOT_FOUND" && typeof decoded !== "string") {
                        userId = decoded.uid;
                    }
                }
            }
        }

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Usuário não identificado"
            });
        }

        // Verifica se o ingresso existe e pertence ao usuário
        const passExist = await prisma.ingresso.findFirst({
            where: { id, userId },
        });

        if (!passExist) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Ingresso não encontrado ou você não tem permissão para deletá-lo"
            });
        }

        await prisma.ingresso.delete({ where: { id } });

        return res.status(StatusCodes.OK).json({
            message: "Ingresso deletado com sucesso"
        });

    } catch (error) {
        console.error("Erro ao deletar ingresso:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao deletar ingresso'
        });
    }
};