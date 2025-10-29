import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../../prisma";
import bcrypt from "bcrypt";
import { createUserSchema } from "../../../utils/createUserSchema";


export const createUser: RequestHandler = async (req, res) => {
  try {
    console.log("BODY RECEBIDO:", req.body);

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
