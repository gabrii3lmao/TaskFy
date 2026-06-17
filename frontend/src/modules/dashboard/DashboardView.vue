<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

interface TaskItem {
  id: string
  title: string
  status: string
  deadline: string
  projectName: string
  deadlineStatus?: string
}

interface DashboardData {
  atrasadas: TaskItem[]
  venceHoje: TaskItem[]
  proximas: TaskItem[]
  concluidas: TaskItem[]
}

const mockTasks: DashboardData = {
  atrasadas: [
    { id: 'm1', title: 'Corrigir bug no login social', status: 'in_progress', deadline: '2026-06-10', projectName: 'Core API' },
    { id: 'm2', title: 'Atualizar dependências do backend', status: 'not_started', deadline: '2026-06-12', projectName: 'Atlas' },
    { id: 'm3', title: 'Revisar PR do módulo de pagamentos', status: 'in_progress', deadline: '2026-06-13', projectName: 'Finance' },
  ],
  venceHoje: [
    { id: 'm4', title: 'Enviar relatório semanal', status: 'in_progress', deadline: new Date().toISOString().split('T')[0]!, projectName: 'Atlas' },
    { id: 'm5', title: 'Reunião de alinhamento da sprint', status: 'not_started', deadline: new Date().toISOString().split('T')[0]!, projectName: 'TaskFy Mobile' },
  ],
  proximas: [
    { id: 'm6', title: 'Implementar testes de integração', status: 'not_started', deadline: '2026-06-22', projectName: 'Core API' },
    { id: 'm7', title: 'Criar documentação da API', status: 'not_started', deadline: '2026-06-25', projectName: 'Finance' },
    { id: 'm8', title: 'Configurar ambiente de staging', status: 'not_started', deadline: '2026-06-28', projectName: 'Atlas' },
    { id: 'm9', title: 'Otimizar queries do dashboard', status: 'not_started', deadline: '2026-07-02', projectName: 'Core API' },
  ],
  concluidas: [
    { id: 'm10', title: 'Configurar CI/CD', status: 'completed', deadline: '2026-06-05', projectName: 'Core API' },
    { id: 'm11', title: 'Criar tela de login', status: 'completed', deadline: '2026-06-03', projectName: 'Atlas' },
  ],
}

