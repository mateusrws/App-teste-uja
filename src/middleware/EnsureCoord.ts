import { RequestHandler } from "express";
import prisma from "../prisma";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services/JWTService";

export const ensureCoord: RequestHandler = async (req, res, next) => {
    // Tenta usar req.id se já estiver disponível (do middleware ensureAuthenticate)
    let userId: string | undefined = req.id;

    // Se não tiver req.id, tenta extrair do JWT
    if (!userId) {
        const { authorization } = req.headers;
        
        if (!authorization) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ 
                message: 'Token de autorização não fornecido' 
            });
        }

        const [type, token] = authorization.split(' ');
        if (type !== "Bearer" || !token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ 
                message: 'Formato de token inválido' 
            });
        }

        const decoded = JWTService.verify(token);
        if (decoded === "INVALID_TOKEN" || decoded === "JWT_SECRET_NOT_FOUND") {
            return res.status(StatusCodes.UNAUTHORIZED).json({ 
                message: 'Token inválido' 
            });
        }

        if (typeof decoded === "string") {
            return res.status(StatusCodes.UNAUTHORIZED).json({ 
                message: 'Token inválido' 
            });
        }

        userId = decoded.uid;
    }

    if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ 
            message: 'Usuário não identificado' 
        });
    }

    const userCoord = await prisma.user.findUnique({ where: { id: userId } });

    if (!userCoord) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ 
            message: 'Não autorizado' 
        });
    }

    if (userCoord.type === "ADOLESCENTE") {
        return res.status(StatusCodes.FORBIDDEN).json({ 
            message: 'Apenas coordenadores podem realizar esta ação' 
        });
    }

    next();
}; 