import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService, type Task } from '@/services/taskService'

export const useTaskStore = defineStore(
  'tasks',
  () => {
    const tasks = ref<Task[]>([])
    const loading = ref(false)
    const errorMessage = ref('')

    // Getters para separar visualmente se quiser usar no template
    const pendingTasks = computed(() => tasks.value.filter((t) => t.status !== 'concluida'))
    const completedTasks = computed(() => tasks.value.filter((t) => t.status === 'concluida'))

    // 1. Carregar tarefas do projeto
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

    // 2. Criar nova tarefa e injetar no topo da lista
    const addTask = async (data: {
      title: string
      description: string
      deadline: string
      projectId: string
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

    // 3. Alternar Cronômetro (Mutação Otimista na RAM)
    const toggleTimer = async (taskId: string) => {
      const task = tasks.value.find((t) => t.id === taskId)
      if (!task) return

      try {
        if (task.isTimerRunning) {
          await taskService.stopTimer(taskId)
          task.isTimerRunning = false
        } else {
          // Se a regra de negócio for de 1 timer por usuário,
          // podemos pausar os outros localmente antes de iniciar o novo:
          tasks.value.forEach((t) => (t.isTimerRunning = false))

          await taskService.startTimer(taskId)
          task.isTimerRunning = true
        }
      } catch (error: any) {
        console.error('Erro ao controlar cronômetro:', error)
        throw error
      }
    }

    // 4. Concluir Tarefa
    const completeTask = async (taskId: string) => {
      const task = tasks.value.find((t) => t.id === taskId)
      if (!task) return

      try {
        await taskService.completeTask(taskId)
        task.status = 'concluida'
        task.isTimerRunning = false // Para o timer se estiver rodando
      } catch (error: any) {
        console.error('Erro ao concluir tarefa:', error)
        throw error
      }
    }

    return {
      tasks,
      loading,
      errorMessage,
      pendingTasks,
      completedTasks,
      loadTasks,
      addTask,
      toggleTimer,
      completeTask,
    }
  },
  { persist: true },
)
