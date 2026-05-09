<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'

const activeTab = ref<'login' | 'register'>('login')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md bg-surface border border-border rounded-xl shadow-sm p-6 space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary">TaskFy</h1>
        <p class="text-sm text-muted mt-1">Gerencie suas tarefas e equipes de forma ágil</p>
      </div>

      <div class="flex border-b border-border">
        <button
          @click="activeTab = 'login'"
          :class="[
            'flex-1 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'login'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-slate-700',
          ]"
        >
          Entrar
        </button>
        <button
          @click="activeTab = 'register'"
          :class="[
            'flex-1 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'register'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-slate-700',
          ]"
        >
          Cadastrar
        </button>
      </div>

      <div class="mt-4">
        <LoginForm v-if="activeTab === 'login'" />
        <RegisterForm v-else @registered="activeTab = 'login'" />
      </div>
    </div>
  </div>
</template>
