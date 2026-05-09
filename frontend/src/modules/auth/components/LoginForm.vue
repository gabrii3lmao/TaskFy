<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(email.value, password.value)
    // Redireciona para o Dashboard ou Projetos após o login de sucesso
    router.push({ name: 'Dashboard' })
  } catch (error: unknown) {
    errorMessage.value =
      (error as any).response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
      <input
        v-model="email"
        type="email"
        placeholder="digite seu e-mail"
        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Senha</label>
      <input
        v-model="password"
        type="password"
        placeholder="••••••••"
        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
      />
    </div>

    <p v-if="errorMessage" class="text-sm text-danger font-medium">{{ errorMessage }}</p>

    <button
      type="submit"
      :disabled="loading"
      class="w-full py-2 px-4 bg-primary hover:bg-secondary text-white font-medium rounded-md transition-colors disabled:opacity-50"
    >
      {{ loading ? 'Entrando...' : 'Entrar' }}
    </button>
  </form>
</template>
