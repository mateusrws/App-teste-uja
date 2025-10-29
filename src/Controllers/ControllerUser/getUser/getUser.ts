import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../../prisma";


export const getUsers: RequestHandler = async (req,res) => {
    try {
        
        const users = await prisma.user.findMany()

        res.status(StatusCodes.ACCEPTED).json({ message: "Usuarios encontrados", users})

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Ocorreu um erro ao procurar usuário" , error})
    }
}

export const getUserByEmail: RequestHandler = async (req, res) =>{
    try {
        
        const { email } = req.body

        const user = await prisma.user.findUnique({ where: {email}})

        res.status(StatusCodes.ACCEPTED).json({ message: "Usuário encontrado", user})

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Ocorreu um erro ao procurar usuário", error})
    }
}