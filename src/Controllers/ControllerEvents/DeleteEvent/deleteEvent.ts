
import { RequestHandler } from "express"
import prisma from "../../../prisma";



export const deleteEvent: RequestHandler = async (req, res) =>{
    try {
        
        const slug = req.params?.slug;

        if(!slug){
            return res.status(400).json({
                message: "Slug não foi fornecido!"
            })
        }

        await prisma.event.delete({
            where: { slug }
        })

        res.status(200).json({
            message: "Evento excluido"
        })

    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}