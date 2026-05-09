<script setup lang="ts">
import { ref } from 'vue'
import { taskService } from '@/services/taskService'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  projectId: string
}>()

const emit = defineEmits(['close', 'created'])
const authStore = useAuthStore()

const title = ref('')
const description = ref('')
const deadline = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (!title.value || !deadline.value) {
    errorMessage.value = 'Preencha o título e o prazo final.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // O PAYLOAD EXATO DO INSOMNIA (Passo 7)
    const newTask = await taskService.createTask({
      title: title.value,
      description: description.value,
      deadline: new Date(deadline.value).toISOString(),
      projectId: props.projectId,
      assigneeIds: authStore.user ? [authStore.user.id] : [],
    })

    emit('created', newTask)
    emit('close')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao criar a tarefa.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
  >
    <div
      class="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
    >
      <div class="p-6 border-b border-border flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i class="pi pi-check-square text-primary"></i>
          Nova Tarefa
        </h2>
        <button
          @click="$emit('close')"
          class="p-1 text-muted hover:text-slate-800 transition-colors"
        >
          <i class="pi pi-times text-lg"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div
          v-if="errorMessage"
          class="p-3 bg-danger/10 text-danger text-xs font-medium rounded-xl flex items-center gap-2"
        >
          <i class="pi pi-exclamation-triangle shrink-0"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >Título *</label
          >
          <input
            v-model="title"
            type="text"
            required
            placeholder="Ex: Subir o container do Postgres"
            class="w-full px-3 py-2 border border-border rounded-xl bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >Descrição</label
          >
          <textarea
            v-model="description"
            rows="3"
            placeholder="Detalhes da execução..."
            class="w-full px-3 py-2 border border-border rounded-xl bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >Prazo Final *</label
          >
          <input
            v-model="deadline"
            type="date"
            required
            class="w-full px-3 py-2 border border-border rounded-xl bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700"
          />
        </div>

        <div
          class="p-2.5 bg-background border border-border rounded-xl flex items-center justify-between text-xs"
        >
          <span class="text-muted font-medium">Encarregado:</span>
          <span class="font-semibold text-primary flex items-center gap-1">
            <i class="pi pi-user text-[10px]"></i>
            {{ authStore.user?.name }} (Você)
          </span>
        </div>

        <div class="pt-4 border-t border-border flex items-center justify-end gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-muted hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <i v-if="loading" class="pi pi-spinner animate-spin"></i>
            <span>{{ loading ? 'Salvando...' : 'Criar Tarefa' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
