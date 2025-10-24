import { describe, it, beforeEach, expect, vitest as vi } from "vitest";
import { putEvent } from "./PutEvents";
import prisma from "../../../prisma";

// mock do prisma
vi.mock("../../../prisma", () => ({
  default: {
    event: {
      update: vi.fn(),
    },
  },
}));

describe("putEvent Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        slug: "evento-teste",
        title: "Novo título",
        city: "São Paulo",
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it("Should update event", async () => {
    // mock de sucesso do banco
    (prisma.event.update as any).mockResolvedValue({
      slug: "evento-teste",
      title: "Novo título",
      city: "São Paulo",
    });

    await putEvent(req, res);

    expect(prisma.event.update).toHaveBeenCalledWith({
      where: { slug: "evento-teste" },
      data: {
        slug: "evento-teste",
        title: "Novo título",
        city: "São Paulo",
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Evento alterado com sucesso",
      event: expect.objectContaining({
        slug: "evento-teste",
        title: "Novo título",
      }),
    });
  });

  it("Should handle missing fields", async () => {
    req.body = { title: "Sem slug" }; // sem slug

    await putEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Slug não foi fornecido",
    });
  });

  it("Should hanlde an error database", async () => {
    const mockError = new Error("Erro no banco de dados");
    (prisma.event.update as any).mockRejectedValueOnce(mockError);

    await putEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erro ao alterar evento",
      error: mockError,
    });
  });
});
