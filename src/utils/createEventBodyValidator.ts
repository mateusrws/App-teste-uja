import z from "zod";




export const createEventSchema = z.object({
    title: z.string().min(4),
    description: z.string().max(255).nullable().default(''),
    date: z.date(),
    hour: z.string().time(),
    points: z.number().int().positive().default(0),
    image: z.string().url().nullable(),
    maximumParticipants: z.number().int().positive().default(0),
    address: z.string(),
    city: z.string(),
    state: z.string().nullable(),
    preco: z.number().positive(),
    slug: z.string().nullable(),
    organizerId: z.string()
})