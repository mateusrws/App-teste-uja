import z from 'zod'
import { baseUserSchema } from './baseUserSchema';


export const coordenadorSchema = baseUserSchema.extend({
    type: z.literal("COORDENADOR"),
    cpfResponsavel: z.string().nullable().optional(),
    rgResponsavel: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
  });