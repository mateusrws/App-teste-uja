import { RequestHandler } from "express";
import prisma from "../../../prisma";
import { redisCache } from "../../../shared/redisCacheProvider";

export const getEvents: RequestHandler = async (req, res) => {
  try {
    // Verifica se existe cache antes de buscar no banco
    const cached = await redisCache.recover('cache:eventos');
    
    if (cached) {
      return res.status(200).json({
        message: "Eventos encontrados com sucesso (cache)",
        events: cached,
      });
    }

    // Se não tem cache, busca no banco
    const events = await prisma.event.findMany();

    // Salva no cache para próxima requisição (TTL de 10 minutos)
    await redisCache.save('cache:eventos', events, 600);

    res.status(200).json({
      message: "Eventos encontrados com sucesso",
      events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar eventos",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getEventsBySlug: RequestHandler = async (req, res) => {
    try {
      const slug = req.params?.slug; 
  
      if (!slug) {
        return res.status(400).json({
          message: "Parâmetros faltando"
        });
      }

      // Verifica cache para evento específico
      const cacheKey = `cache:evento:${slug}`;
      const cached = await redisCache.recover(cacheKey);
      
      if (cached) {
        return res.status(200).json({
          message: "Evento encontrado com sucesso (cache)",
          data: cached,
        });
      }
  
      // Se não tem cache, busca no banco
      const event = await prisma.event.findUnique({ where: { slug } });
  
      if (!event) {
        return res.status(404).json({
          message: "Evento não encontrado",
          data: null
        });
      }

      // Salva no cache (TTL de 5 minutos para eventos individuais)
      await redisCache.save(cacheKey, event, 300);
  
      return res.status(200).json({
        message: "Evento encontrado com sucesso",
        data: event,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao buscar evento",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
  