export type Task = {
  title: string;
  description: string;
  deadline: Date;
  projectId: string;
  parentTaskId?: string; // Opcional (se for undefined, é tarefa principal)
  assigneeIds: string[];
};
