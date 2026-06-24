import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { projectService, type Project } from '@/services/projectService'
import { api } from '@/services/api'
import { queryKeys } from '@/query/queryKeys'

export function useProjects() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: projectService.getProjects,
    staleTime: 1000 * 60 * 5,
  })

  const projects = computed(() => query.data.value as Project[] | undefined)

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string
      description?: string
      deadline: string
      teamId: string
      supervisorId: string
    }) => api.post('/projects', data).then((r) => r.data.data as Project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })

  return {
    projects,
    isLoading: computed(() => !!query.isLoading.value),
    isError: computed(() => !!query.isError.value),
    error: computed(() => query.error.value as Error | null),
    refetch: query.refetch,
    createProject: createMutation.mutateAsync,
    isCreating: computed(() => createMutation.isPending.value as boolean),
    deleteProject: deleteMutation.mutateAsync,
    isDeleting: computed(() => deleteMutation.isPending.value as boolean),
  }
}
