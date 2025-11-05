import { RequestHandler } from "express";
import prisma from "../../../prisma";
import { redisCache } from "../../../shared/redisCacheProvider";
import { createEventSchema } from "../../../utils/createEventBodyValidator";
import { StatusCodes } from "http-status-codes";

export const putEvent: RequestHandler = async (req, res) => {
  try {
    if (!req.body.slug || req.body.slug === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Slug não foi fornecido",
      });
    }

    // Valida dados antes de atualizar
    const updateSchema = createEventSchema.partial();
    const validation = updateSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Erro de validação dos dados"
      });
    }

    const event = await prisma.event.findUnique({ where: { slug: req.body.slug } });
    if(!event){
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Evento não encontrado",
      });
    }

    if(event.organizerId !== req.session.userId){
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Não autorizado",
      });
    }

    await prisma.event.update({
      where: { slug: req.body.slug },
      data: {
        ...validation.data,
        organizerId: event.organizerId,
    },
  });

    // Invalida caches relacionados APÓS atualizar
    await redisCache.invalidate('cache:eventos');
    await redisCache.invalidate(`cache:evento:${req.body.slug}`);

    return res.status(StatusCodes.OK).json({
      message: "Evento alterado com sucesso"
    });
    
  } catch (error) {
    console.error("Erro ao alterar evento:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erro ao alterar evento"
    });
  }
};
