<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDashboard } from '@/composables/useDashboard'

const authStore = useAuthStore()
const { dashboard, isLoading, isError, refetch } = useDashboard()

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
})

const todayFormatted = computed(() => {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
})

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

const notificationIcon = (type: string) => {
  const icons: Record<string, string> = {
    task_completed: 'pi-check-circle',
    delay_report: 'pi-clock',
    deadline_approaching: 'pi-clock',
    task_assigned: 'pi-user-plus',
    project_assigned: 'pi-users',
    system: 'pi-exclamation-circle',
  }
  return icons[type] || 'pi-bell'
}

const notificationBg = (type: string) => {
  const bgs: Record<string, string> = {
    task_completed: 'bg-success/10',
    delay_report: 'bg-warning/10',
    deadline_approaching: 'bg-warning/10',
    task_assigned: 'bg-secondary/10',
    project_assigned: 'bg-secondary/10',
    system: 'bg-danger/10',
  }
  return bgs[type] || 'bg-background'
}

const notificationColor = (type: string) => {
  const colors: Record<string, string> = {
    task_completed: 'text-success',
    delay_report: 'text-warning',
    deadline_approaching: 'text-warning',
    task_assigned: 'text-secondary',
    project_assigned: 'text-secondary',
    system: 'text-danger',
  }
  return colors[type] || 'text-muted'
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground flex items-center gap-2">
          <i class="pi pi-home text-primary"></i>
          {{ greeting }}, {{ authStore.user?.name || 'Visitante' }}
        </h1>
        <p class="text-sm text-muted mt-1 capitalize">{{ todayFormatted }}</p>
      </div>

      <button
        @click="() => refetch()"
        :disabled="isLoading"
        class="p-2 text-muted hover:text-primary transition-colors rounded-lg border border-border bg-surface hover:border-primary/30 disabled:opacity-50"
        title="Atualizar"
      >
        <i class="pi pi-refresh" :class="{ 'animate-spin': isLoading }"></i>
      </button>
    </div>

    <div v-if="isError" class="flex flex-col items-center justify-center py-16 bg-surface border border-border rounded-xl">
      <div class="w-14 h-14 rounded-2xl bg-danger/10 flex items-center justify-center">
        <i class="pi pi-exclamation-triangle text-2xl text-danger"></i>
      </div>
      <h2 class="mt-4 text-lg font-semibold text-foreground">Erro ao carregar dashboard</h2>
      <p class="mt-1 text-sm text-muted text-center max-w-md">
        Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.
      </p>
      <button
        @click="() => refetch()"
        class="mt-4 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all"
      >
        Tentar novamente
      </button>
    </div>

    <template v-else-if="isLoading">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-surface border border-border rounded-xl animate-pulse"></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="h-64 bg-surface border border-border rounded-xl animate-pulse"></div>
      </div>
    </template>

    <template v-else-if="dashboard">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
            <i class="pi pi-folder text-lg text-primary"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ dashboard.stats.activeProjects }}</p>
            <p class="text-xs text-muted">Projetos Ativos</p>
          </div>
        </div>
        <div class="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-secondary/10">
            <i class="pi pi-check-square text-lg text-secondary"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ dashboard.stats.totalTasks }}</p>
            <p class="text-xs text-muted">Total de Tarefas</p>
          </div>
        </div>
        <div class="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-warning/10">
            <i class="pi pi-users text-lg text-warning"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ dashboard.stats.teamMembers }}</p>
            <p class="text-xs text-muted">Membros na Equipe</p>
          </div>
        </div>
        <div class="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-danger/10">
            <i class="pi pi-exclamation-triangle text-lg text-danger"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ dashboard.stats.overdueTasks }}</p>
            <p class="text-xs text-muted">Atrasadas</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-surface border border-border rounded-xl p-5 flex flex-col shadow-sm">
          <div class="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h2 class="font-semibold text-danger flex items-center gap-2 text-sm uppercase tracking-wider">
              <i class="pi pi-clock"></i> Atrasadas
            </h2>
            <span class="bg-danger/10 text-danger font-bold px-2 py-0.5 rounded-full text-xs">
              {{ dashboard.tasks.atrasadas.length }}
            </span>
          </div>

          <div v-if="dashboard.tasks.atrasadas.length === 0" class="flex-1 flex flex-col items-center justify-center py-8 text-muted text-center">
            <i class="pi pi-check-circle text-3xl mb-2 text-success/50"></i>
            <p class="text-sm font-medium">Nenhuma tarefa atrasada!</p>
          </div>

          <div v-else class="space-y-3 flex-1 overflow-y-auto max-h-64 sm:max-h-96 pr-1">
            <div
              v-for="task in dashboard.tasks.atrasadas"
              :key="task.id"
              class="p-3.5 rounded-lg border border-danger/20 bg-danger/5 hover:bg-danger/10 transition-colors group"
            >
              <div class="text-xs text-muted font-medium mb-1 flex items-center gap-1">
                <i class="pi pi-folder text-[10px]"></i> {{ task.projectName }}
              </div>
              <h3 class="font-medium text-foreground text-sm group-hover:text-danger transition-colors">
                {{ task.title }}
              </h3>
              <div class="mt-2 flex items-center justify-between text-xs font-semibold text-danger">
                <span class="flex items-center gap-1">
                  <i class="pi pi-calendar-times"></i> {{ formatDate(task.deadline) }}
                </span>
                <span class="px-2 py-0.5 bg-danger text-white rounded text-[10px]">Atrasado</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface border border-border rounded-xl p-5 flex flex-col shadow-sm border-t-4 border-t-warning">
          <div class="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h2 class="font-semibold text-warning flex items-center gap-2 text-sm uppercase tracking-wider">
              <i class="pi pi-exclamation-circle"></i> Tarefas do Dia
            </h2>
            <span class="bg-warning/10 text-warning font-bold px-2 py-0.5 rounded-full text-xs">
              {{ dashboard.tasks.venceHoje.length }}
            </span>
          </div>

          <div v-if="dashboard.tasks.venceHoje.length === 0" class="flex-1 flex flex-col items-center justify-center py-8 text-muted text-center">
            <i class="pi pi-calendar text-3xl mb-2"></i>
            <p class="text-sm font-medium">Seu dia está livre de prazos finais.</p>
          </div>

          <div v-else class="space-y-3 flex-1 overflow-y-auto max-h-64 sm:max-h-96 pr-1">
            <div
              v-for="task in dashboard.tasks.venceHoje"
              :key="task.id"
              class="p-3.5 rounded-lg border border-warning/30 bg-warning/5 hover:bg-warning/10 transition-colors group"
            >
              <div class="text-xs text-muted font-medium mb-1 flex items-center gap-1">
                <i class="pi pi-folder text-[10px]"></i> {{ task.projectName }}
              </div>
              <h3 class="font-medium text-foreground text-sm group-hover:text-warning transition-colors">
                {{ task.title }}
              </h3>
              <div class="mt-2 flex items-center justify-between text-xs font-semibold text-warning">
                <span class="flex items-center gap-1"> <i class="pi pi-bell"></i> Hoje </span>
                <span class="px-2 py-0.5 bg-warning text-white rounded text-[10px]">Atenção</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface border border-border rounded-xl p-5 flex flex-col shadow-sm">
          <div class="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h2 class="font-semibold text-primary flex items-center gap-2 text-sm uppercase tracking-wider">
              <i class="pi pi-calendar-plus"></i> Próximos Prazos
            </h2>
            <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full text-xs">
              {{ dashboard.tasks.proximas.length }}
            </span>
          </div>

          <div v-if="dashboard.tasks.proximas.length === 0" class="flex-1 flex flex-col items-center justify-center py-8 text-muted text-center">
            <i class="pi pi-inbox text-3xl mb-2"></i>
            <p class="text-sm font-medium">Nenhum prazo futuro agendado.</p>
          </div>

          <div v-else class="space-y-3 flex-1 overflow-y-auto max-h-64 sm:max-h-96 pr-1">
            <div
              v-for="task in dashboard.tasks.proximas"
              :key="task.id"
              class="p-3.5 rounded-lg border border-border bg-background hover:border-primary/30 transition-all group"
            >
              <div class="text-xs text-muted font-medium mb-1 flex items-center gap-1">
                <i class="pi pi-folder text-[10px]"></i> {{ task.projectName }}
              </div>
              <h3 class="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                {{ task.title }}
              </h3>
              <div class="mt-2 flex items-center justify-between text-xs font-medium text-muted">
                <span class="flex items-center gap-1">
                  <i class="pi pi-calendar"></i> {{ formatDate(task.deadline) }}
                </span>
                <span class="px-2 py-0.5 bg-primary/10 text-primary rounded font-semibold text-[10px]">Em dia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="dashboard.tasks.concluidas.length > 0" class="bg-surface border border-border rounded-xl p-5 shadow-sm">
        <h2 class="font-semibold text-success flex items-center gap-2 text-sm uppercase tracking-wider mb-4">
          <i class="pi pi-check-circle"></i> Tarefas Concluídas
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            v-for="task in dashboard.tasks.concluidas"
            :key="task.id"
            class="p-3 rounded-lg border border-success/20 bg-success/5 flex items-center justify-between"
          >
            <div class="truncate pr-2">
              <p class="text-xs text-muted truncate">{{ task.projectName }}</p>
              <h4 class="text-sm font-medium text-foreground truncate line-through opacity-80">{{ task.title }}</h4>
            </div>
            <i class="pi pi-check text-success font-bold"></i>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <h2 class="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider mb-4">
            <i class="pi pi-chart-bar text-primary"></i>
            Progresso dos Projetos
          </h2>

          <div v-if="dashboard.projects.length === 0" class="flex flex-col items-center justify-center py-8 text-muted text-center">
            <i class="pi pi-folder-open text-3xl mb-2"></i>
            <p class="text-sm font-medium">Nenhum projeto encontrado.</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="project in dashboard.projects" :key="project.id">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm font-medium text-foreground">{{ project.title }}</span>
                <span class="text-xs text-muted">{{ project.completedTasks }}/{{ project.totalTasks }} tarefas</span>
              </div>
              <div class="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="project.progress === 100 ? 'bg-success' : project.deadlineStatus === 'Atrasado' ? 'bg-danger' : 'bg-primary'"
                  :style="{ width: project.progress + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <h2 class="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider mb-4">
            <i class="pi pi-history text-secondary"></i>
            Atividade Recente
          </h2>

          <div v-if="dashboard.recentActivity.length === 0" class="flex flex-col items-center justify-center py-8 text-muted text-center">
            <i class="pi pi-inbox text-3xl mb-2"></i>
            <p class="text-sm font-medium">Nenhuma atividade recente.</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="activity in dashboard.recentActivity"
              :key="activity.id"
              class="flex items-start gap-3"
            >
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                :class="notificationBg(activity.type)"
              >
                <i class="pi text-xs" :class="[notificationIcon(activity.type), notificationColor(activity.type)]"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-foreground">
                  <span class="font-semibold">{{ activity.title }}</span>
                </p>
                <p class="text-xs text-muted mt-0.5">{{ activity.message }}</p>
                <p class="text-xs text-muted mt-0.5">{{ timeAgo(activity.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
