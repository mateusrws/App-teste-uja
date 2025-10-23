import { Request, Response } from "express";
import Event from "../../../types/typeEnvent";
import db from "../../../knex";
import { createBodyValidation } from "../../../utils/createEventBodyValidator";


export const createEvent = async (req: Request, res: Response) => {
        try {
            const event: Event = req.body;

            // Validando dados

            const validator = createBodyValidation(event);

            if(validator == "Campos obrigatórios não foram preenchidos!"){
                res.status(400).json({
                    message: "Campos obrigatórios não foram preenchidos!"
                })
            }
            
            // Remove campos que são gerados automaticamente
            const { createdAt, isActive, ingressos, ...eventData } = event;
            
            // Mapear campos para os nomes corretos do banco
            const mappedData = {
                id: db.raw('gen_random_uuid()'),
                title: eventData.title,
                description: eventData.description,
                slug: eventData.slug,
                date: eventData.date,
                hour: eventData.hour,
                points: eventData.points,
                address: eventData.address,
                city: eventData.city
            };

            await db.insert(mappedData).into('events');

            
            res.status(201).json({
                message: 'Evento criado com sucesso',
                status: 201
            });
        } catch (error) {
            res.status(400).send(error);
        }   
    }