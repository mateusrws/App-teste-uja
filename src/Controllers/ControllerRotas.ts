import { Request, Response } from "express";

export default {
    async raiz( req: Request, res: Response){
        const data = {message: "Teste"}

        res.json(data).status(200)
    },
    async teste(req: Request, res: Response){
        res.json({
            message: "Teste funcionou"
        }).status(200);
    }
}