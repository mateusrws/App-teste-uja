import { beforeEach, describe, expect, it, vi } from "vitest";
import { createEvent } from "./CreateEvents";


vi.mock("../../../prisma", () => ({
  default: {
    event: {
      create: vi.fn().mockResolvedValue({
        id: "mock-uuid",
        title: "Test Event",
        description: "Test Description",
        slug: "test-event",
        date: new Date("2024-01-01"),
        hour: "10:00",
        points: 100,
        address: "Test Address",
        city: "Test City",
        preco: 34.0,
      }),
    },
  },
}));

describe("CreateEvent controller", () => {
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
        city: "Test City",
        preco: 34.0,
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    };
  });

  it("Should create Event successfully", async () => {
    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Evento criado com sucesso",
      status: 201,
    });
  });

  it("Should handle missing or invalid fields (ZodError)", async () => {
    req.body = {}; 

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Erro de validação nos campos",
        issues: expect.any(Array),
      })
    );
  });

  it("Should handle database error", async () => {
    const prisma = await import("../../../prisma");
    const mockError = new Error("Failed Database connection");

    (prisma.default.event.create as any) = vi
      .fn()
      .mockRejectedValue(mockError);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(mockError);
  });

  it("Should handle invalid field types", async () => {
    req.body = {
      title: 123,
      description: 321,
      slug: "test-event",
      date: "not-a-date",
      hour: 123,
      points: "cem",
      address: 123,
      city: 123,
      preco: "dois",
    };

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Erro de validação nos campos",
        issues: expect.any(Array),
      })
    );
  });
});
