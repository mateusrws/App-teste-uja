import { RequestHandler } from "express";
import prisma from "../../prisma";
import { User } from "../../generated/prisma";
import { compare  } from 'bcrypt'



export const Login: RequestHandler = async (req, res) => {

    try {
        
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
            return res.status(200).json({
                message: "Login realizado com sucesso",
                user: User
            });
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