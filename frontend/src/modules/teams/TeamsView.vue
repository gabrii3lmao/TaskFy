<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { teamService, type Team } from '@/services/teamService'
import CreateTeamModal from './components/CreateTeamModal.vue'
import AddMemberModal from './components/AddMemberModal.vue'

const teams = ref<Team[]>([])
const loading = ref(true)
const errorMessage = ref('')

// Controle dos Modais
const showCreateModal = ref(false)
const activeAddMemberTeam = ref<{ id: string; name: string } | null>(null)

const fetchTeams = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    teams.value = await teamService.getTeams()
  } catch (error: any) {
    errorMessage.value = 'Não foi possível carregar as equipes. Tente novamente.'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Formatação do cargo para pt-BR
const translateRole = (role: string) => {
  const map: Record<string, string> = {
    admin: 'Administrador',
    supervisor: 'Supervisor',
    member: 'Membro',
  }
  return map[role] || role
}

// Cor da Badge por cargo
const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-danger/10 text-danger border-danger/20'
    case 'supervisor':
      return 'bg-primary/10 text-primary border-primary/20'
    default:
      return 'bg-background text-muted border-border'
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(
    new Date(dateString),
  )
}

onMounted(() => {
  fetchTeams()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground flex items-center gap-2">
          <i class="pi pi-users text-primary"></i>
          Minhas Equipes
        </h1>
        <p class="text-sm text-muted mt-1">
          Gerencie os grupos de colaboração e atribua novos membros
        </p>
      </div>

      <button
        class="px-4 py-2 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto"
        @click="showCreateModal = true"
      >
        <i class="pi pi-plus"></i>
        <span>Nova Equipe</span>
      </button>
    </div>

    <div
      v-if="errorMessage"
      class="p-4 bg-danger/10 text-danger rounded-lg flex items-center gap-2 border border-danger/20"
    >
      <i class="pi pi-exclamation-triangle"></i>
      <span class="text-sm font-medium">{{ errorMessage }}</span>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface border border-border rounded-xl p-6 space-y-4 animate-pulse"
      >
        <div class="h-6 bg-background rounded w-1/2"></div>
        <div class="h-4 bg-background rounded w-1/3"></div>
        <div class="h-10 bg-background rounded-lg mt-4"></div>
      </div>
    </div>

    <div
      v-else-if="teams.length === 0"
      class="bg-surface border border-border rounded-xl p-12 text-center max-w-lg mx-auto space-y-3 shadow-sm"
    >
      <i class="pi pi-users text-4xl text-muted"></i>
      <h3 class="text-lg font-semibold text-foreground">Nenhuma equipe encontrada</h3>
      <p class="text-sm text-muted">
        Você ainda não faz parte de nenhuma equipe. Crie uma nova para começar a gerenciar projetos
        em grupo.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="team in teams"
        :key="team.id"
        class="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative"
      >
        <div>
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-lg font-semibold text-foreground truncate" :title="team.name">
              {{ team.name }}
            </h3>

            <span
              :class="[
                'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0',
                getRoleBadgeClass(team.role),
              ]"
            >
              {{ translateRole(team.role) }}
            </span>
          </div>

          <div class="mt-4 flex items-center gap-2 text-xs text-muted">
            <i class="pi pi-calendar"></i>
            <span>Criada em {{ formatDate(team.createdAt) }}</span>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <button
            class="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            @click="$router.push({ name: 'Workload', query: { teamId: team.id } })"
            title="Ver Carga de Trabalho desta equipe"
          >
            <i class="pi pi-chart-bar text-[10px]"></i>
            <span>Carga de Trabalho</span>
          </button>

          <button
            v-if="team.role === 'admin' || team.role === 'supervisor'"
            @click="activeAddMemberTeam = { id: team.id, name: team.name }"
            class="px-2.5 py-1 bg-background hover:bg-primary/10 text-primary border border-border hover:border-primary/30 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <i class="pi pi-user-plus text-[10px]"></i>
            <span>Adicionar Membro</span>
          </button>
        </div>
      </div>
    </div>

    <CreateTeamModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="(newTeam) => teams.unshift(newTeam)"
    />

    <AddMemberModal
      v-if="activeAddMemberTeam"
      :team-id="activeAddMemberTeam.id"
      :team-name="activeAddMemberTeam.name"
      @close="activeAddMemberTeam = null"
      @added="fetchTeams"
    />
  </div>
</template>
