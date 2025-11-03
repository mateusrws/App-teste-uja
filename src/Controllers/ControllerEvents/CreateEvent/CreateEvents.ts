import { Request, Response } from "express";
import prisma from "../../../prisma";
import { z } from "zod";
import { createEventSchema } from "../../../utils/createEventBodyValidator";
import { redisCache } from "../../../shared/redisCacheProvider";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    try {
      createEventSchema.parse(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Erro de validação nos campos",
          issues: error.issues, 
        });
      }
    }

    await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        slug: event.slug,
        date: new Date(event.date),
        hour: event.hour,
        points: event.points,
        address: event.address,
        city: event.city,
        preco: event.preco,
        maximumParticipants: event.maximumParticipants,
        organizerId: event.organizerId,
      },
    });

    // Invalida caches relacionados APÓS criar com sucesso
    await redisCache.invalidate('cache:eventos');
    await redisCache.invalidate(`cache:evento:${event.slug}`);

    return res.status(201).json({
      message: "Evento criado com sucesso",
      status: 201,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};
