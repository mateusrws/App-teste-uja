import { RequestHandler } from "express";
import prisma from "../../prisma"
import { StatusCodes } from "http-status-codes";
import { redisCache } from "../../shared/redisCacheProvider";
import { JWTService } from "../../services/JWTService";



export const getPass: RequestHandler = async (req, res) => {

    try {
        
        const pass = await prisma.ingresso.findMany();

        await redisCache.save('cache:ingressos', pass, 300);

        return res.status(StatusCodes.OK).json({
            message: "Ingressos encontrados",
            pass
        })

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao buscar ingressos"
        })
        
    }
    
}

export const getPassById: RequestHandler = async (req, res) => {
    try {
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

        const pass = await prisma.ingresso.findUnique({ where: { id: userId } });

        if (!pass) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Ingresso não encontrado"
            });
        }

        if(req.session.userId !== pass.userId){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Não autorizado"
            })
        }

        return res.status(StatusCodes.OK).json({
            message: "Ingresso encontrado",
            pass
        });
    } catch (error) {
        console.error("Erro ao buscar ingresso:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao buscar ingresso"
        });
    }
};
