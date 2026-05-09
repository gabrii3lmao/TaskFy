<script setup lang="ts">
import { ref } from 'vue'
import { teamService } from '@/services/teamService'

const emit = defineEmits(['close', 'created'])

const name = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (!name.value.trim()) {
    errorMessage.value = 'O nome da equipe é obrigatório.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // Usando o nosso novo Service limpo!
    const newTeam = await teamService.createTeam(name.value)

    // Como criamos, o backend nos coloca automaticamente como 'admin'
    emit('created', { ...newTeam, role: 'admin' })
    emit('close')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao criar a equipe.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
  >
    <div
      class="bg-surface border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
    >
      <div class="p-6 border-b border-border flex items-center justify-between bg-background/50">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i class="pi pi-users text-primary"></i>
          Nova Equipe
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
          class="p-3 bg-danger/10 text-danger text-xs font-medium rounded-lg flex items-center gap-2"
        >
          <i class="pi pi-exclamation-triangle shrink-0"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >Nome da Equipe *</label
          >
          <input
            v-model="name"
            type="text"
            required
            placeholder="Ex: Desenvolvedores Backend"
            class="w-full px-3 py-2 border border-border rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
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
            class="px-4 py-2 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <i v-if="loading" class="pi pi-spinner animate-spin"></i>
            <span>{{ loading ? 'Criando...' : 'Criar Equipe' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
