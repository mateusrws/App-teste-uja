import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";




export const ensureIsLogged: RequestHandler = async (req, res, next) => {

    if(!req.session?.isLogged){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Usuário não está logado"
        })
    }

    next()
    
}