import { it, describe, expect, vitest as vi, beforeEach } from "vitest";
import { getEvents, getEventsBySlug } from "./GetEvents";
import prisma from "../../../prisma";

vi.mock("../../../prisma", () => ({
  default: {
    event: {
      findMany: vi.fn().mockResolvedValue([
        {
          title: "Evento Teste",
          description: "Um evento de teste",
          date: new Date("2025-01-01"),
          hour: "10:00",
          points: 50,
          image: "imagem-teste.jpg",
          maximumParticipants: 100,
          address: "Rua das Flores, 123",
          city: "São Paulo",
          state: "SP",
          preco: 20,
          slug: "evento-teste",
          organizerId: "org123",
          createdAt: new Date(),
          isActive: true,
          ingressos: [],
        },
      ]),
      findUnique: vi.fn().mockResolvedValue({
        title: "Evento Teste",
        description: "Um evento de teste",
        date: new Date("2025-01-01"),
        hour: "10:00",
        points: 50,
        image: "imagem-teste.jpg",
        maximumParticipants: 100,
        address: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        preco: 20,
        slug: "evento-teste",
        organizerId: "org123",
        createdAt: new Date(),
        isActive: true,
        ingressos: [],
      }),
    },
  },
}));

describe("GetEvent Controller", () => {
  let res: any;
  let req: any;

  beforeEach(() => {
    req = {
      params: { slug: "evento-teste" },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    };
  });

  it("Should test the function getEvents", async () => {
    await getEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Eventos encontrados com sucesso",
      events: expect.arrayContaining([
        expect.objectContaining({
          title: "Evento Teste",
          city: "São Paulo",
          preco: 20,
          isActive: true,
        }),
      ]),
    });
  });

  it("Should handle database error", async () => {
    const mockError = new Error("Erro no banco de dados");
    (prisma.event.findUnique as any).mockRejectedValueOnce(mockError);

    await getEventsBySlug(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erro ao buscar evento",
      error: "Erro no banco de dados",
    });
  });

  it("Should handle missing fields", async () => {
    const req = {}; // sem params

    await getEventsBySlug(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Parâmetros faltando",
    });
  });
});
