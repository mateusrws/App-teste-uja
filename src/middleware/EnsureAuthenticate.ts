import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services/JWTService";

declare module 'express-session'{
  interface SessionData {
    userId: string, 
    email: string,
    isLogged: boolean
  }
}

export const ensureAuthenticate: RequestHandler = async (req, res, next) => {

  if(req.session?.isLogged && req.session?.userId){
    req.id = req.session.userId;
    req.email = req.session.email;
    return next();
  }



    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { message: "Não autenticado" },
      });
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Tipo de token inválido",
      });
    }

    const jwtData = JWTService.verify(token);

    if (jwtData === "JWT_SECRET_NOT_FOUND") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erro interno ao verificar o token",
      });
    }

    if (jwtData === "INVALID_TOKEN") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Token inválido",
      });
    }

    // Define req.id e req.email quando autentica via JWT
    if (typeof jwtData !== "string") {
      req.id = jwtData.uid;
    }

    return next();
  };
