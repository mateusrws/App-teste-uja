
import { RequestHandler } from "express"
import prisma from "../../../prisma";
import { redisCache } from "../../../shared/redisCacheProvider";
import { UserType } from "../../../generated/prisma";
import { StatusCodes } from "http-status-codes";


export const deleteEvent: RequestHandler = async (req, res) =>{
    try {

        const { slug } = req.params;
        if(!slug){
            return res.status(400).json({
                message: "ID do evento não foi fornecido!"
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

        


        const user = await prisma.user.findUnique({ where: { id: req.session.userId } });

        if(user?.type !== UserType.COORDENADOR){
            return res.status(403).json({
                message: "Você não tem permissão para deletar eventos"
            })
        }

        const event = await prisma.event.findUnique({ where: { slug } });
        if(!event){
            return res.status(404).json({
                message: "Evento não encontrado"
            })
        }

        if(event.organizerId !== userId){
            return res.status(403).json({
                message: "Você não tem permissão para deletar este evento"
            })
        }
        
        // Invalida caches relacionados APÓS deletar
        await redisCache.invalidate('cache:eventos');
        await redisCache.invalidate(`cache:evento:${slug}`);

        await prisma.event.delete({ where: { organizerId: userId } })


        res.status(200).json({
            message: "Evento excluido"
        })

    } catch (error) {
        res.status(500).json({
            message: 'Erro ao deletar evento'
        })
    }
}