import { RequestHandler } from "express";

export const ifCreateAdolescente: RequestHandler = (req,res,next) => {
    if(req.body.type === "ADOLESCENTE"){
        next()
    }
}