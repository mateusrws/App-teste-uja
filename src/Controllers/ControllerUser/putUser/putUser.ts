import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../../prisma";
import { redisCache } from "../../../shared/redisCacheProvider";



export const putUser: RequestHandler = async (req, res) => {
    try {
        if (!req.body.email || req.body.email === undefined) {
          return res.status(StatusCodes.NO_CONTENT).json({
            message: "Email não foi fornecido",
          });
        }
    
        await prisma.user.update({
          where: { email: req.body.email },
          data: req.body,
        });

        // Invalida caches relacionados APÓS atualizar
        await redisCache.invalidate('cache:users');
        await redisCache.invalidate(`cache:user:${req.body.email}`);
    
        return res.status(200).json({
          message: "Usuário alterado com sucesso"
        });
        
      } catch (error) {
        return res.status(500).json({
          message: "Erro ao alterar usuário",
          error,
        });
      }

}