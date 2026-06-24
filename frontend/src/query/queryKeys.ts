export const queryKeys = {
  dashboard: ['dashboard'] as const,
  projects: {
    all: ['projects'] as const,
  },
  teams: {
    all: ['teams'] as const,
  },
  tasks: {
    my: ['tasks', 'my'] as const,
    byProject: (id: string) => ['tasks', 'project', id] as const,
    subtasks: (id: string) => ['tasks', id, 'subtasks'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
  },
  workload: {
    members: (teamId: string) => ['workload', 'members', teamId] as const,
  },
}
