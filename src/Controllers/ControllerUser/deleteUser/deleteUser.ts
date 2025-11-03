import { RequestHandler } from "express";
import prisma from "../../../prisma";
import { redisCache } from "../../../shared/redisCacheProvider";



export const deleteUser: RequestHandler = async (req, res) =>{
    try {
        
        const email = req.params?.email;

        if(!email){
            return res.status(400).json({
                message: "Email não foi fornecido!"
            })
        }

        await prisma.user.delete({
            where: { email }
        })

        // Invalida caches relacionados APÓS deletar
        await redisCache.invalidate('cache:users');
        await redisCache.invalidate(`cache:user:${email}`);

        res.status(200).json({
            message: "Usuário excluído com sucesso"
        })

    } catch (error) {
        res.status(500).json({
            message: "Erro ao deletar usuário",
            error
        })
    }
}