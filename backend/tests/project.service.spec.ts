// src/modules/projects/projects.service.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectsService } from "../src/modules/projects/projects.service.js";
import { HttpException } from "../src/core/errorHandler.js";

// 1. Mockamos o nosso arquivo de banco de dados
vi.mock("../src/core/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn(), // Onde vamos injetar a resposta simulada
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  },
}));

import { db } from "../src/core/db.js"; // Importamos o mock para manipulá-lo

describe("ProjectsService", () => {
  // Limpa os mocks antes de cada teste para não haver interferência
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProjectData = {
    title: "Novo App",
    description: "App de tarefas",
    deadline: new Date("2026-12-31"),
    teamId: "team-123",
    supervisorId: "user-456",
  };

  it("deve lançar um erro 400 se o supervisor NÃO for membro da equipe", async () => {
    // PREPARAÇÃO: Simulamos que o banco não encontrou nenhum vínculo na tabela team_members
    (db.where as any).mockResolvedValueOnce([]); // Retorna array vazio

    // EXECUÇÃO & VALIDAÇÃO
    // Esperamos que a chamada assíncrona rejeite com um erro específico
    await expect(
      ProjectsService.createProject(mockProjectData),
    ).rejects.toThrow(
      new HttpException(
        "O supervisor selecionado não é membro da equipe responsável.",
        400,
      ),
    );

    // Garantimos que o insert NUNCA foi chamado
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("deve criar o projeto com sucesso se o supervisor FOR membro da equipe", async () => {
    // PREPARAÇÃO: Simulamos que o banco encontrou o membro na equipe
    (db.where as any).mockResolvedValueOnce([{ role: "member" }]);

    // Simulamos o retorno da inserção do projeto
    const insertedProject = { ...mockProjectData, id: "project-789" };
    (db.returning as any).mockResolvedValueOnce([insertedProject]);

    // EXECUÇÃO
    const result = await ProjectsService.createProject(mockProjectData);

    // VALIDAÇÃO
    expect(result).toEqual(insertedProject);
    expect(db.insert).toHaveBeenCalledTimes(1); // Garante que mandou salvar no banco
  });
});
