<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/task'
import { taskService, type Task } from '@/services/taskService'
import CreateTaskModal from '@/modules/tasks/components/createTaskModal.vue'

const props = defineProps<{ task: Task }>()
const emit = defineEmits(['subtask-created'])
const taskStore = useTaskStore()

const actionLoading = ref(false)
const showSubtasks = ref(false)
const subtasks = ref<Task[]>([])
const subtasksLoading = ref(false)
const showCreateSubtask = ref(false)
const showDelayModal = ref(false)
const delayReason = ref('')
const delaySending = ref(false)
const showDeleteConfirm = ref(false)
const deleteLoading = ref(false)

const isExpired = computed(() => {
  if (props.task.status === 'completed') return false
  return new Date(props.task.deadline) < new Date()
})

const subtaskProgress = computed(() => {
  if (subtasks.value.length === 0) return 0
  const completed = subtasks.value.filter((s) => s.status === 'completed').length
  return Math.round((completed / subtasks.value.length) * 100)
})

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

const toggleSubtasks = async () => {
  showSubtasks.value = !showSubtasks.value
  if (showSubtasks.value && subtasks.value.length === 0) {
    subtasksLoading.value = true
    subtasks.value = await taskStore.loadSubtasks(props.task.id)
    subtasksLoading.value = false
  }
}

const handleSubtaskCreated = () => {
  showCreateSubtask.value = false
  toggleSubtasks()
  emit('subtask-created')
}

const handleToggleSubtask = async (sub: Task) => {
  try {
    if (sub.status === 'completed') {
      await taskService.updateTask(sub.id, { status: 'not_started' })
      sub.status = 'not_started'
    } else {
      await taskService.completeTask(sub.id)
      sub.status = 'completed'
    }
  } catch (error: any) {
    alert(error.response?.data?.message || 'Erro ao alternar subtarefa.')
  }
}

const handleReportDelay = async () => {
  delaySending.value = true
  try {
    await taskStore.reportDelay(props.task.id, delayReason.value || undefined)
    showDelayModal.value = false
    delayReason.value = ''
    alert('Alerta de atraso enviado ao supervisor com sucesso!')
  } catch (error: any) {
    alert(error.response?.data?.message || 'Erro ao reportar atraso.')
  } finally {
    delaySending.value = false
  }
}

const handleDelete = async () => {
  deleteLoading.value = true
  try {
    await taskStore.removeTask(props.task.id)
    showDeleteConfirm.value = false
  } catch (error: any) {
    alert(error.response?.data?.message || 'Erro ao excluir tarefa.')
    deleteLoading.value = false
  }
}


</script>

