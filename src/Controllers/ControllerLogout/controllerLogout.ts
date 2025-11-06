import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';


export const Logout: RequestHandler = async (req, res) => {
    try {
        req.session.destroy((e) => {
            if(e){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: 'Erro ao fazer logout',
                    error: e
                })
            }
        })

        res.clearCookie(req.sessionID);
        req.session.destroy((e) => {
            if(e){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: 'Erro ao destruir sessão'
                })
            }
        })

        res.status(StatusCodes.OK).json({
            message: 'Logout realizado com sucesso'
        })
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:  "Erro ao fazer logout",
            error: error
        })
    }

}