const stats = [
  { label: 'Projetos Ativos', value: 4, icon: 'pi-folder', color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Total de Tarefas', value: 47, icon: 'pi-check-square', color: 'text-secondary', bg: 'bg-secondary/10' },
  { label: 'Membros na Equipe', value: 12, icon: 'pi-users', color: 'text-warning', bg: 'bg-warning/10' },
  { label: 'Atrasadas', value: 3, icon: 'pi-exclamation-triangle', color: 'text-danger', bg: 'bg-danger/10' },
]

const dashboard = ref<DashboardData>({ ...mockTasks })
const loading = ref(true)
const apiFailed = ref(false)

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

const fetchDashboard = async () => {
  loading.value = true
  apiFailed.value = false

  try {
    const response = await api.get('/tasks/dashboard')
    dashboard.value = response.data.data
  } catch (error: unknown) {
    apiFailed.value = true
    dashboard.value = { ...mockTasks }
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
})
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

      <div class="flex items-center gap-2">
        <div
          v-if="apiFailed"
          class="text-xs text-warning bg-warning/10 border border-warning/20 rounded-lg px-3 py-1.5 flex items-center gap-1.5"
        >
          <i class="pi pi-exclamation-triangle"></i>
          <span>Modo offline — dados mockados</span>
        </div>
        <button
          @click="fetchDashboard"
          class="p-2 text-muted hover:text-primary transition-colors rounded-lg border border-border bg-surface hover:border-primary/30"
          title="Atualizar"
        >
          <i class="pi pi-refresh" :class="{ 'animate-spin': loading }"></i>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm"
      >
        <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', stat.bg]">
          <i :class="['pi text-lg', stat.icon, stat.color]"></i>
        </div>
        <div>
          <p class="text-2xl font-bold text-foreground">{{ stat.value }}</p>
          <p class="text-xs text-muted">{{ stat.label }}</p>
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
            {{ dashboard.atrasadas.length }}
          </span>
        </div>

        <div v-if="dashboard.atrasadas.length === 0" class="flex-1 flex flex-col items-center justify-center py-8 text-muted text-center">
          <i class="pi pi-check-circle text-3xl mb-2 text-success/50"></i>
          <p class="text-sm font-medium">Nenhuma tarefa atrasada!</p>
        </div>

        <div v-else class="space-y-3 flex-1 overflow-y-auto max-h-64 sm:max-h-96 pr-1">
          <div
            v-for="task in dashboard.atrasadas"
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
            {{ dashboard.venceHoje.length }}
          </span>
        </div>

        <div v-if="dashboard.venceHoje.length === 0" class="flex-1 flex flex-col items-center justify-center py-8 text-muted text-center">
          <i class="pi pi-calendar text-3xl mb-2"></i>
          <p class="text-sm font-medium">Seu dia está livre de prazos finais.</p>
        </div>

        <div v-else class="space-y-3 flex-1 overflow-y-auto max-h-64 sm:max-h-96 pr-1">
          <div
            v-for="task in dashboard.venceHoje"
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
            {{ dashboard.proximas.length }}
          </span>
        </div>

        <div v-if="dashboard.proximas.length === 0" class="flex-1 flex flex-col items-center justify-center py-8 text-muted text-center">
          <i class="pi pi-inbox text-3xl mb-2"></i>
          <p class="text-sm font-medium">Nenhum prazo futuro agendado.</p>
        </div>

        <div v-else class="space-y-3 flex-1 overflow-y-auto max-h-64 sm:max-h-96 pr-1">
          <div
            v-for="task in dashboard.proximas"
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

    <div v-if="dashboard.concluidas.length > 0" class="bg-surface border border-border rounded-xl p-5 shadow-sm">
      <h2 class="font-semibold text-success flex items-center gap-2 text-sm uppercase tracking-wider mb-4">
        <i class="pi pi-check-circle"></i> Tarefas Concluídas
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          v-for="task in dashboard.concluidas"
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

        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm font-medium text-foreground">Atlas</span>
              <span class="text-xs text-muted">12/14 tarefas</span>
            </div>
            <div class="w-full h-2 bg-background rounded-full overflow-hidden">
              <div class="h-full bg-success rounded-full transition-all duration-500" style="width: 86%"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm font-medium text-foreground">Finance</span>
              <span class="text-xs text-muted">7/10 tarefas</span>
            </div>
            <div class="w-full h-2 bg-background rounded-full overflow-hidden">
              <div class="h-full bg-warning rounded-full transition-all duration-500" style="width: 70%"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm font-medium text-foreground">TaskFy Mobile</span>
              <span class="text-xs text-muted">5/8 tarefas</span>
            </div>
            <div class="w-full h-2 bg-background rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full transition-all duration-500" style="width: 62%"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm font-medium text-foreground">Core API</span>
              <span class="text-xs text-muted">10/15 tarefas</span>
            </div>
            <div class="w-full h-2 bg-background rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full transition-all duration-500" style="width: 67%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-surface border border-border rounded-xl p-5 shadow-sm">
        <h2 class="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider mb-4">
          <i class="pi pi-history text-secondary"></i>
          Atividade Recente
        </h2>

        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
              <i class="pi pi-check-circle text-success text-xs"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-foreground">
                <span class="font-semibold">Marina Costa</span> concluiu
                <span class="font-medium">"Implementar autenticação JWT"</span>
              </p>
              <p class="text-xs text-muted mt-0.5">Há 12 minutos</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <i class="pi pi-play-circle text-primary text-xs"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-foreground">
                <span class="font-semibold">Rafael Lima</span> iniciou
                <span class="font-medium">"Criar dashboard financeiro"</span>
              </p>
              <p class="text-xs text-muted mt-0.5">Há 1 hora</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-full bg-warning/10 flex items-center justify-center shrink-0 mt-0.5">
              <i class="pi pi-plus-circle text-warning text-xs"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-foreground">
                <span class="font-semibold">Gabriel Silva</span> criou
                <span class="font-medium">"Configurar pipeline CI/CD"</span> em Core API
              </p>
              <p class="text-xs text-muted mt-0.5">Há 3 horas</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
              <i class="pi pi-user-plus text-secondary text-xs"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-foreground">
                <span class="font-semibold">Ana Oliveira</span> entrou para o projeto
                <span class="font-medium">TaskFy Mobile</span>
              </p>
              <p class="text-xs text-muted mt-0.5">Ontem</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
              <i class="pi pi-exclamation-circle text-danger text-xs"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-foreground">
                Prazo de <span class="font-medium">"Otimizar queries do SQL"</span> está próximo do fim
              </p>
              <p class="text-xs text-muted mt-0.5">2 dias atrás</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
