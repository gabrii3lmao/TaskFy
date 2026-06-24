import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { taskService, type Task } from '@/services/taskService'
import { queryKeys } from '@/query/queryKeys'

function ensureArray<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : []
}

export function useMyTasks() {
  const query = useQuery({
    queryKey: queryKeys.tasks.my,
    queryFn: taskService.getMyTasks,
  })

  const tasks = computed(() => ensureArray(query.data.value as Task[] | undefined))

  return {
    tasks,
    isLoading: computed(() => !!query.isLoading.value),
    isError: computed(() => !!query.isError.value),
    refetch: query.refetch,
  }
}

export function useProjectTasks(projectId: MaybeRefOrGetter<string>) {
  const query = useQuery({
    queryKey: computed(() => queryKeys.tasks.byProject(toValue(projectId))),
    queryFn: () => taskService.getTasksByProject(toValue(projectId)),
    enabled: computed(() => !!toValue(projectId)),
  })

  const tasks = computed(() => ensureArray(query.data.value as Task[] | undefined))

  return {
    tasks,
    isLoading: computed(() => !!query.isLoading.value),
    isError: computed(() => !!query.isError.value),
    error: computed(() => query.error.value as Error | null),
    refetch: query.refetch,
  }
}

export function useTaskSubtasks(taskId: MaybeRefOrGetter<string>) {
  const query = useQuery({
    queryKey: computed(() => queryKeys.tasks.subtasks(toValue(taskId))),
    queryFn: () => taskService.getSubtasks(toValue(taskId)),
    enabled: computed(() => !!toValue(taskId)),
  })

  const subtasks = computed(() => ensureArray(query.data.value as Task[] | undefined))

  return {
    subtasks,
    isSubtasksLoading: computed(() => !!query.isLoading.value),
    refetchSubtasks: query.refetch,
  }
}

export function useTaskMutations() {
  const queryClient = useQueryClient()

  const invalidateTasks = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
  }

  const createTask = useMutation({
    mutationFn: (data: {
      title: string
      description?: string
      deadline: string
      projectId: string
      parentTaskId?: string
      assigneeIds: string[]
    }) => taskService.createTask(data),
    onSuccess: () => invalidateTasks(),
  })

  const updateTask = useMutation({
    mutationFn: (params: {
      taskId: string
      data: Partial<{
        title: string
        description: string
        deadline: string
        status: 'not_started' | 'in_progress' | 'completed'
      }>
    }) => taskService.updateTask(params.taskId, params.data),
    onSuccess: () => invalidateTasks(),
  })

  const deleteTask = useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: () => invalidateTasks(),
  })

  const completeTask = useMutation({
    mutationFn: (taskId: string) => taskService.completeTask(taskId),
    onSuccess: () => invalidateTasks(),
  })

  const toggleTimer = useMutation({
    mutationFn: (params: { taskId: string; isRunning: boolean }) =>
      params.isRunning ? taskService.stopTimer(params.taskId) : taskService.startTimer(params.taskId),
    onSuccess: () => invalidateTasks(),
  })

  const reportDelay = useMutation({
    mutationFn: (params: { taskId: string; reason?: string }) =>
      taskService.reportDelay(params.taskId, params.reason),
    onSuccess: () => invalidateTasks(),
  })

  const toggleSubtask = useMutation({
    mutationFn: (params: { taskId: string; isCompleted: boolean }) =>
      params.isCompleted
        ? taskService.updateTask(params.taskId, { status: 'not_started' })
        : taskService.completeTask(params.taskId),
    onSuccess: () => invalidateTasks(),
  })

  return {
    createTask: createTask.mutateAsync,
    isCreating: computed(() => createTask.isPending.value as boolean),
    updateTask: updateTask.mutateAsync,
    isUpdating: computed(() => updateTask.isPending.value as boolean),
    deleteTask: deleteTask.mutateAsync,
    isDeleting: computed(() => deleteTask.isPending.value as boolean),
    completeTask: completeTask.mutateAsync,
    isCompleting: computed(() => completeTask.isPending.value as boolean),
    toggleTimer: toggleTimer.mutateAsync,
    isTogglingTimer: computed(() => toggleTimer.isPending.value as boolean),
    reportDelay: reportDelay.mutateAsync,
    isReportingDelay: computed(() => reportDelay.isPending.value as boolean),
    toggleSubtask: toggleSubtask.mutateAsync,
    isTogglingSubtask: computed(() => toggleSubtask.isPending.value as boolean),
  }
}
