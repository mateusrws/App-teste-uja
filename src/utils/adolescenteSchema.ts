import z from 'zod'
import { baseUserSchema } from './baseUserSchema';


export const adolescenteSchema = baseUserSchema.extend({
    type: z.literal("ADOLESCENTE"),
    cpfResponsavel: z.string().min(11).max(14),
    rgResponsavel: z.string().min(5),
    description: z.string().optional(),
  });
  