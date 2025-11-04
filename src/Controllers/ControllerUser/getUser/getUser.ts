import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../../prisma";
import { redisCache } from "../../../shared/redisCacheProvider";


export const getUsers: RequestHandler = async (req,res) => {
    try {
        // Verifica se existe cache antes de buscar no banco
        const cached = await redisCache.recover('cache:users');
        
        if (cached) {
            return res.status(StatusCodes.ACCEPTED).json({ 
                message: "Usuarios encontrados (cache)", 
                users: cached 
            });
        }

        // Se não tem cache, busca no banco
        const users = await prisma.user.findMany();

        // Salva no cache (TTL de 5 minutos)
        await redisCache.save('cache:users', users, 300);

        res.status(StatusCodes.ACCEPTED).json({ 
            message: "Usuarios encontrados", 
            users 
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ 
            message: "Ocorreu um erro ao procurar usuário"
        });
    }
}

export const getUserById: RequestHandler = async (req, res) => {
    try {
        const { slug } = req.params || req.body; 

        if (!slug) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "ID não fornecido"
            });
        }

        
        const cacheKey = `cache:user:${slug}`;
        const cached = await redisCache.recover(cacheKey);

        if (cached) {
            return res.status(StatusCodes.ACCEPTED).json({
                message: "Usuário encontrado (cache)",
                user: cached
            });
        }

       
        const user = await prisma.user.findUnique({ where: { id: slug } });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Usuário não encontrado"
            });
        }

        await redisCache.save(cacheKey, user, 300);

        res.status(StatusCodes.ACCEPTED).json({
            message: "Usuário encontrado",
            user
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: "Ocorreu um erro ao procurar usuário"
        });
    }
}
