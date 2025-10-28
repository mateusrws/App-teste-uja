import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import * as z from "zod";
import prisma from "../../../prisma";
import bcrypt from "bcrypt";

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

export const adolescenteSchema = baseUserSchema.extend({
  type: z.literal("ADOLESCENTE"),
  cpfResponsavel: z.string().min(11).max(14),
  rgResponsavel: z.string().min(5),
  description: z.string().optional(),
});

export const coordenadorSchema = baseUserSchema.extend({
  type: z.literal("COORDENADOR"),
  cpfResponsavel: z.string().nullable().optional(),
  rgResponsavel: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const createUserSchema = z.discriminatedUnion("type", [
  adolescenteSchema,
  coordenadorSchema,
]);

export const createUser: RequestHandler = async (req, res) => {
  try {
    console.log("BODY RECEBIDO:", req.body);

    // 🔹 Ajuste de nomes para bater com o schema do Prisma
    const formattedBody = {
      ...req.body,
      congregacaoId: req.body.congregacao_id ?? req.body.congregacaoId,
      cpfResponsavel: req.body.cpf_resp ?? req.body.cpfResponsavel,
      rgResponsavel: req.body.rg_resp ?? req.body.rgResponsavel,
    };

    // 🔹 Validação
    const validation = createUserSchema.safeParse(formattedBody);
    if (!validation.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Erro de validação dos dados",
        errors: validation.error.issues,
      });
    }

    const data = validation.data;

    // 🔹 Criptografa senha
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // 🔹 Monta objeto para Prisma
    const userDatas = {
      ...data,
      password: hashedPassword,
    };

    // 🔹 Salva no banco
    await prisma.user.create({ data: userDatas });

    return res.status(StatusCodes.CREATED).json({
      message: "Usuário criado com sucesso",
    });
  } catch (error) {
    console.error("ERRO AO CRIAR USUÁRIO:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Ocorreu um erro ao criar o usuário",
      errors: error,
    });
  }
};
