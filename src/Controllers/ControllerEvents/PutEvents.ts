import { RequestHandler } from "express";
import * as yup from 'yup';
import db from "../../knex";


const bodyValidationPut = yup.object({
    title: yup.string().optional(),
    description: yup.string().optional(),
    date: yup.date().optional(),
    hour: yup.string().optional(),
    points: yup.number().optional(),
    image: yup.string().url().optional(),
    address: yup.string().optional(),
    city: yup.string().optional(),
    maximumParticipants: yup.number().optional(),
    preco: yup.number().optional(),
    state: yup.string().optional(),
    slug: yup.string().required(),
    organizerId: yup.string().optional()
})


export const createBodyValidator: RequestHandler = async (req,res, next) =>{
    try {
        await bodyValidationPut.validate(req.body, { abortEarly: false })
        return next();
    } catch (err) {
        const yupError = err as yup.ValidationError
        const errors: Record<string, string> = {}

        yupError.inner.forEach( error => {
            if(!error.path)return;
            errors[error.path] = error.message
        })

        res.json({
            default: yupError.message
        }).status(400)
    }
}



export const putEvent: RequestHandler = async (req,res) => {
    try {
        await db('events').where({ slug: req.body.slug }).update(req.body)


        res.status(200).json({
            message: "Evento alterado com sucesso"
        })
    } catch (error) {
        res.json({message: "Erro ao alterar evento", error})
    } 
}