
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";


export const ensureAuthenticate: RequestHandler = async (req, res, next) => {
    
    const { authorization } = req.headers

    if(!authorization){
        res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { message: "Não autenticado"}
        })
    }

    

    
    return next();
}