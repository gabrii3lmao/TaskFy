<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

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

const dashboard = ref<DashboardData>({
  atrasadas: [],
  venceHoje: [],
  proximas: [],
  concluidas: [],
})

const loading = ref(true)
const errorMessage = ref('')

// Função auxiliar para formatar a data (Ex: 15/05/2026)
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

const fetchDashboard = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/tasks/dashboard')
    dashboard.value = response.data.data
  } catch (error: any) {
    errorMessage.value = 'Não foi possível carregar sua agenda. Tente novamente mais tarde.'
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
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <i class="pi pi-calendar text-primary text-xl"></i>
          Agenda de Tarefas
        </h1>
        <p class="text-sm text-muted mt-1">Acompanhe seus prazos e prioridades do dia</p>
      </div>

      <button
        @click="fetchDashboard"
        class="p-2 text-muted hover:text-primary transition-colors rounded-lg border border-border bg-surface hover:border-primary/30"
        title="Atualizar Agenda"
      >
        <i class="pi pi-refresh" :class="{ 'animate-spin': loading }"></i>
      </button>
    </div>

    <div
      v-if="errorMessage"
      class="p-4 bg-danger/10 border border-danger/20 text-danger rounded-lg flex items-center gap-3"
    >
      <i class="pi pi-exclamation-triangle text-lg"></i>
      <p class="text-sm font-medium">{{ errorMessage }}</p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface border border-border rounded-xl p-5 space-y-4 animate-pulse"
      >
        <div class="h-5 bg-slate-200 rounded w-1/3"></div>
        <div class="space-y-2">
          <div class="h-16 bg-slate-100 rounded-lg"></div>
          <div class="h-16 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-surface border border-border rounded-xl p-5 flex flex-col shadow-sm">
        <div class="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h2
            class="font-semibold text-danger flex items-center gap-2 text-sm uppercase tracking-wider"
          >
            <i class="pi pi-clock"></i> Atrasadas
          </h2>
          <span class="bg-danger/10 text-danger font-bold px-2 py-0.5 rounded-full text-xs">
            {{ dashboard.atrasadas.length }}
          </span>
        </div>

        <div
          v-if="dashboard.atrasadas.length === 0"
          class="flex-1 flex flex-col items-center justify-center py-8 text-muted text-center"
        >
          <i class="pi pi-check-circle text-3xl mb-2 text-success/50"></i>
          <p class="text-sm font-medium">Nenhuma tarefa atrasada!</p>
        </div>

        <div v-else class="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
          <div
            v-for="task in dashboard.atrasadas"
            :key="task.id"
            class="p-3.5 rounded-lg border border-danger/20 bg-danger/5 hover:bg-danger/10 transition-colors cursor-pointer group"
          >
            <div class="text-xs text-muted font-medium mb-1 flex items-center gap-1">
              <i class="pi pi-folder text-[10px]"></i> {{ task.projectName }}
            </div>
            <h3
              class="font-medium text-slate-800 text-sm group-hover:text-danger transition-colors"
            >
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

      <div
        class="bg-surface border border-border rounded-xl p-5 flex flex-col shadow-sm border-t-4 border-t-warning"
      >
        <div class="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h2
            class="font-semibold text-warning flex items-center gap-2 text-sm uppercase tracking-wider"
          >
            <i class="pi pi-exclamation-circle"></i> Tarefas do Dia
          </h2>
          <span class="bg-warning/10 text-warning font-bold px-2 py-0.5 rounded-full text-xs">
            {{ dashboard.venceHoje.length }}
          </span>
        </div>

        <div
          v-if="dashboard.venceHoje.length === 0"
          class="flex-1 flex flex-col items-center justify-center py-8 text-muted text-center"
        >
          <i class="pi pi-calendar text-3xl mb-2"></i>
          <p class="text-sm font-medium">Seu dia está livre de prazos finais.</p>
        </div>

        <div v-else class="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
          <div
            v-for="task in dashboard.venceHoje"
            :key="task.id"
            class="p-3.5 rounded-lg border border-warning/30 bg-warning/5 hover:bg-warning/10 transition-colors cursor-pointer group"
          >
            <div class="text-xs text-muted font-medium mb-1 flex items-center gap-1">
              <i class="pi pi-folder text-[10px]"></i> {{ task.projectName }}
            </div>
            <h3
              class="font-medium text-slate-800 text-sm group-hover:text-warning transition-colors"
            >
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
          <h2
            class="font-semibold text-primary flex items-center gap-2 text-sm uppercase tracking-wider"
          >
            <i class="pi pi-calendar-plus"></i> Próximos Prazos
          </h2>
          <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full text-xs">
            {{ dashboard.proximas.length }}
          </span>
        </div>

        <div
          v-if="dashboard.proximas.length === 0"
          class="flex-1 flex flex-col items-center justify-center py-8 text-muted text-center"
        >
          <i class="pi pi-inbox text-3xl mb-2"></i>
          <p class="text-sm font-medium">Nenhum prazo futuro agendado.</p>
        </div>

        <div v-else class="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
          <div
            v-for="task in dashboard.proximas"
            :key="task.id"
            class="p-3.5 rounded-lg border border-border bg-background hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div class="text-xs text-muted font-medium mb-1 flex items-center gap-1">
              <i class="pi pi-folder text-[10px]"></i> {{ task.projectName }}
            </div>
            <h3
              class="font-medium text-slate-800 text-sm group-hover:text-primary transition-colors"
            >
              {{ task.title }}
            </h3>
            <div class="mt-2 flex items-center justify-between text-xs font-medium text-muted">
              <span class="flex items-center gap-1">
                <i class="pi pi-calendar"></i> {{ formatDate(task.deadline) }}
              </span>
              <span class="px-2 py-0.5 bg-primary/10 text-primary rounded font-semibold text-[10px]"
                >Em dia</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!loading && dashboard.concluidas.length > 0"
      class="bg-surface border border-border rounded-xl p-5 shadow-sm"
    >
      <h2
        class="font-semibold text-success flex items-center gap-2 text-sm uppercase tracking-wider mb-4"
      >
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
            <h4 class="text-sm font-medium text-slate-800 truncate line-through opacity-80">
              {{ task.title }}
            </h4>
          </div>
          <i class="pi pi-check text-success font-bold"></i>
        </div>
      </div>
    </div>
  </div>
</template>
