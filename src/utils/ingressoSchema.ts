import z from "zod";

export const ingressoSchema = z.object({
  id: z.string().uuid(),
  price: z.number().positive(),
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
  isUsed: z.boolean().default(false),
});

export const createIngressoSchema = z.object({
  price: z.number().positive(),
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

