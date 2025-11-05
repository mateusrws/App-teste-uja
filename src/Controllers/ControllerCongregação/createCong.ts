import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { createCongSchema } from "../../utils/createCongSchema";
import * as z from 'zod'
import prisma from "../../prisma";



export const createCong:RequestHandler = async (req,res) => {
    try {
        try {
            await createCongSchema.parse(req.body)
        } catch (error) {
            if(error instanceof z.ZodError){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: 'Erro na validação de campos'
                })
            }
        }

        await prisma.congregacao.create(req.body)

        res.status(StatusCodes.OK).json({
            message: "Congregação cadastrada com sucesso!"
        })


    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao cadastrar congregação"
        })
    }
}
