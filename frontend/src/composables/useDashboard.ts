import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { dashboardService } from '@/services/dashboardService'
import { queryKeys } from '@/query/queryKeys'
import type { DashboardData } from '@/services/dashboardService'

export function useDashboard() {
  const query = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardService.getDashboard,
    staleTime: 1000 * 30,
  })

  const dashboard = computed(() => query.data.value as DashboardData | undefined)

  return {
    dashboard,
    isLoading: computed(() => !!query.isLoading.value),
    isError: computed(() => !!query.isError.value),
    refetch: query.refetch,
  }
}
