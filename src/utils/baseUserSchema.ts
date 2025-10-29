import z from 'zod'


export const userTypeEnum = z.enum(["ADOLESCENTE", "COORDENADOR"]);

export const baseUserSchema = z.object({
  name: z.string().min(1),
  dateBorn: z.coerce.date(),
  cpf: z.string().min(11).max(14),
  rg: z.string().min(5),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  lvl: z.number().min(0).max(1).default(0),
  email: z.string().email(),
  phone: z.string(),
  password: z.string().min(6),
  profileImage: z.string().nullable().optional(),
  congregacaoId: z.string().uuid(),
  points: z.number().int().min(0).default(0),
  type: userTypeEnum,
});



