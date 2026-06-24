import { ref, computed, watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { teamService } from '@/services/teamService'
import { projectService } from '@/services/projectService'
import { api } from '@/services/api'
import { queryKeys } from '@/query/queryKeys'
import type { Team } from '@/services/teamService'
import type { Project } from '@/services/projectService'

interface MemberBreakdown {
  id: string
  name: string
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  pendingTasks: number
}

export function useWorkload(teamIdRef: Ref<string | undefined>) {
  const teamsQuery = useQuery({
    queryKey: queryKeys.teams.all,
    queryFn: teamService.getTeams,
  })

  const projectsQuery = useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: projectService.getProjects,
  })

  const teams = computed(() => teamsQuery.data.value as Team[] | undefined)
  const teamsLoading = computed(() => !!teamsQuery.isLoading.value)
  const teamsError = computed(() => !!teamsQuery.isError.value)
  const projects = computed(() => projectsQuery.data.value as Project[] | undefined)
  const projectsLoading = computed(() => !!projectsQuery.isLoading.value)
  const projectsError = computed(() => !!projectsQuery.isError.value)

  const members = ref<MemberBreakdown[]>([])
  const membersLoading = ref(false)
  const membersError = ref(false)

  const fetchMembers = async (id: string) => {
    membersLoading.value = true
    membersError.value = false
    try {
      const res = await api.get(`/users/workload/members?teamId=${id}`)
      members.value = res.data.data as MemberBreakdown[]
    } catch {
      membersError.value = true
    } finally {
      membersLoading.value = false
    }
  }

  watch(teamIdRef, (id) => {
    if (id) {
      fetchMembers(id)
    } else {
      members.value = []
    }
  }, { immediate: true })

  const stats = computed(() => {
    const list = members.value
    const total = list.reduce((s, m) => s + m.totalTasks, 0)
    const completed = list.reduce((s, m) => s + m.completedTasks, 0)
    const inProgress = list.reduce((s, m) => s + m.inProgressTasks, 0)
    const pending = list.reduce((s, m) => s + m.pendingTasks, 0)
    return [
      { label: 'Total de Tarefas', value: total, icon: 'pi-check-square', color: 'text-primary' },
      { label: 'Concluídas', value: completed, icon: 'pi-check-circle', color: 'text-success' },
      { label: 'Em Andamento', value: inProgress, icon: 'pi-spinner', color: 'text-warning' },
      { label: 'Pendentes', value: pending, icon: 'pi-clock', color: 'text-muted' },
    ]
  })

  const isLoading = computed(() => teamsLoading.value || membersLoading.value || projectsLoading.value)
  const isError = computed(() => teamsError.value || membersError.value || projectsError.value)

  return {
    teams,
    isTeamsLoading: teamsLoading,
    members,
    projects,
    stats,
    isLoading,
    isError,
    refetchMembers: () => {
      if (teamIdRef.value) {
        fetchMembers(teamIdRef.value)
      }
    },
  }
}
