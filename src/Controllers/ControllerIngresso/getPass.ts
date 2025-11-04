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
        let id = req.params;
        const { authorization } = req.headers

        if (!id) {
            if(!req.session.userId){
                const [type, token] = authorization.split(" ");
                if (type === "Bearer" && token) {
                    const decoded = JWTService.verify(token);
                    if (decoded !== "INVALID_TOKEN" && decoded !== "JWT_SECRET_NOT_FOUND" && typeof decoded !== "string") {
                        id = decoded.uid;
                    }
                }
            }
            let id = req.session.userId
        }

        const pass = await prisma.ingresso.findUnique({ where: { id } });

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
