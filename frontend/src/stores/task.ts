/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService, type Task } from '@/services/taskService'

export const useTaskStore = defineStore(
  'tasks',
  () => {
    const tasks = ref<Task[]>([])
    const loading = ref(false)
    const errorMessage = ref('')
    const subtasksMap = ref<Record<string, Task[]>>({})

    const pendingTasks = computed(() => tasks.value.filter((t) => t.status !== 'completed'))
    const completedTasks = computed(() => tasks.value.filter((t) => t.status === 'completed'))
    const rootTasks = computed(() => tasks.value.filter((t) => !t.parentTaskId))

    const myTasksFlat = ref<Task[]>([])

    const loadMyTasks = async () => {
      loading.value = true
      errorMessage.value = ''
      try {
        myTasksFlat.value = await taskService.getMyTasks()
      } catch (error: any) {
        errorMessage.value = 'Erro ao carregar as tarefas.'
        console.error(error)
      } finally {
        loading.value = false
      }
    }

    const loadTasks = async (projectId: string) => {
      loading.value = true
      errorMessage.value = ''
      try {
        tasks.value = await taskService.getTasksByProject(projectId)
      } catch (error: any) {
        errorMessage.value = 'Erro ao carregar as tarefas do projeto.'
        console.error(error)
      } finally {
        loading.value = false
      }
    }

    const addTask = async (data: {
      title: string
      description?: string
      deadline: string
      projectId: string
      parentTaskId?: string
      assigneeIds: string[]
    }) => {
      loading.value = true
      errorMessage.value = ''
      try {
        const newTask = await taskService.createTask(data)
        tasks.value.unshift(newTask)
        return newTask
      } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Erro ao criar a tarefa.'
        throw error
      } finally {
        loading.value = false
      }
    }

    const updateTask = async (
      taskId: string,
      data: Partial<{
        title: string
        description: string
        deadline: string
        status: 'not_started' | 'in_progress' | 'completed'
      }>,
    ) => {
      try {
        const updated = await taskService.updateTask(taskId, data)
        const idx = tasks.value.findIndex((t) => t.id === taskId)
        if (idx !== -1) {
          tasks.value[idx] = { ...tasks.value[idx], ...updated }
        }
        return updated
      } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Erro ao atualizar tarefa.'
        throw error
      }
    }

    const removeTask = async (taskId: string) => {
      try {
        await taskService.deleteTask(taskId)
        tasks.value = tasks.value.filter((t) => t.id !== taskId)
      } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Erro ao excluir tarefa.'
        throw error
      }
    }

    const loadSubtasks = async (taskId: string) => {
      try {
        const subtasks = await taskService.getSubtasks(taskId)
        subtasksMap.value[taskId] = subtasks
        return subtasks
      } catch (error: any) {
        console.error('Erro ao carregar subtarefas:', error)
        return []
      }
    }

    const toggleTimer = async (taskId: string) => {
      const task = tasks.value.find((t) => t.id === taskId)
      if (!task) return

      try {
        if (task.isTimerRunning) {
          await taskService.stopTimer(taskId)
          task.isTimerRunning = false
        } else {
          tasks.value.forEach((t) => (t.isTimerRunning = false))
          await taskService.startTimer(taskId)
          task.isTimerRunning = true
        }
      } catch (error: any) {
        console.error('Erro ao controlar cronômetro:', error)
        throw error
      }
    }

    const completeTask = async (taskId: string) => {
      const task = tasks.value.find((t) => t.id === taskId)
      if (!task) return

      try {
        await taskService.completeTask(taskId)
        task.status = 'completed'
        task.isTimerRunning = false
      } catch (error: any) {
        console.error('Erro ao concluir tarefa:', error)
        throw error
      }
    }

    const reportDelay = async (taskId: string, reason?: string) => {
      try {
        const result = await taskService.reportDelay(taskId, reason)
        return result
      } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Erro ao reportar atraso.'
        throw error
      }
    }

    return {
      tasks,
      myTasksFlat,
      loading,
      errorMessage,
      subtasksMap,
      pendingTasks,
      completedTasks,
      rootTasks,
      loadTasks,
      loadMyTasks,
      addTask,
      updateTask,
      removeTask,
      loadSubtasks,
      toggleTimer,
      completeTask,
      reportDelay,
    }
  },
  { persist: true },
)
