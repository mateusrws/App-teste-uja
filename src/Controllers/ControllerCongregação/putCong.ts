import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";
import { putCongSchema } from "../../utils/putCongSchema";


export const putCong: RequestHandler = async (req, res) => {
    try {
        
        try {
            await putCongSchema.parse(req.body)
        } catch (error) { 
            console.log(error)
            res.status(StatusCodes.NO_CONTENT).json({
                message: 'Dados fal'
            })
        }

        const data = {
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            name: req.body.name
        }

        await prisma.congregacao.update({ where: { id: req.body.id }, data })

        res.status(StatusCodes.OK).json({
            message: 'Dados da congreação alterados com sucesso'
        })
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao alterar dados da congregação"
        })
    }
}