<script setup lang="ts">
import { ref, computed } from 'vue'

interface MockTask {
  id: string
  title: string
  description: string
  status: 'completed' | 'in_progress' | 'not_started'
  deadline: string
  projectName: string
  assignee: string
}

const statusFilter = ref<string>('all')
const projectFilter = ref<string>('all')

const projects = ['Atlas', 'Finance', 'TaskFy Mobile', 'Core API']

const tasks = ref<MockTask[]>([
  {
    id: '1',
    title: 'Implementar autenticação JWT',
    description: 'Criar middleware de autenticação com refresh token',
    status: 'completed',
    deadline: '2026-06-10',
    projectName: 'Atlas',
    assignee: 'Marina Costa',
  },
  {
    id: '2',
    title: 'Criar dashboard financeiro',
    description: 'Dashboard com gráficos de receita e despesa',
    status: 'in_progress',
    deadline: '2026-06-20',
    projectName: 'Finance',
    assignee: 'Rafael Lima',
  },
  {
    id: '3',
    title: 'Refatorar módulo de usuários',
    description: 'Separar responsabilidades do service atual',
    status: 'not_started',
    deadline: '2026-06-25',
    projectName: 'Atlas',
    assignee: 'Gabriel Silva',
  },
  {
    id: '4',
    title: 'Configurar pipeline CI/CD',
    description: 'GitHub Actions com testes e deploy automático',
    status: 'in_progress',
    deadline: '2026-06-18',
    projectName: 'Core API',
    assignee: 'Marina Costa',
  },
  {
    id: '5',
    title: 'Criar tela de notificações',
    description: 'Listagem com filtros e marcador de lidas',
    status: 'completed',
    deadline: '2026-06-05',
    projectName: 'TaskFy Mobile',
    assignee: 'Rafael Lima',
  },
  {
    id: '6',
    title: 'Integrar gateway de pagamento',
    description: 'Stripe com webhooks para confirmação',
    status: 'not_started',
    deadline: '2026-07-01',
    projectName: 'Finance',
    assignee: 'Gabriel Silva',
  },
  {
    id: '7',
    title: 'Otimizar queries do Dashboard',
    description: 'Reduzir tempo de resposta das consultas SQL',
    status: 'in_progress',
    deadline: '2026-06-15',
    projectName: 'Core API',
    assignee: 'Marina Costa',
  },
  {
    id: '8',
    title: 'Implementar modo offline',
    description: 'Service worker e cache de dados locais',
    status: 'not_started',
    deadline: '2026-07-10',
    projectName: 'TaskFy Mobile',
    assignee: 'Rafael Lima',
  },
])

const filteredTasks = computed(() => {
  return tasks.value.filter((t) => {
    if (statusFilter.value !== 'all' && t.status !== statusFilter.value) return false
    if (projectFilter.value !== 'all' && t.projectName !== projectFilter.value) return false
    return true
  })
})

const statusBadge = (status: string) => {
  const notStarted = { class: 'bg-muted/10 text-muted border-border', icon: 'pi-circle', label: 'Não iniciada' }
  const map: Record<string, { class: string; icon: string; label: string }> = {
    completed: { class: 'bg-success/10 text-success border-success/20', icon: 'pi-check-circle', label: 'Concluída' },
    in_progress: { class: 'bg-primary/10 text-primary border-primary/20', icon: 'pi-spinner', label: 'Em andamento' },
    not_started: notStarted,
  }
  return map[status] ?? notStarted
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00')
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-foreground flex items-center gap-2">
        <i class="pi pi-check-square text-primary"></i>
        Todas as Tarefas
      </h1>
      <p class="text-sm text-muted mt-1">Visão geral de todas as tarefas entre os projetos</p>
    </div>

    <div class="flex flex-wrap items-center gap-3 p-3 bg-surface border border-border rounded-xl">
      <div class="flex items-center gap-2 text-xs text-muted">
        <i class="pi pi-filter"></i>
        <span class="font-medium">Filtros:</span>
      </div>

      <select
        v-model="statusFilter"
        class="px-3 py-1.5 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="all">Todos os status</option>
        <option value="not_started">Não iniciadas</option>
        <option value="in_progress">Em andamento</option>
        <option value="completed">Concluídas</option>
      </select>

      <select
        v-model="projectFilter"
        class="px-3 py-1.5 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="all">Todos os projetos</option>
        <option v-for="p in projects" :key="p" :value="p">{{ p }}</option>
      </select>

      <span class="text-xs text-muted ml-auto">
        {{ filteredTasks.length }} de {{ tasks.length }} tarefas
      </span>
    </div>

    <div v-if="filteredTasks.length === 0" class="bg-surface border border-dashed border-border rounded-2xl p-12 text-center space-y-3">
      <i class="pi pi-inbox text-4xl text-muted/50"></i>
      <h3 class="text-lg font-semibold text-foreground">Nenhuma tarefa encontrada</h3>
      <p class="text-sm text-muted">Tente ajustar os filtros para ver mais resultados.</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:shadow-subtle"
        :class="{ 'opacity-60': task.status === 'completed' }"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1"
              :class="statusBadge(task.status).class"
            >
              <i class="pi text-[10px]" :class="statusBadge(task.status).icon"></i>
              {{ statusBadge(task.status).label }}
            </span>
            <span class="text-xs text-muted font-medium flex items-center gap-1">
              <i class="pi pi-folder text-[10px]"></i>
              {{ task.projectName }}
            </span>
          </div>
          <h4
            class="font-semibold text-foreground text-sm mt-1"
            :class="{ 'line-through text-muted': task.status === 'completed' }"
          >
            {{ task.title }}
          </h4>
          <p class="text-xs text-muted mt-0.5 line-clamp-1">{{ task.description }}</p>
        </div>

        <div class="flex items-center gap-4 shrink-0">
          <div class="text-right hidden sm:block">
            <p class="text-xs text-muted">Prazo</p>
            <p
              class="text-xs font-semibold"
              :class="task.status !== 'completed' && new Date(task.deadline + 'T00:00:00') < new Date() ? 'text-danger' : 'text-foreground'"
            >
              {{ formatDate(task.deadline) }}
            </p>
          </div>
          <div class="text-right hidden sm:block">
            <p class="text-xs text-muted">Responsável</p>
            <p class="text-xs font-semibold text-foreground">{{ task.assignee }}</p>
          </div>
        </div>

        <div class="sm:hidden flex items-center gap-4 text-xs text-muted border-t border-border pt-2 mt-2">
          <span class="flex items-center gap-1"><i class="pi pi-calendar"></i> {{ formatDate(task.deadline) }}</span>
          <span class="flex items-center gap-1"><i class="pi pi-user"></i> {{ task.assignee }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
