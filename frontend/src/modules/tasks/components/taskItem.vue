<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/task'
import type { Task } from '@/services/taskService'

const props = defineProps<{ task: Task }>()
const taskStore = useTaskStore()

const actionLoading = ref(false)

const handleToggleTimer = async () => {
  actionLoading.value = true
  try {
    await taskStore.toggleTimer(props.task.id)
  } catch (error: any) {
    alert(error.response?.data?.message || 'Erro ao processar cronômetro.')
  } finally {
    actionLoading.value = false
  }
}

const handleComplete = async () => {
  if (!confirm('Deseja marcar esta tarefa como concluída?')) return

  actionLoading.value = true
  try {
    await taskStore.completeTask(props.task.id)
  } catch (error: any) {
    alert(error.response?.data?.message || 'Erro ao concluir tarefa.')
  } finally {
    actionLoading.value = false
  }
}
</script>

<template>
  <div
    class="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
    :class="{ 'opacity-60 bg-slate-50': task.status === 'concluida' }"
  >
    <div class="flex-1">
      <div class="flex items-center gap-2 mb-1">
        <i
          class="pi pi-check-circle text-xs"
          :class="task.status === 'concluida' ? 'text-success' : 'text-muted'"
        ></i>
        <h4
          class="font-semibold text-slate-800 text-sm"
          :class="{ 'line-through text-muted': task.status === 'concluida' }"
        >
          {{ task.title }}
        </h4>
      </div>
      <p class="text-xs text-muted line-clamp-2">{{ task.description || 'Sem descrição' }}</p>
    </div>

    <div class="flex items-center gap-2 shrink-0" v-if="task.status !== 'concluida'">
      <button
        @click="handleToggleTimer"
        :disabled="actionLoading"
        class="flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-lg text-xs font-bold transition-all duration-200"
        :class="[
          task.isTimerRunning
            ? 'bg-primary text-white border-primary animate-pulse'
            : 'bg-surface text-primary border-primary hover:bg-primary/5',
        ]"
      >
        <i
          class="pi"
          :class="
            actionLoading ? 'pi-spin pi-spinner' : task.isTimerRunning ? 'pi-stop' : 'pi-play'
          "
        ></i>
        <span>{{ task.isTimerRunning ? 'PARAR' : 'INICIAR' }}</span>
      </button>

      <button
        @click="handleComplete"
        :disabled="actionLoading"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-success hover:bg-green-600 text-white border-2 border-success rounded-lg text-xs font-bold transition-colors shadow-sm"
      >
        <i class="pi pi-check"></i>
        <span>CONCLUIR</span>
      </button>
    </div>

    <div
      v-else
      class="text-xs font-bold text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded-md"
    >
      <i class="pi pi-verified"></i>
      <span>CONCLUÍDA</span>
    </div>
  </div>
</template>