<template>
  <div
    class="bg-surface border border-border rounded-xl shadow-sm transition-all duration-300"
    :class="{ 'opacity-60 bg-background': task.status === 'completed' }"
  >
    <div class="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <button
            v-if="!task.parentTaskId"
            @click="toggleSubtasks"
            class="p-0.5 text-muted hover:text-foreground transition-colors"
            title="Ver subtarefas"
          >
            <i
              class="pi text-xs"
              :class="showSubtasks ? 'pi-chevron-down' : 'pi-chevron-right'"
            ></i>
          </button>
          <i
            class="pi pi-check-circle text-xs"
            :class="task.status === 'completed' ? 'text-success' : 'text-muted'"
          ></i>
          <h4
            class="font-semibold text-foreground text-sm"
            :class="{ 'line-through text-muted': task.status === 'completed' }"
          >
            {{ task.title }}
          </h4>
          <span
            v-if="task.parentTaskId"
            class="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0"
          >
            <i class="pi pi-sitemap text-[9px]"></i>
            Subtarefa
          </span>
          <span
            v-if="isExpired"
            class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-danger/10 text-danger border border-danger/20"
          >
            ATRASADA
          </span>
        </div>
        <p class="text-xs text-muted line-clamp-2">{{ task.description || 'Sem descrição' }}</p>
        <div class="flex items-center gap-3 mt-1.5 text-[10px] text-muted">
          <span class="flex items-center gap-1">
            <i class="pi pi-calendar"></i>
            {{ new Date(task.deadline).toLocaleDateString('pt-BR') }}
          </span>
          <span
            v-if="!task.parentTaskId"
            class="flex items-center gap-1 cursor-pointer hover:text-primary"
            @click="toggleSubtasks"
          >
            <i class="pi pi-sitemap"></i>
            Subtarefas
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0 flex-wrap" v-if="task.status !== 'completed'">
        <button
          @click="showCreateSubtask = true"
          class="flex items-center gap-1 px-2 py-1.5 border border-border rounded-lg text-[10px] font-medium text-muted hover:text-foreground hover:border-primary transition-all"
          title="Adicionar subtarefa"
        >
          <i class="pi pi-plus-circle text-xs"></i>
          <span class="hidden sm:inline">SUBTAREFA</span>
        </button>

        <button
          @click="showDelayModal = true"
          class="flex items-center gap-1 px-2 py-1.5 border border-warning/30 rounded-lg text-[10px] font-medium text-warning hover:bg-warning/5 transition-all"
          title="Reportar possível atraso"
        >
          <i class="pi pi-clock text-xs"></i>
          <span class="hidden sm:inline">ALERTAR ATRASO</span>
        </button>

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

        <button
          @click="showDeleteConfirm = true"
          class="flex items-center gap-1 px-2 py-1.5 text-muted hover:text-danger transition-colors"
          title="Excluir tarefa"
        >
          <i class="pi pi-trash text-xs"></i>
        </button>
      </div>

      <div
        v-else
        class="text-xs font-bold text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded-md shrink-0"
      >
        <i class="pi pi-verified"></i>
        <span>CONCLUÍDA</span>
      </div>
    </div>

    <div v-if="showSubtasks && !task.parentTaskId" class="border-t border-border px-4 pb-4 pt-2">
      <div v-if="subtasksLoading" class="text-xs text-muted py-2 text-center">
        <i class="pi pi-spinner animate-spin"></i> Carregando subtarefas...
      </div>
      <div v-else-if="subtasks.length === 0" class="text-xs text-muted py-2 text-center">
        Nenhuma subtarefa ainda.
      </div>
      <div v-else class="space-y-2">
        <div class="flex items-center gap-2 mb-2">
          <div class="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all duration-500"
              :style="{ width: subtaskProgress + '%' }"
            ></div>
          </div>
          <span class="text-[10px] text-muted font-medium">{{ subtaskProgress }}%</span>
        </div>
        <div
          v-for="sub in subtasks"
          :key="sub.id"
          @click="handleToggleSubtask(sub)"
          class="flex items-center justify-between gap-2 px-3 py-2 bg-background rounded-lg border border-border cursor-pointer hover:bg-surface transition-colors"
        >
          <div class="flex items-center gap-2 min-w-0">
            <i
              class="pi text-xs shrink-0"
              :class="sub.status === 'completed' ? 'pi-check-circle text-success' : 'pi-circle text-muted'"
            ></i>
            <span
              class="text-xs font-medium"
              :class="sub.status === 'completed' ? 'line-through text-muted' : 'text-foreground'"
            >
              {{ sub.title }}
            </span>
          </div>
          <span
            v-if="sub.status === 'completed'"
            class="text-[10px] font-bold text-success shrink-0"
          >
            FEITO
          </span>
        </div>
      </div>
    </div>

    <CreateTaskModal
      v-if="showCreateSubtask"
      :project-id="task.projectId"
      :parent-task-id="task.id"
      @close="showCreateSubtask = false"
      @created="handleSubtaskCreated"
    />

    <div
      v-if="showDelayModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm"
      @click.self="showDelayModal = false"
    >
      <div class="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div class="p-5 border-b border-border">
          <h3 class="text-base font-bold text-foreground flex items-center gap-2">
            <i class="pi pi-clock text-warning"></i>
            Reportar Atraso
          </h3>
          <p class="text-xs text-muted mt-1">
            Informe ao supervisor sobre um possível atraso nesta tarefa.
          </p>
        </div>
        <div class="p-5">
          <label class="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            Motivo (opcional)
          </label>
          <textarea
            v-model="delayReason"
            rows="3"
            placeholder="Descreva o motivo do possível atraso..."
            class="w-full px-3 py-2 border border-border rounded-xl bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          ></textarea>
          <div class="flex items-center justify-end gap-2 mt-4">
            <button
              @click="showDelayModal = false"
              class="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="handleReportDelay"
              :disabled="delaySending"
              class="px-4 py-2 bg-warning hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <i v-if="delaySending" class="pi pi-spinner animate-spin"></i>
              <span>{{ delaySending ? 'Enviando...' : 'Enviar Alerta' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
        <div class="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto">
          <i class="pi pi-exclamation-triangle text-danger text-xl"></i>
        </div>
        <div>
          <h3 class="text-base font-bold text-foreground">Excluir Tarefa</h3>
          <p class="text-xs text-muted mt-1">
            Tem certeza? Esta ação não pode ser desfeita.
          </p>
        </div>
        <div class="flex items-center justify-center gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleDelete"
            :disabled="deleteLoading"
            class="px-4 py-2 bg-danger hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <i v-if="deleteLoading" class="pi pi-spinner animate-spin"></i>
            <span>{{ deleteLoading ? 'Excluindo...' : 'Sim, Excluir' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
