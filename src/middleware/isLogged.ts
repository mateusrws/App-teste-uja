import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export const isLogged: RequestHandler = (req, res, next) => {

    if(!req.session.isLogged){
        return res.status(StatusCodes.LOCKED).json({
            message: "Não autorizado"
        })
    }
    next();
}