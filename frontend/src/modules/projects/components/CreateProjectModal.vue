<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const props = defineEmits(['close', 'created'])
const authStore = useAuthStore()

const title = ref('')
const description = ref('')
const deadline = ref('')
const teamId = ref('')

// Controle da busca de supervisor
const searchQuery = ref('')
const searchedUsers = ref<Array<{ id: string; name: string; email: string }>>([])
const selectedSupervisor = ref<{ id: string; name: string } | null>({
  id: authStore.user?.id || '',
  name: `${authStore.user?.name} (Você)`,
})

const teams = ref<Array<{ id: string; name: string }>>([])
const loadingTeams = ref(false)
const searchingUsers = ref(false)
const loadingSubmit = ref(false)
const errorMessage = ref('')

// 1. Busca as equipes para preencher o Select
const fetchTeams = async () => {
  loadingTeams.value = true
  try {
    const response = await api.get('/teams')
    teams.value = response.data.data
    if (teams.value.length > 0) {
      teamId.value = teams.value[0]!.id // Seleciona o primeiro por padrão
    }
  } catch (error) {
    console.error('Erro ao carregar equipes:', error)
    errorMessage.value = 'Não foi possível carregar suas equipes.'
  } finally {
    loadingTeams.value = false
  }
}

// 2. Busca usuários em tempo real para o cargo de supervisor
const handleSearchUser = async () => {
  if (searchQuery.value.length < 2) return

  searchingUsers.value = true
  try {
    const response = await api.get(`/users/search?q=${searchQuery.value}`)
    searchedUsers.value = response.data.data
  } catch (error) {
    console.error(error)
  } finally {
    searchingUsers.value = false
  }
}

const selectSupervisor = (user: { id: string; name: string }) => {
  selectedSupervisor.value = user
  searchQuery.value = ''
  searchedUsers.value = []
}

// 3. Envia o formulário
const handleSubmit = async () => {
  if (!title.value || !deadline.value || !teamId.value || !selectedSupervisor.value) {
    errorMessage.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  loadingSubmit.value = true
  errorMessage.value = ''

  try {
    const response = await api.post('/projects', {
      title: title.value,
      description: description.value,
      deadline: new Date(deadline.value).toISOString(),
      teamId: teamId.value,
      supervisorId: selectedSupervisor.value.id,
    })

    // Avisa a View pai que o projeto foi criado e passa os dados novos
    props('created', response.data.data)
    props('close')
  } catch (error: any) {
    // Aqui a mágica da nossa trava do backend acontece (Erro 400 se não for da equipe)
    errorMessage.value =
      error.response?.data?.message ||
      'Erro ao criar projeto. Verifique as permissões do supervisor.'
  } finally {
    loadingSubmit.value = false
  }
}

onMounted(() => {
  fetchTeams()
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
  >
    <div
      class="bg-surface border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
    >
      <div class="p-6 border-b border-border flex items-center justify-between bg-background/50">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i class="pi pi-folder-plus text-primary"></i>
          Criar Novo Projeto
        </h2>
        <button
          @click="$emit('close')"
          class="p-1 text-muted hover:text-slate-800 transition-colors"
        >
          <i class="pi pi-times text-lg"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 flex-1 overflow-y-auto">
        <div
          v-if="errorMessage"
          class="p-3 bg-danger/10 text-danger text-xs font-medium rounded-lg flex items-center gap-2"
        >
          <i class="pi pi-exclamation-triangle shrink-0"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >Título do Projeto *</label
          >
          <input
            v-model="title"
            type="text"
            required
            placeholder="Ex: Refatoração do App Mobile"
            class="w-full px-3 py-2 border border-border rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >Descrição</label
          >
          <textarea
            v-model="description"
            rows="3"
            placeholder="Objetivos e escopo principal..."
            class="w-full px-3 py-2 border border-border rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
              >Prazo Final *</label
            >
            <input
              v-model="deadline"
              type="date"
              required
              class="w-full px-3 py-2 border border-border rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
              >Equipe Responsável *</label
            >
            <select
              v-model="teamId"
              :disabled="loadingTeams"
              class="w-full px-3 py-2 border border-border rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700"
            >
              <option v-if="loadingTeams" value="">Carregando...</option>
              <option v-for="team in teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="border-t border-border pt-4 mt-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Supervisor do Projeto *
          </label>

          <div
            v-if="selectedSupervisor"
            class="flex items-center justify-between p-2.5 bg-primary/5 border border-primary/20 rounded-lg mb-3"
          >
            <div class="flex items-center gap-2 text-sm text-slate-700 font-medium truncate">
              <i class="pi pi-user-edit text-primary text-xs shrink-0"></i>
              <span class="truncate">{{ selectedSupervisor.name }}</span>
            </div>
            <button
              type="button"
              @click="selectedSupervisor = null"
              class="text-[10px] text-danger hover:underline font-semibold ml-2 shrink-0"
            >
              Trocar
            </button>
          </div>

          <div v-else class="relative">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="handleSearchUser"
                type="text"
                placeholder="Digite o nome para buscar na equipe..."
                class="w-full pl-8 pr-3 py-2 border border-border rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <i class="pi pi-search absolute left-2.5 top-3 text-muted text-xs"></i>
              <i
                v-if="searchingUsers"
                class="pi pi-spinner animate-spin absolute right-2.5 top-3 text-primary text-xs"
              ></i>
            </div>

            <div
              v-if="searchedUsers.length > 0"
              class="absolute left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto"
            >
              <button
                v-for="user in searchedUsers"
                :key="user.id"
                type="button"
                @click="selectSupervisor(user)"
                class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 border-b border-border/50 last:border-0 truncate flex items-center justify-between"
              >
                <span class="font-medium text-slate-700 truncate">{{ user.name }}</span>
                <span class="text-[10px] text-muted ml-2 shrink-0">{{ user.email }}</span>
              </button>
            </div>

            <p class="text-[10px] text-muted mt-1">
              Dica: O supervisor deve obrigatoriamente fazer parte da equipe selecionada acima.
            </p>
          </div>

          <button
            v-if="!selectedSupervisor && authStore.user"
            type="button"
            @click="
              selectSupervisor({ id: authStore.user.id, name: `${authStore.user.name} (Você)` })
            "
            class="mt-2 text-xs text-primary font-semibold hover:underline flex items-center gap-1"
          >
            <i class="pi pi-check-circle text-[10px]"></i>
            <span>Atribuir a mim mesmo</span>
          </button>
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
            :disabled="loadingSubmit"
            class="px-4 py-2 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <i v-if="loadingSubmit" class="pi pi-spinner animate-spin"></i>
            <span>{{ loadingSubmit ? 'Salvando...' : 'Criar Projeto' }}</span>
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
