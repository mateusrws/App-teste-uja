import { Request, RequestHandler, Response } from "express";
import Event from "../types/typeEnvent";
import * as yup from 'yup'

// model Event {
//     id                  String     @id @default(uuid())
//     title               String
//     description         String?
//     slug                String     @unique
//     maximumParticipants Int?       @map("maximum_participants")
//     date                DateTime
//     hour                String
//     points              Int
//     image               String?
//     address             String
//     city                String
//     preco               Float?
//     state               String?
//     organizerId         String?
//     user                User?      @relation("UserEvents", fields: [organizerId], references: [id])
//     ingressos           Ingresso[] @relation("IngressosEvents")

//     createdAt DateTime @default(now())
//     isActive  Boolean  @default(true)

//     @@map("events")
// }

const bodyValidation: yup.ObjectSchema<Event> = yup
            .object({
                title: yup.string().required(),
                description: yup.string().optional(),
                date: yup.date().required(),
                hour: yup.string().required(),
                points: yup.number().required(),
                image: yup.string().url().optional(),
                address: yup.string().required(),
                city: yup.string().required(),
                maximumParticipants: yup.number().optional(),
                preco: yup.number().optional(),
                state: yup.string().optional()
            })
            .required()

export const createBodyValidator: RequestHandler = async (req,res, next) =>{
    try {
        await bodyValidation.validate(req.body, { abortEarly: false })
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


export const createEvent = async (req: Request, res: Response) => {
         try {

            
            

            const event: Event = req.body;
            
            res.send(event).status(201)
        } catch (error) {
            res.status(400).send(error);
        }
        
        
    }