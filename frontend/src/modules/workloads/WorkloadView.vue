<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useWorkload } from '@/composables/useWorkload'

const selectedTeamId = ref<string | undefined>('')

const { teams, isTeamsLoading, members, projects, stats, isLoading, isError, refetchMembers } =
  useWorkload(selectedTeamId)

const avatarColors = [
  'bg-primary',
  'bg-secondary',
  'bg-warning',
  'bg-success',
  'bg-danger',
  'bg-primary/70',
  'bg-secondary/70',
  'bg-warning/70',
]

const avatarColorMap = computed(() => {
  const map: Record<string, string | undefined> = {}
  const list = members.value ?? []
  list.forEach((m, i) => {
    map[m.id] = avatarColors[i % avatarColors.length]
  })
  return map
})

const avatarLetters = (name: string) => {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]
  const last = parts[parts.length - 1]
  if (first && last) {
    return (first.charAt(0) + last.charAt(0)).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

const projectColorClass = (completed: number, total: number) => {
  const pct = total === 0 ? 0 : completed / total
  if (pct >= 0.7) return 'bg-success'
  if (pct >= 0.4) return 'bg-warning'
  return 'bg-primary'
}

const projectTextColor = (completed: number, total: number) => {
  const pct = total === 0 ? 0 : completed / total
  if (pct >= 0.7) return 'text-success'
  if (pct >= 0.4) return 'text-warning'
  return 'text-primary'
}

const isOverdue = (project: { deadlineStatus: string }) => project.deadlineStatus === 'Atrasado'

watch(teams, (val) => {
  if (val && val.length > 0 && !selectedTeamId.value) {
    selectedTeamId.value = val[0]!.id
  }
}, { immediate: true })
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground flex items-center gap-2">
          <i class="pi pi-chart-bar text-primary"></i>
          Carga de Trabalho
        </h1>
        <p class="text-sm text-muted mt-1">Visão geral da distribuição de tarefas entre equipes e membros</p>
      </div>

      <div v-if="teams && teams.length > 1" class="flex items-center gap-2">
        <i class="pi pi-users text-muted text-sm"></i>
        <select
          v-model="selectedTeamId"
          class="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
        </select>
      </div>
    </div>

    <div v-if="teams && teams.length === 0 && !isTeamsLoading" class="flex flex-col items-center justify-center py-16 bg-surface border border-border rounded-xl">
      <div class="w-14 h-14 rounded-2xl bg-background flex items-center justify-center">
        <i class="pi pi-users text-2xl text-muted"></i>
      </div>
      <h2 class="mt-4 text-lg font-semibold text-foreground">Nenhuma equipe encontrada</h2>
      <p class="mt-1 text-sm text-muted text-center max-w-md">
        Crie ou entre em uma equipe para visualizar a carga de trabalho.
      </p>
    </div>

    <template v-else-if="isLoading">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-surface border border-border rounded-xl animate-pulse"></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="i in 2" :key="i" class="h-80 bg-surface border border-border rounded-xl animate-pulse"></div>
      </div>
    </template>

    <template v-else-if="isError">
      <div class="flex flex-col items-center justify-center py-16 bg-surface border border-border rounded-xl">
        <div class="w-14 h-14 rounded-2xl bg-danger/10 flex items-center justify-center">
          <i class="pi pi-exclamation-triangle text-2xl text-danger"></i>
        </div>
        <h2 class="mt-4 text-lg font-semibold text-foreground">Erro ao carregar dados</h2>
        <button
          @click="() => refetchMembers()"
          class="mt-4 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all"
        >
          Tentar novamente
        </button>
      </div>
    </template>

    <template v-else>
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

          <div v-if="!members || members.length === 0" class="flex flex-col items-center justify-center py-8 text-muted text-center">
            <i class="pi pi-inbox text-3xl mb-2"></i>
            <p class="text-sm font-medium">Nenhum membro com tarefas nesta equipe.</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="member in members" :key="member.id">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div
                    class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    :class="avatarColorMap[member.id] ?? 'bg-primary'"
                  >
                    {{ avatarLetters(member.name) }}
                  </div>
                  <span class="text-sm font-medium text-foreground">{{ member.name }}</span>
                </div>
                <span class="text-xs font-semibold text-muted">{{ member.completedTasks }}/{{ member.totalTasks }} concluídas</span>
              </div>

              <div class="w-full h-2 bg-background rounded-full overflow-hidden flex">
                <div
                  class="h-full bg-success transition-all duration-500"
                  :style="{ width: member.totalTasks > 0 ? (member.completedTasks / member.totalTasks) * 100 + '%' : '0%' }"
                ></div>
                <div
                  class="h-full bg-warning transition-all duration-500"
                  :style="{ width: member.totalTasks > 0 ? (member.inProgressTasks / member.totalTasks) * 100 + '%' : '0%' }"
                ></div>
                <div
                  class="h-full bg-muted/30 transition-all duration-500"
                  :style="{ width: member.totalTasks > 0 ? (member.pendingTasks / member.totalTasks) * 100 + '%' : '0%' }"
                ></div>
              </div>

              <div class="flex items-center gap-4 mt-1.5 text-[10px] text-muted">
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-success inline-block"></span> {{ member.completedTasks }} concluídas</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-warning inline-block"></span> {{ member.inProgressTasks }} andamento</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-muted/30 inline-block"></span> {{ member.pendingTasks }} pendentes</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <h2 class="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider mb-5">
            <i class="pi pi-folder text-secondary"></i>
            Progresso por Projeto
          </h2>

          <div v-if="!projects || projects.length === 0" class="flex flex-col items-center justify-center py-8 text-muted text-center">
            <i class="pi pi-folder-open text-3xl mb-2"></i>
            <p class="text-sm font-medium">Nenhum projeto encontrado.</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="project in projects" :key="project.id">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-foreground">{{ project.title }}</span>
                  <span
                    v-if="isOverdue(project)"
                    class="text-[10px] px-1.5 py-0.5 rounded bg-danger/10 text-danger font-semibold"
                  >
                    Atrasado
                  </span>
                </div>
                <span class="text-xs text-muted">{{ project.completedTasks }}/{{ project.totalTasks }} tarefas</span>
              </div>

              <div class="w-full h-2.5 bg-background rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="projectColorClass(project.completedTasks, project.totalTasks)"
                  :style="{ width: project.progress + '%' }"
                ></div>
              </div>

              <div class="flex items-center justify-between mt-1">
                <span class="text-[10px] text-muted flex items-center gap-1">
                  <i class="pi pi-calendar"></i> Prazo: {{ formatDate(project.deadline) }}
                </span>
                <span class="text-[10px] font-semibold" :class="projectTextColor(project.completedTasks, project.totalTasks)">
                  {{ project.progress }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
