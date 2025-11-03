
import { RequestHandler } from "express"
import prisma from "../../../prisma";
import { redisCache } from "../../../shared/redisCacheProvider";



export const deleteEvent: RequestHandler = async (req, res) =>{
    try {
        
        const slug = req.params?.slug;

        if(!slug){
            return res.status(400).json({
                message: "Slug não foi fornecido!"
            })
        }

        await prisma.event.delete({
            where: { slug }
        })

        // Invalida caches relacionados APÓS deletar
        await redisCache.invalidate('cache:eventos');
        await redisCache.invalidate(`cache:evento:${slug}`);


        res.status(200).json({
            message: "Evento excluido"
        })

    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}