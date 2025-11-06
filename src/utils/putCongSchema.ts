import * as z from 'zod'


export const putCongSchema = z.object({
    id: z.string(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    name: z.string().optional()
})