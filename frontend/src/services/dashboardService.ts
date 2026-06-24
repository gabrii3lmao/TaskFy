import { api } from './api'

interface TaskItem {
  id: string
  title: string
  status: string
  deadline: string
  projectName: string
}

interface DashboardTasks {
  atrasadas: TaskItem[]
  venceHoje: TaskItem[]
  proximas: TaskItem[]
  concluidas: TaskItem[]
}

interface ProjectProgress {
  id: string
  title: string
  totalTasks: number
  completedTasks: number
  progress: number
  deadlineStatus: string
}

interface NotificationItem {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface DashboardData {
  stats: {
    activeProjects: number
    totalTasks: number
    teamMembers: number
    overdueTasks: number
  }
  tasks: DashboardTasks
  projects: ProjectProgress[]
  recentActivity: NotificationItem[]
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get('/dashboard')
    return response.data.data
  },
}

export type { TaskItem, DashboardTasks, ProjectProgress }
