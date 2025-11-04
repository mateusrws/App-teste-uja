import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { createIngressoSchema } from "../../utils/ingressoSchema";
import prisma from "../../prisma";
import { JWTService } from "../../services/JWTService";



export const createPass: RequestHandler = async (req, res) =>{
    try {
        
        const validation = createIngressoSchema.safeParse(req.body);

        if(!validation.success){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Erro de validação dos dados",
                errors: validation.error.issues,
            })
        }

        const data = validation.data;

        // Valida autorização: usuário só pode criar ingresso para si mesmo (ou usar req.id se disponível)
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

        // Se userId foi identificado, garante que o ingresso pertence ao usuário
        if (userId && data.userId !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: "Não autorizado"
            });
        }

        const ingresso = await prisma.ingresso.create({ data });

        return res.status(StatusCodes.CREATED).json({
            message: "Ingresso criado com sucesso",
            id: ingresso.id
        });
    } catch (error) {
        console.error("Erro ao criar ingresso:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao criar ingresso"
        });
    }
}