import { RequestHandler } from "express";
import prisma from "../../../prisma";
import { redisCache } from "../../../shared/redisCacheProvider";

export const putEvent: RequestHandler = async (req, res) => {
  try {
    if (!req.body.slug || req.body.slug === undefined) {
      return res.status(400).json({
        message: "Slug não foi fornecido",
      });
    }

    const updated = await prisma.event.update({
      where: { slug: req.body.slug },
      data: req.body,
    });

    // Invalida caches relacionados APÓS atualizar
    await redisCache.invalidate('cache:eventos');
    await redisCache.invalidate(`cache:evento:${req.body.slug}`);

    return res.status(200).json({
      message: "Evento alterado com sucesso",
      event: updated,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao alterar evento",
      error,
    });
  }
};
