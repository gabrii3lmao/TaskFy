<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { notificationService, type Notification } from '@/services/notificationService'

const notifications = ref<Notification[]>([])
const loading = ref(true)
const activeFilter = ref<'all' | 'unread' | 'mentions' | 'projects'>('all')

const filteredNotifications = computed(() => {
  let list = notifications.value

  if (activeFilter.value === 'unread') {
    list = list.filter((n) => !n.read)
  } else if (activeFilter.value === 'mentions') {
    list = list.filter((n) => n.type === 'delay_report' || n.type === 'task_assigned')
  } else if (activeFilter.value === 'projects') {
    list = list.filter((n) => n.type === 'task_completed' || n.type === 'project_assigned')
  }

  return list
})

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

const typeConfig = {
  task_completed: { bg: 'bg-primary/10', icon: 'pi-check-circle', color: 'text-primary' },
  delay_report: { bg: 'bg-warning/10', icon: 'pi-clock', color: 'text-yellow-500' },
  deadline_approaching: { bg: 'bg-warning/10', icon: 'pi-clock', color: 'text-yellow-500' },
  task_assigned: { bg: 'bg-secondary/10', icon: 'pi-user-plus', color: 'text-secondary' },
  project_assigned: { bg: 'bg-secondary/10', icon: 'pi-users', color: 'text-secondary' },
  system: { bg: 'bg-danger/10', icon: 'pi-exclamation-circle', color: 'text-danger' },
}

const getTypeStyle = (type: string) => typeConfig[type as keyof typeof typeConfig] || typeConfig.system

const timeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'agora mesmo'
  if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`
  return date.toLocaleDateString('pt-BR')
}

const handleMarkAsRead = async (notification: Notification) => {
  if (notification.read) return
  try {
    await notificationService.markAsRead(notification.id)
    notification.read = true
  } catch (error) {
    console.error('Erro ao marcar como lida:', error)
  }
}

const handleMarkAllAsRead = async () => {
  try {
    await notificationService.markAllAsRead()
    notifications.value.forEach((n) => (n.read = true))
  } catch (error) {
    console.error('Erro ao marcar todas como lidas:', error)
  }
}

onMounted(async () => {
  try {
    notifications.value = await notificationService.getNotifications()
  } catch (error) {
    console.error('Erro ao carregar notificações:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Notificações</h1>
        <p class="text-sm text-muted mt-1">
          Acompanhe atualizações de tarefas, projetos e equipes.
        </p>
      </div>

      <button
        v-if="unreadCount > 0"
        @click="handleMarkAllAsRead"
        class="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 transition-all duration-200"
      >
        Marcar todas como lidas
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2 p-2 bg-surface border border-border rounded-xl">
      <button
        @click="activeFilter = 'all'"
        class="px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        :class="activeFilter === 'all' ? 'bg-primary text-white' : 'text-muted hover:bg-background'"
      >
        Todas
        <span class="ml-1 text-[10px] opacity-70">({{ notifications.length }})</span>
      </button>
      <button
        @click="activeFilter = 'unread'"
        class="px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        :class="activeFilter === 'unread' ? 'bg-primary text-white' : 'text-muted hover:bg-background'"
      >
        Não lidas
        <span v-if="unreadCount > 0" class="ml-1 text-[10px] opacity-70">({{ unreadCount }})</span>
      </button>
      <button
        @click="activeFilter = 'mentions'"
        class="px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        :class="activeFilter === 'mentions' ? 'bg-primary text-white' : 'text-muted hover:bg-background'"
      >
        Menções
      </button>
      <button
        @click="activeFilter = 'projects'"
        class="px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        :class="activeFilter === 'projects' ? 'bg-primary text-white' : 'text-muted hover:bg-background'"
      >
        Projetos
      </button>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="h-24 bg-surface border border-border animate-pulse rounded-xl"></div>
    </div>

    <div v-else-if="filteredNotifications.length === 0" class="flex flex-col items-center justify-center py-20 bg-surface border border-border rounded-xl">
      <div class="w-16 h-16 rounded-2xl bg-background flex items-center justify-center">
        <i class="pi pi-bell text-2xl text-muted"></i>
      </div>
      <h2 class="mt-5 text-lg font-semibold text-foreground">Nenhuma notificação</h2>
      <p class="mt-2 text-sm text-muted text-center max-w-sm">
        Quando houver atualizações importantes em tarefas ou projetos, elas aparecerão aqui.
      </p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        @click="handleMarkAsRead(notification)"
        class="group flex items-start gap-4 p-4 bg-surface border border-border rounded-xl hover:shadow-subtle transition-all duration-200 cursor-pointer"
        :class="{ 'opacity-70': notification.read }"
      >
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          :class="getTypeStyle(notification.type).bg"
        >
          <i
            class="pi text-lg"
            :class="[getTypeStyle(notification.type).icon, getTypeStyle(notification.type).color]"
          ></i>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-foreground leading-relaxed font-medium">
                {{ notification.title }}
              </p>
              <p class="text-xs text-muted mt-0.5">{{ notification.message }}</p>
              <div class="flex items-center gap-3 mt-2 text-xs text-muted">
                <span>{{ timeAgo(notification.createdAt) }}</span>
              </div>
            </div>

            <div
              v-if="!notification.read"
              class="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
