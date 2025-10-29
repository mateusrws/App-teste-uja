import z from 'zod'
import { adolescenteSchema } from './adolescenteSchema';
import { coordenadorSchema } from './coordenadoSchema';

export const createUserSchema = z.discriminatedUnion("type", [
    adolescenteSchema,
    coordenadorSchema,
]);