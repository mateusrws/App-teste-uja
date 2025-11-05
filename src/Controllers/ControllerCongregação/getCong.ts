import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";



export const getCongs: RequestHandler = async (req, res) =>{
    try {
        
        const congs = await prisma.congregacao.findMany()


        res.status(StatusCodes.OK).json({
            message: "Congregações encontradas",
            congs
        })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao responder a requisição'
        })
    }
}


export const getCongById: RequestHandler = async (req, res) => {
    try {
        
        const { id }  = req.body

        const cong = await prisma.congregacao.findFirst({ where: { id }})

        res.status(StatusCodes.OK).json({
            message: 'Congregação encontrada',
            cong
        })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao responder a requisição'
        })
    }
}


export const getCongByUserLoggedId: RequestHandler = async (req, res) => {
    try {
        
        const cong = await prisma.congregacao.findFirst({
            where: {
              members: {
                some: {
                  id: req.session.userId,
                },
              },
            },
        });
          
        res.status(StatusCodes.OK).json({
            message: 'Congregação encontrada', 
            cong
        })  

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao responder a requisição'
        })
    }
}

