<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMyTasks } from '@/composables/useTasks'

const { tasks, isLoading } = useMyTasks()

const statusFilter = ref<string>('all')
const projectFilter = ref<string>('all')

const myTasksFlat = computed(() => tasks.value ?? [])

const projectNames = computed(() => {
  const names = new Set<string>()
  myTasksFlat.value.forEach((t) => {
    if (t.projectName) names.add(t.projectName)
  })
  return Array.from(names).sort()
})

const filteredTasks = computed(() => {
  return myTasksFlat.value.filter((t) => {
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
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

const isExpired = (task: { status: string; deadline: string }) => {
  if (task.status === 'completed') return false
  return new Date(task.deadline) < new Date()
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
        <option v-for="p in projectNames" :key="p" :value="p">{{ p }}</option>
      </select>

      <span class="text-xs text-muted ml-auto">
        {{ filteredTasks.length }} de {{ myTasksFlat.length }} tarefas
      </span>
    </div>

    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-20 bg-surface border border-border animate-pulse rounded-xl"></div>
    </div>

    <div v-else-if="filteredTasks.length === 0" class="bg-surface border border-dashed border-border rounded-2xl p-12 text-center space-y-3">
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
              {{ task.projectName || 'Sem projeto' }}
            </span>
            <span
              v-if="isExpired(task)"
              class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-danger/10 text-danger border border-danger/20"
            >
              ATRASADA
            </span>
          </div>
            <h4
              class="font-semibold text-foreground text-sm mt-1"
              :class="{ 'line-through text-muted': task.status === 'completed' }"
            >
              <span class="flex items-center gap-2">
                {{ task.title }}
                <span
                  v-if="task.parentTaskId"
                  class="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0"
                >
                  <i class="pi pi-sitemap text-[9px]"></i>
                  Subtarefa
                </span>
              </span>
            </h4>
          <p class="text-xs text-muted mt-0.5 line-clamp-1">{{ task.description || 'Sem descrição' }}</p>
        </div>

        <div class="flex items-center gap-4 shrink-0">
          <div class="text-right hidden sm:block">
            <p class="text-xs text-muted">Prazo</p>
            <p
              class="text-xs font-semibold"
              :class="isExpired(task) ? 'text-danger' : 'text-foreground'"
            >
              {{ formatDate(task.deadline) }}
            </p>
          </div>
        </div>

        <div class="sm:hidden flex items-center gap-4 text-xs text-muted border-t border-border pt-2 mt-2">
          <span class="flex items-center gap-1"><i class="pi pi-calendar"></i> {{ formatDate(task.deadline) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
