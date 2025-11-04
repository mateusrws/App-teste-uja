import { StatusCodes } from 'http-status-codes';
import { RequestHandler } from "express";
import prisma from '../../prisma';
import { JWTService } from '../../services/JWTService';




export const deletePass: RequestHandler = async (req, res) => {
    try {

        const id = req.params.id

        if(!id){
            return res.status(StatusCodes.NO_CONTENT).json({
                message: "ID do ingresso não fornecido"
            })
        }

        let userId: string | undefined = req.session.userId;
        
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
        
        const user = await prisma.user.findUnique({where: { id }})

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Usuário não identificado"
            });
        }

        const pass = await prisma.ingresso.findFirst({
            where: { id, userId },
        });

        if (!pass) {
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