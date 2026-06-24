<script setup lang="ts">
import { ref } from 'vue'
import { useProjects } from '@/composables/useProjects'
import { useAuthStore } from '@/stores/auth'
import CreateProjectModal from './components/CreateProjectModal.vue'

const authStore = useAuthStore()
const { projects, isLoading, isError, error, refetch, deleteProject } = useProjects()

const showCreateModal = ref(false)

const formatDate = (dateString: string) => {
  if (!dateString) return ''

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

const handleDeleteProject = async (projectId: string, projectTitle: string) => {
  const confirmed = confirm(
    `Tem certeza que deseja excluir o projeto "${projectTitle}"? Todas as tarefas vinculadas serão apagadas.`,
  )

  if (!confirmed) return

  try {
    await deleteProject(projectId)
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { message?: string } } }
    alert(axiosError.response?.data?.message || 'Erro ao excluir o projeto.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground flex items-center gap-2">
          <i class="pi pi-folder-open text-primary"></i>
          Projetos Ativos
        </h1>

        <p class="text-sm text-muted mt-1">
          Acompanhe o progresso e o status de entrega de cada iniciativa
        </p>
      </div>

      <button
        class="px-4 py-2 bg-primary hover:bg-secondary text-white font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto"
        @click="showCreateModal = true"
      >
        <i class="pi pi-plus"></i>
        <span>Novo Projeto</span>
      </button>
    </div>

    <div
      v-if="isError"
      class="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl flex items-center gap-2"
    >
      <i class="pi pi-exclamation-triangle"></i>
      <span class="text-sm font-medium">{{ error instanceof Error ? error.message : 'Erro ao carregar os projetos. Tente novamente.' }}</span>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface border border-border rounded-2xl p-6 space-y-4 animate-pulse"
      >
        <div class="h-6 bg-background rounded w-2/3"></div>
        <div class="h-4 bg-background rounded w-full"></div>
        <div class="h-2 bg-background rounded-full w-full mt-6"></div>
      </div>
    </div>

    <div
      v-else-if="!projects || projects.length === 0"
      class="bg-surface border border-border rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm"
    >
      <div class="space-y-3">
        <i class="pi pi-folder text-5xl text-muted"></i>
        <h3 class="text-lg font-semibold text-foreground">Nenhum projeto encontrado</h3>
        <p class="text-sm text-muted">
          Você ainda não faz parte de nenhuma equipe com projetos ativos ou nenhum projeto foi
          cadastrado.
        </p>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative group"
      >
        <div
          v-if="project.supervisorId === authStore.user?.id"
          class="absolute top-4 right-4 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
        >
          Supervisor
        </div>

        <div>
          <h3 class="text-lg font-semibold text-foreground max-w-[calc(100%-5rem)] truncate" :title="project.title">
            {{ project.title }}
          </h3>

          <p class="text-sm text-muted mt-2 line-clamp-2" :title="project.description">
            {{ project.description || 'Sem descrição cadastrada.' }}
          </p>

          <div class="mt-4 flex items-center gap-2 text-xs font-medium">
            <i class="pi pi-calendar text-muted"></i>
            <span class="text-muted">Prazo: {{ formatDate(project.deadline) }}</span>
            <span
              :class="[
                'ml-auto px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide',
                project.deadlineStatus === 'Em dia'
                  ? 'bg-success/10 text-success'
                  : 'bg-danger/10 text-danger',
              ]"
            >
              {{ project.deadlineStatus }}
            </span>
          </div>

          <div class="mt-6 space-y-2">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-muted">Progresso</span>
              <span class="text-primary">{{ project.progress }}%</span>
            </div>

            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full transition-all duration-500"
                :style="{ width: `${project.progress}%` }"
              ></div>
            </div>

            <div class="text-[11px] text-muted text-right">
              {{ project.completedTasks }} de {{ project.totalTasks }} tarefas concluídas
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <button
            class="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            @click="$router.push({ name: 'ProjectDetails', params: { id: project.id } })"
          >
            <span>Ver tarefas</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </button>

          <button
            v-if="project.supervisorId === authStore.user?.id"
            @click="handleDeleteProject(project.id, project.title)"
            class="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Excluir Projeto"
          >
            <i class="pi pi-trash text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <CreateProjectModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="() => refetch()"
    />
  </div>
</template>
