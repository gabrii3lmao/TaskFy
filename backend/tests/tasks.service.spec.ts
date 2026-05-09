import { describe, it, expect, vi, beforeEach } from "vitest";
import { TasksService } from "../src/modules/tasks/tasks.service.js";
import { HttpException } from "../src/core/errorHandler.js";

vi.mock("../src/core/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    transaction: vi.fn((cb) =>
      cb({
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id: "mock-id" }]),
      }),
    ),
  },
}));

import { db } from "../src/core/db.js";

describe("TasksService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Conclusão de Tarefa", () => {
    it("deve lançar erro 403 se um não-encarregado tentar concluir a tarefa", async () => {
      // PREPARAÇÃO: O banco não encontra o vínculo na tabela task_assignees
      (db.where as any).mockResolvedValueOnce([]);

      // EXECUÇÃO & VALIDAÇÃO
      await expect(
        TasksService.completeTask("task-1", "user-intruder"),
      ).rejects.toThrowError(
        new HttpException(
          "Acesso negado: Apenas os encarregados pela tarefa podem concluí-la.",
          403,
        ),
      );
    });
  });

  describe("Cronômetro de Tarefa (Time Tracking)", () => {
    it("deve lançar erro 403 se um não-encarregado tentar dar play na tarefa", async () => {
      (db.where as any).mockResolvedValueOnce([]); // Não é encarregado

      await expect(
        TasksService.startTaskTimer("task-1", "user-intruder"),
      ).rejects.toThrowError(
        new HttpException("Apenas encarregados podem iniciar a tarefa.", 403),
      );
    });

    it("deve lançar erro 400 se o usuário já tiver um cronômetro rodando nesta tarefa", async () => {
      // 1ª chamada do where: verifica se é encarregado (retorna sucesso)
      (db.where as any).mockResolvedValueOnce([
        { taskId: "task-1", userId: "user-1" },
      ]);
      // 2ª chamada do where: busca timer ativo (retorna um timer com endTime nulo)
      (db.where as any).mockResolvedValueOnce([
        { id: "timer-1", endTime: null },
      ]);

      await expect(
        TasksService.startTaskTimer("task-1", "user-1"),
      ).rejects.toThrowError(
        new HttpException(
          "Esta tarefa já possui um cronômetro ativo.",
          400,
        ),
      );
    });

    it("deve lançar erro 400 ao tentar pausar um cronômetro que não está rodando", async () => {
      // Simula que não encontrou nenhum timer ativo
      (db.where as any).mockResolvedValueOnce([]);

      await expect(
        TasksService.stopTaskTimer("task-1", "user-1"),
      ).rejects.toThrowError(
        new HttpException("Não há um cronômetro ativo para esta tarefa.", 400),
      );
    });
  });
});
