import { RequestHandler } from "express";
import db from "../../knex";

export const getEvents: RequestHandler = async (req, res) => {
    try {
        const events = await db.select('*').from('events');
        
        res.status(200).json({
            message: 'Eventos encontrados com sucesso',
            status: 200,
            events: events
        });
    } catch (error) {
        console.log(error);
    }
}

export const getEventsBySlug: RequestHandler = async (req, res) => {
    try {
        const { slug } = req.params;
        const event = await db.select('*').from('events').where('slug', slug).first();

        if (!event) {
            return res.json({
                message: 'Evento não encontrado',
                status: 404,
                data: null
            }).status(404);
        }

        res.json({
            message: 'Evento encontrado com sucesso',
            status: 200,
            data: event
        }).status(200);

    } catch (error) {
        res.json({
            message: 'Erro ao buscar evento',
            status: 500,
            error: error
        }).status(500);
    }
}