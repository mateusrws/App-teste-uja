import { RequestHandler } from "express";
import prisma from "../../prisma";
import { User } from "../../generated/prisma";
import { compare  } from 'bcrypt'
import { JWTService } from "../../services/JWTService";
import { StatusCodes } from "http-status-codes";
import { getUserById } from "../ControllerUser/getUser/getUser";
import { redisCache } from "../../shared/redisCacheProvider";



export const Login: RequestHandler = async (req, res) => {

    try {
        
        if(req.session.isLogged){
            return res.status(400).json({
                message: "Usuário já está logado"
            })
        }

        const { email, password, } = req.body

        if(!email || !password){
            return res.status(400).json({
                message:  "Email ou senha faltando"
            })
        }

        const User: User | null = await prisma.user.findFirst({ where: { email } })

        if(!User){
            return res.status(400).json({
                message: "Não existe nenhum usuário com este email"
            })
        }

        if (await compare(password, User.password)) {
            
            const accessToken = JWTService.sign({ uid: User.id } )

            if(accessToken == 'JWT_SECRET_NOT_FOUND'){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: 'Erro ao gerar token de acesso'
                })
            }

            req.session.userId = User.id;
            req.session.email = User.email;
            req.session.isLogged = true;

            
            const user = await getUserById(req, res, () => {});
            if(user){
                await redisCache.save(`cache:user:${User.id}`, user, 300);
                return res.status(200).json({
                    message: "Login realizado com sucesso",
                    accessToken
                });
            }
        } else {
            return res.status(401).json({
                message: "Senha incorreta"
            });
        }

    } catch (error) {
        res.status(500).json({
            message:  "Erro ao fazer login",
            error: error
        })
    }

}