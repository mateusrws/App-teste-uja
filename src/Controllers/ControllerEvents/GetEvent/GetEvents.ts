import { RequestHandler } from "express";
import prisma from "../../../prisma";

export const getEvents: RequestHandler = async (req, res) => {
  try {
    const events = await prisma.event.findMany();

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
  
      const event = await prisma.event.findUnique({ where: { slug } });
  
      if (!event) {
        return res.status(404).json({
          message: "Evento não encontrado",
          data: null
        });
      }
  
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
  