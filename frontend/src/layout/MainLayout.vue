<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Controle de abertura da sidebar no mobile
const isSidebarOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
}

// Fecha a sidebar no mobile ao navegar
const closeSidebar = () => {
  isSidebarOpen.value = false
}

const navLinks = [
  { name: 'Dashboard', label: 'Agenda', icon: 'pi pi-calendar' },
  { name: 'Teams', label: 'Equipes', icon: 'pi pi-users' },
  { name: 'Projects', label: 'Projetos', icon: 'pi pi-folder' },
  { name: 'Notifications', label: 'Notificações', icon: 'pi pi-bell' },
]
</script>

<template>
  <div class="flex h-screen bg-background overflow-hidden relative">
    <transition name="fade">
      <div
        v-if="isSidebarOpen"
        @click="closeSidebar"
        class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
      ></div>
    </transition>

    <aside
      :class="[
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0',
        'fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-300 ease-in-out lg:static lg:inset-auto',
      ]"
    >
      <div class="p-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-primary">TaskFy</h1>
        <button @click="closeSidebar" class="p-1 text-muted hover:text-slate-800 lg:hidden">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <nav class="flex-1 px-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="{ name: link.name }"
          @click="closeSidebar"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          exact-active-class="bg-primary/10 text-primary font-semibold"
          :class="[
            $route.name === link.name ? '' : 'text-muted hover:bg-slate-50 hover:text-slate-900',
          ]"
        >
          <i :class="link.icon" class="text-lg mr-3"></i>
          {{ link.label }}
        </router-link>
      </nav>

      <div class="p-4 border-t border-border">
        <button
          @click="handleLogout"
          class="w-full flex items-center px-4 py-2 text-sm font-medium text-danger hover:bg-danger/5 rounded-lg transition-colors"
        >
          <i class="pi pi-sign-out text-lg mr-3"></i> Sair
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden w-full">
      <header
        class="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-8 shadow-sm"
      >
        <div class="flex items-center space-x-3 truncate">
          <button
            @click="isSidebarOpen = true"
            class="p-2 text-muted hover:text-primary lg:hidden rounded-lg border border-border bg-background focus:outline-none"
          >
            <i class="pi pi-bars text-lg"></i>
          </button>

          <h2 class="font-semibold text-slate-800 text-sm md:text-base truncate">
            Olá, {{ authStore.user?.name }}
          </h2>
        </div>

        <div class="flex items-center space-x-2 md:space-x-4">
          <button
            class="px-3 md:px-4 py-1.5 md:py-2 bg-primary text-white text-xs md:text-sm font-medium rounded-lg hover:bg-secondary transition-colors shadow-sm flex items-center gap-1.5"
            @click="$router.push({ name: 'Workload' })"
          >
            <i class="pi pi-chart-bar text-xs md:text-sm"></i>
            <span class="hidden sm:inline">Carga de trabalho</span>
            <span class="sm:hidden">Carga</span>
          </button>

          <div
            class="w-8 h-8 rounded-full bg-slate-200 border border-border flex items-center justify-center text-xs font-bold text-slate-600 shrink-0"
          >
            {{ authStore.user?.name.charAt(0).toUpperCase() }}
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
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
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
