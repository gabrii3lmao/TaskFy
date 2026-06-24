import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { notificationService, type Notification } from '@/services/notificationService'
import { queryKeys } from '@/query/queryKeys'

export function useNotifications() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: notificationService.getNotifications,
    staleTime: 1000 * 30,
  })

  const notifications = computed(() => query.data.value as Notification[] | undefined)

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all })
      const previous = queryClient.getQueryData<Notification[]>(queryKeys.notifications.all)
      if (previous) {
        queryClient.setQueryData<Notification[]>(
          queryKeys.notifications.all,
          previous.map((n) => (n.id === id ? { ...n, read: true } : n)),
        )
      }
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.notifications.all, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all })
      const previous = queryClient.getQueryData<Notification[]>(queryKeys.notifications.all)
      if (previous) {
        queryClient.setQueryData<Notification[]>(
          queryKeys.notifications.all,
          previous.map((n) => ({ ...n, read: true })),
        )
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.notifications.all, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })

  return {
    notifications,
    isLoading: computed(() => !!query.isLoading.value),
    isError: computed(() => !!query.isError.value),
    refetch: query.refetch,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
  }
}
