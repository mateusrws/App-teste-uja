import * as z from 'zod'

export const createCongSchema = z.object({
    address: z.string().default('R. Assembleia de Deus, 92 - Laranjal'),
    city: z.string().default('Volta Redonda'),
    state: z.string().default('RJ'),
    name: z.string().default('sede')
}) 

