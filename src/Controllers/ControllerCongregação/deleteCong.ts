import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";



export const deleteCong: RequestHandler = async (req, res) => {
    try {
        
        const { id } = req.body

        await prisma.congregacao.delete({where: {id}})

        res.status(StatusCodes.OK).json({
            message: 'Congregação deletada com sucesso'
        })
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao deletar o congregação'
        })
    }
}