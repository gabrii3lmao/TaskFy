<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import TaskItem from '@/modules/tasks/components/taskItem.vue'
import CreateTaskModal from '@/modules/tasks/components/createTaskModal.vue'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string

const taskStore = useTaskStore()
const showCreateModal = ref(false)

onMounted(() => {
  taskStore.loadTasks(projectId)
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4">
      <button
        @click="router.push({ name: 'Projects' })"
        class="text-sm text-muted hover:text-primary flex items-center gap-2 transition-colors w-fit"
      >
        <i class="pi pi-arrow-left text-[10px]"></i>
        Voltar para Projetos
      </button>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <i class="pi pi-list text-primary"></i>
            Tarefas do Projeto
          </h2>
          <p class="text-sm text-muted mt-1">Gerencie o cronômetro e a conclusão das atividades</p>
        </div>

        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <i class="pi pi-plus"></i>
          <span>Nova Tarefa</span>
        </button>
      </div>
    </div>

    <div
      v-if="taskStore.errorMessage"
      class="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl flex items-center gap-2"
    >
      <i class="pi pi-exclamation-triangle"></i>
      <span class="text-sm font-medium">{{ taskStore.errorMessage }}</span>
    </div>

    <div v-if="taskStore.loading" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-20 bg-surface border border-border animate-pulse rounded-xl"
      ></div>
    </div>

    <div
      v-else-if="taskStore.tasks.length === 0"
      class="bg-surface border border-dashed border-border rounded-2xl p-12 text-center space-y-3"
    >
      <i class="pi pi-inbox text-4xl text-muted/50"></i>
      <h3 class="text-lg font-semibold text-slate-800">Nenhuma tarefa por aqui</h3>
      <p class="text-sm text-muted">Comece criando a primeira tarefa para este projeto.</p>
      <button
        @click="showCreateModal = true"
        class="text-primary font-bold text-sm hover:underline"
      >
        + Criar minha primeira tarefa
      </button>
    </div>

    <div v-else class="space-y-3">
      <TaskItem v-for="task in taskStore.tasks" :key="task.id" :task="task" />
    </div>

    <CreateTaskModal
      v-if="showCreateModal"
      :project-id="projectId"
      @close="showCreateModal = false"
      @created="(newTask) => taskStore.tasks.unshift(newTask)"
    />
  </div>
</template>
