import { RequestHandler } from "express";
import * as jwt from 'jsonwebtoken'
import prisma from "../prisma";
import { StatusCodes } from "http-status-codes";



export const ensureCoord: RequestHandler = async (req, res, next) => {

    const { authorization } = req.headers
    const [type, token] = (authorization || '').split(' ');
    const decode = jwt.decode(token)
    const id = (decode as { id: string }).id;
    
    const userCoord = await prisma.user.findUnique({ where: { id } })

    if(!userCoord){
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado'})
    }else if(userCoord.type === "ADOLESCENTE"){
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado'})
    }

    next()
} 