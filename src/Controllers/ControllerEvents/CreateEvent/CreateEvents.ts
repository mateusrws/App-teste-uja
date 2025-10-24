import { Request, Response } from "express";
import prisma from "../../../prisma";
import { z } from "zod";

// ✅ Schema de validação Zod
export const createEventSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  date: z.string(),
  hour: z.string(),
  points: z.number(),
  address: z.string(),
  city: z.string(),
  preco: z.number(),
  maximumParticipants: z.number().optional(),
  organizerId: z.string().optional(),
});

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

    // 💾 Criação no banco (mockado no teste)
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

    return res.status(201).json({
      message: "Evento criado com sucesso",
      status: 201,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};
