import { RequestHandler } from "express";
import prisma from "../../../prisma";



export const deleteUser: RequestHandler = async (req, res) =>{
    try {
        
        const email = req.params?.email;

        if(!email){
            return res.status(400).json({
                message: "Email não foi fornecido!"
            })
        }

        await prisma.user.delete({
            where: { email }
        })

        res.status(200).json({
            message: "Evento excluido"
        })

    } catch (error) {
        res.status(500).json({
            message: "Erro ao deletar usuário",
            error
        })
    }
}