<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue'
import { teamService, type SearchedUser } from '@/services/teamService'

const props = defineProps<{
  teamId: string
  teamName: string
}>()

const emit = defineEmits(['close', 'added'])

const searchQuery = ref('')
const searchedUsers = ref<SearchedUser[]>([])
const selectedUser = ref<SearchedUser | null>(null)
const role = ref<'admin' | 'member' | 'supervisor'>('member')

const searching = ref(false)
const loadingSubmit = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Busca usuários dinamicamente via Service
const handleSearch = async () => {
  if (searchQuery.value.length < 2) return

  searching.value = true
  try {
    searchedUsers.value = await teamService.searchUsers(searchQuery.value)
  } catch (error) {
    console.error(error)
  } finally {
    searching.value = false
  }
}

const selectUser = (user: SearchedUser) => {
  selectedUser.value = user
  searchQuery.value = ''
  searchedUsers.value = []
}

const handleSubmit = async () => {
  if (!selectedUser.value) {
    errorMessage.value = 'Selecione um usuário para adicionar.'
    return
  }

  loadingSubmit.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await teamService.addMember(props.teamId, selectedUser.value.id, role.value)
    successMessage.value = `${selectedUser.value.name} foi adicionado(a) com sucesso!`

    setTimeout(() => {
      emit('added')
      emit('close')
    }, 1200)
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || 'Erro ao adicionar membro. Ele já pode estar na equipe.'
  } finally {
    loadingSubmit.value = false
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-fade-in"
  >
    <div
      class="bg-surface border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
    >
      <div class="p-6 border-b border-border flex items-center justify-between bg-background/50">
        <div>
          <h2 class="text-lg font-bold text-foreground flex items-center gap-2">
            <i class="pi pi-user-plus text-primary"></i>
            Adicionar Membro
          </h2>
          <p class="text-xs text-muted mt-0.5 truncate">
            Equipe: <span class="font-semibold text-slate-700">{{ teamName }}</span>
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 text-muted hover:text-foreground transition-colors"
        >
          <i class="pi pi-times text-lg"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
        <div
          v-if="errorMessage"
          class="p-3 bg-danger/10 text-danger text-xs font-medium rounded-lg flex items-center gap-2"
        >
          <i class="pi pi-exclamation-triangle shrink-0"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <div
          v-if="successMessage"
          class="p-3 bg-success/10 text-success text-xs font-medium rounded-lg flex items-center gap-2"
        >
          <i class="pi pi-check shrink-0"></i>
          <span>{{ successMessage }}</span>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-muted mb-1"
            >1. Buscar Usuário *</label
          >

          <div
            v-if="selectedUser"
            class="flex items-center justify-between p-2.5 bg-background border border-border rounded-lg"
          >
            <div class="truncate pr-2">
              <p class="text-sm font-medium text-foreground truncate">{{ selectedUser.name }}</p>
              <p class="text-[10px] text-muted truncate">{{ selectedUser.email }}</p>
            </div>
            <button
              type="button"
              @click="selectedUser = null"
              class="text-xs text-danger hover:underline font-semibold shrink-0"
            >
              Trocar
            </button>
          </div>

          <div v-else class="relative">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Nome ou e-mail..."
              class="w-full pl-8 pr-3 py-2 border border-border rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <i class="pi pi-search absolute left-2.5 top-3 text-muted text-xs"></i>
            <i
              v-if="searching"
              class="pi pi-spinner animate-spin absolute right-2.5 top-3 text-primary text-xs"
            ></i>

            <div
              v-if="searchedUsers.length > 0"
              class="absolute left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto"
            >
              <button
                v-for="user in searchedUsers"
                :key="user.id"
                type="button"
                @click="selectUser(user)"
                class="w-full text-left px-3 py-2 hover:bg-background border-b border-border/50 last:border-0 flex flex-col justify-center"
              >
                <span class="text-sm font-medium text-foreground truncate">{{ user.name }}</span>
                <span class="text-[10px] text-muted truncate">{{ user.email }}</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-muted mb-1"
            >2. Definir Função/Cargo *</label
          >
          <select
            v-model="role"
            class="w-full px-3 py-2 border border-border rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700"
          >
            <option value="member">Membro (Padrão)</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div class="pt-4 border-t border-border flex items-center justify-end gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Fechar
          </button>
          <button
            type="submit"
            :disabled="loadingSubmit || !selectedUser"
            class="px-4 py-2 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <i v-if="loadingSubmit" class="pi pi-spinner animate-spin"></i>
            <span>Adicionar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

