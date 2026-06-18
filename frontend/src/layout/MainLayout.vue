<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()
const route = useRoute()

const isSidebarOpen = ref(false)

const handleLogout = () => {
  isSidebarOpen.value = false
  authStore.logout()
  router.push({ name: 'Login' })
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const isActive = (name: string) => route.name === name

const navLinks = [
  { name: 'Dashboard', label: 'Agenda', icon: 'pi pi-calendar', desc: 'Visão geral do dia' },
  { name: 'Tasks', label: 'Tarefas', icon: 'pi pi-check-square', desc: 'Gerenciar atividades' },
  { name: 'Teams', label: 'Equipes', icon: 'pi pi-users', desc: 'Colaboradores' },
  { name: 'Projects', label: 'Projetos', icon: 'pi pi-folder', desc: 'Projetos ativos' },
  { name: 'Notifications', label: 'Notificações', icon: 'pi pi-bell', desc: 'Alertas e avisos' },
]
</script>

<template>
  <div class="flex h-screen bg-background overflow-hidden relative">
    <transition name="fade">
      <div
        v-if="isSidebarOpen"
        @click="closeSidebar"
        class="fixed inset-0 bg-overlay z-40 lg:hidden backdrop-blur-sm"
      ></div>
    </transition>

    <aside
      :class="[
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0',
        'fixed inset-y-0 left-0 z-50 w-64 lg:w-72 bg-surface border-r border-border flex flex-col transition-transform duration-300 ease-in-out lg:static lg:inset-auto',
      ]"
    >
      <div
        class="p-5 lg:p-6 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent"
      >
        <div class="flex items-center gap-3">
          <img src="/logo-taskfy.svg" alt="TaskFy" class="h-8 w-auto" />
          <div>
            <h1 class="text-lg font-bold text-foreground leading-tight">TaskFy</h1>
            <p class="text-[10px] text-muted leading-tight">Gestão de tarefas</p>
          </div>
        </div>
        <button
          @click="closeSidebar"
          class="p-1.5 text-muted hover:text-foreground lg:hidden rounded-lg hover:bg-background transition-colors"
        >
          <i class="pi pi-times text-lg"></i>
        </button>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="{ name: link.name }"
          @click="closeSidebar"
          class="group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 relative"
          :class="[
            isActive(link.name)
              ? 'bg-primary/10 text-primary font-semibold shadow-sm'
              : 'text-muted hover:bg-background hover:text-foreground',
          ]"
        >
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
            :class="
              isActive(link.name)
                ? 'bg-primary text-white shadow-sm'
                : 'bg-background group-hover:bg-surface'
            "
          >
            <i :class="link.icon" class="text-base"></i>
          </div>
          <div class="min-w-0">
            <span class="text-sm font-semibold block leading-tight">{{ link.label }}</span>
            <span class="text-[10px] text-muted block leading-tight mt-0.5">{{ link.desc }}</span>
          </div>
          <div
            v-if="isActive(link.name)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
          ></div>
        </router-link>
      </nav>

      <div class="p-3 border-t border-border space-y-2">
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/50"
        >
          <div
            class="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0"
          >
            {{ authStore.user?.name?.charAt(0).toUpperCase() || '?' }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-foreground truncate leading-tight">
              {{ authStore.user?.name || 'Usuário' }}
            </p>
            <p class="text-[10px] text-muted truncate leading-tight">
              {{ authStore.user?.email || '' }}
            </p>
          </div>
        </div>

        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger/80 hover:text-danger hover:bg-danger/5 transition-colors"
        >
          <div class="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
            <i class="pi pi-sign-out text-base text-danger/70"></i>
          </div>
          <div class="text-left">
            <span class="block text-sm font-semibold leading-tight">Sair</span>
            <span class="text-[10px] text-muted block leading-tight">Encerrar sessão</span>
          </div>
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden w-full min-w-0">
      <header
        class="h-16 lg:h-18 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-8 shadow-sm shrink-0"
      >
        <div class="flex items-center gap-3 truncate">
          <button
            @click="isSidebarOpen = true"
            class="p-2.5 text-muted hover:text-primary lg:hidden rounded-xl border border-border bg-background hover:border-primary/30 transition-colors focus:outline-none"
          >
            <i class="pi pi-bars text-lg"></i>
          </button>

          <div
            class="hidden lg:flex w-9 h-9 rounded-xl bg-primary/10 items-center justify-center text-primary shrink-0"
          >
            <i class="pi pi-calendar text-sm"></i>
          </div>

          <div class="min-w-0">
            <h2 class="font-semibold text-foreground text-sm md:text-base truncate leading-tight">
              Olá, {{ authStore.user?.name?.split(' ')[0] || 'Usuário' }}
            </h2>
            <p class="text-[10px] text-muted truncate leading-tight hidden sm:block">
              {{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 md:gap-3">
          <button
            class="px-3 md:px-4 py-2 bg-primary hover:bg-secondary text-white text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
            @click="$router.push({ name: 'Workload' })"
          >
            <i class="pi pi-chart-bar text-xs md:text-sm"></i>
            <span class="hidden sm:inline">Carga de trabalho</span>
            <span class="sm:hidden">Carga</span>
          </button>

          <button
            @click="themeStore.toggle"
            class="p-2.5 text-muted hover:text-primary rounded-xl border border-border bg-background hover:border-primary/30 transition-all duration-200"
            :title="themeStore.isDark ? 'Modo claro' : 'Modo escuro'"
          >
            <i :class="themeStore.isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-sm"></i>
          </button>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
