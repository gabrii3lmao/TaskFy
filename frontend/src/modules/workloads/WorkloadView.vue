<script setup lang="ts">
import { ref } from 'vue'

interface MemberWorkload {
  name: string
  avatar: string
  total: number
  completed: number
  inProgress: number
  pending: number
  color: string
}

interface ProjectOverview {
  name: string
  totalTasks: number
  completed: number
  deadline: string
}

const stats = [
  { label: 'Total de Tarefas', value: 47, icon: 'pi-check-square', color: 'text-primary' },
  { label: 'Concluídas', value: 21, icon: 'pi-check-circle', color: 'text-success' },
  { label: 'Em Andamento', value: 14, icon: 'pi-spinner', color: 'text-warning' },
  { label: 'Atrasadas', value: 5, icon: 'pi-exclamation-triangle', color: 'text-danger' },
]

const members = ref<MemberWorkload[]>([
  { name: 'Marina Costa', avatar: 'MC', total: 12, completed: 5, inProgress: 4, pending: 3, color: 'bg-primary' },
  { name: 'Rafael Lima', avatar: 'RL', total: 10, completed: 6, inProgress: 2, pending: 2, color: 'bg-secondary' },
  { name: 'Gabriel Silva', avatar: 'GS', total: 14, completed: 4, inProgress: 5, pending: 5, color: 'bg-warning' },
  { name: 'Ana Oliveira', avatar: 'AO', total: 7, completed: 4, inProgress: 2, pending: 1, color: 'bg-success' },
  { name: 'Lucas Santos', avatar: 'LS', total: 4, completed: 2, inProgress: 1, pending: 1, color: 'bg-danger' },
])

const projects = ref<ProjectOverview[]>([
  { name: 'Atlas', totalTasks: 14, completed: 7, deadline: '2026-07-15' },
  { name: 'Finance', totalTasks: 10, completed: 4, deadline: '2026-07-01' },
  { name: 'TaskFy Mobile', totalTasks: 8, completed: 3, deadline: '2026-08-01' },
  { name: 'Core API', totalTasks: 15, completed: 7, deadline: '2026-06-30' },
])

const formatDate = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00')
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-foreground flex items-center gap-2">
        <i class="pi pi-chart-bar text-primary"></i>
        Carga de Trabalho
      </h1>
      <p class="text-sm text-muted mt-1">Visão geral da distribuição de tarefas entre equipes e membros</p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm"
      >
        <div class="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
          <i :class="['pi text-lg', stat.icon, stat.color]"></i>
        </div>
        <div>
          <p class="text-2xl font-bold text-foreground">{{ stat.value }}</p>
          <p class="text-xs text-muted">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-surface border border-border rounded-xl p-5 shadow-sm">
        <h2 class="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider mb-5">
          <i class="pi pi-users text-primary"></i>
          Carga por Membro
        </h2>

        <div class="space-y-4">
          <div v-for="member in members" :key="member.name">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  :class="member.color"
                >
                  {{ member.avatar }}
                </div>
                <span class="text-sm font-medium text-foreground">{{ member.name }}</span>
              </div>
              <span class="text-xs font-semibold text-muted">{{ member.completed }}/{{ member.total }} concluídas</span>
            </div>

            <div class="w-full h-2 bg-background rounded-full overflow-hidden flex">
              <div
                class="h-full bg-success transition-all duration-500"
                :style="{ width: (member.completed / member.total) * 100 + '%' }"
              ></div>
              <div
                class="h-full bg-warning transition-all duration-500"
                :style="{ width: (member.inProgress / member.total) * 100 + '%' }"
              ></div>
              <div
                class="h-full bg-muted/30 transition-all duration-500"
                :style="{ width: (member.pending / member.total) * 100 + '%' }"
              ></div>
            </div>

            <div class="flex items-center gap-4 mt-1.5 text-[10px] text-muted">
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-success inline-block"></span> {{ member.completed }} concluídas</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-warning inline-block"></span> {{ member.inProgress }} andamento</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-muted/30 inline-block"></span> {{ member.pending }} pendentes</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-surface border border-border rounded-xl p-5 shadow-sm">
        <h2 class="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider mb-5">
          <i class="pi pi-folder text-secondary"></i>
          Progresso por Projeto
        </h2>

        <div class="space-y-4">
          <div v-for="project in projects" :key="project.name">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-foreground">{{ project.name }}</span>
              <span class="text-xs text-muted">{{ project.completed }}/{{ project.totalTasks }} tarefas</span>
            </div>

            <div class="w-full h-2.5 bg-background rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="(project.completed / project.totalTasks) >= 0.7 ? 'bg-success' : (project.completed / project.totalTasks) >= 0.4 ? 'bg-warning' : 'bg-primary'"
                :style="{ width: (project.completed / project.totalTasks) * 100 + '%' }"
              ></div>
            </div>

            <div class="flex items-center justify-between mt-1">
              <span class="text-[10px] text-muted flex items-center gap-1">
                <i class="pi pi-calendar"></i> Prazo: {{ formatDate(project.deadline) }}
              </span>
              <span class="text-[10px] font-semibold" :class="(project.completed / project.totalTasks) >= 0.7 ? 'text-success' : (project.completed / project.totalTasks) >= 0.4 ? 'text-warning' : 'text-primary'">
                {{ Math.round((project.completed / project.totalTasks) * 100) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
