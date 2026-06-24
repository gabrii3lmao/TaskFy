import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { teamService, type Team } from '@/services/teamService'
import { queryKeys } from '@/query/queryKeys'

export function useTeams() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.teams.all,
    queryFn: teamService.getTeams,
    staleTime: 1000 * 60 * 5,
  })

  const teams = computed(() => query.data.value as Team[] | undefined)

  const createMutation = useMutation({
    mutationFn: (name: string) => teamService.createTeam(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.all })
    },
  })

  const addMemberMutation = useMutation({
    mutationFn: (params: { teamId: string; userId: string; role: 'admin' | 'member' | 'supervisor' }) =>
      teamService.addMember(params.teamId, params.userId, params.role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.all })
    },
  })

  return {
    teams,
    isLoading: computed(() => !!query.isLoading.value),
    isError: computed(() => !!query.isError.value),
    error: computed(() => query.error.value as Error | null),
    refetch: query.refetch,
    createTeam: createMutation.mutateAsync,
    isCreating: computed(() => createMutation.isPending.value as boolean),
    addMember: addMemberMutation.mutateAsync,
    isAddingMember: computed(() => addMemberMutation.isPending.value as boolean),
  }
}
