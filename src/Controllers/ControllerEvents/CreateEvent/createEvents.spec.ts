import { beforeEach, expect, it, vitest } from "vitest";
import { createEvent } from "./CreateEvents";
import { describe } from "node:test";
import { create } from "domain";
import { addAbortListener } from "events";

// Mock do knex
vitest.mock("../../../knex", () => ({
    default: {
        raw: vitest.fn().mockReturnValue("mock-uuid"),
        insert: vitest.fn().mockReturnThis(),
        into: vitest.fn().mockResolvedValue(undefined)
    }
}));

describe('CreateEvent controller',  () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        req = { 
            body: {
                title: "Test Event",
                description: "Test Description",
                slug: "test-event",
                date: "2024-01-01",
                hour: "10:00",
                points: 100,
                address: "Test Address",
                city: "Test City"
            }
        }
        res = { 
            status: vitest.fn().mockReturnThis(), 
            json: vitest.fn(),
            send: vitest.fn()
        }
    })

    it('Should create Event sucefully', async () => {
        await createEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Evento criado com sucesso',
            status: 201
        })
    });

    it('Should handle missing fields', async () =>{
        req.body = {};

        await createEvent(req,res);

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            message: "Campos obrigatórios não foram preenchidos!"
        })
    });

    it('Should handle database error', async ()=>{
        const db = await import( '../../../knex');
        const mockError = new Error("Failed Database connection");
        db.default.insert = vitest.fn().mockReturnThis();
        db.default.into = vitest.fn().mockRejectedValue(mockError)

        await createEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith(mockError)
    });

    it('Should handle error types of fields', async () => {
        req = {
            body: {
                title: 12323,
                description: 21323,
                slug: "test-event",
                date: "masdsd",
                hour: "arroz",
                points: "100",
                address: 432,
                city: 32
            }
        }
    })
})

/*
// CÓDIGO CORRETO PARA REFERÊNCIA:

import { beforeEach, expect, it, vitest } from "vitest";
import { createEvent } from "./CreateEvents";
import { describe } from "node:test";

// Mock do knex
vitest.mock("../../../knex", () => ({
    default: {
        raw: vitest.fn().mockReturnValue("mock-uuid"),
        insert: vitest.fn().mockReturnThis(),
        into: vitest.fn().mockResolvedValue(undefined)
    }
}));

describe('CreateEvent controller',  () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        req = { 
            body: {
                title: "Test Event",
                description: "Test Description",
                slug: "test-event",
                date: "2024-01-01",
                hour: "10:00",
                points: 100,
                address: "Test Address",
                city: "Test City"
            }
        }
        res = { 
            status: vitest.fn().mockReturnThis(), 
            json: vitest.fn(),
            send: vitest.fn()
        }
    })

    it('Should create event successfully', async () => {
        await createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Evento criado com sucesso',
            status: 201,
            event: req.body
        });
    })

    it('Should handle database error', async () => {
        const db = await import("../../../knex");
        const mockError = new Error("Database connection failed");
        db.default.insert = vitest.fn().mockReturnThis();
        db.default.into = vitest.fn().mockRejectedValue(mockError);

        await createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(mockError);
    })

    it('Should handle missing required fields', async () => {
        req.body = {}; // Empty body
        
        await createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalled();
    })

    it('Should handle invalid data types', async () => {
        req.body = {
            title: 123, // Should be string
            description: null,
            slug: undefined,
            date: "invalid-date",
            hour: 123, // Should be string
            points: "not-a-number", // Should be number
            address: [],
            city: {}
        };
        
        await createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalled();
    })
})
*/