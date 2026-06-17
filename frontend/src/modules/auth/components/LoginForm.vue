<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import axios from 'axios'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push({ name: 'Dashboard' })
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || 'E-mail ou senha inválidos.'
    } else {
      errorMessage.value = 'Erro ao fazer login. Verifique suas credenciais.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="space-y-5">
    <div v-if="errorMessage" class="p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-center gap-2">
      <i class="pi pi-exclamation-triangle text-danger text-sm shrink-0"></i>
      <p class="text-xs text-danger font-medium">{{ errorMessage }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
      <div class="relative">
        <i class="pi pi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm"></i>
        <input
          v-model="email"
          type="email"
          placeholder="seu@email.com"
          class="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-foreground mb-1.5">Senha</label>
      <div class="relative">
        <i class="pi pi-lock absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm"></i>
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="sua senha"
          class="w-full pl-9 pr-10 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          tabindex="-1"
        >
          <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" class="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary/40" />
        <span class="text-xs text-muted">Lembrar-me</span>
      </label>
      <a href="#" class="text-xs text-primary hover:underline font-medium">Esqueceu a senha?</a>
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      <i v-if="loading" class="pi pi-spinner animate-spin"></i>
      <span>{{ loading ? 'Entrando...' : 'Entrar' }}</span>
    </button>
  </form>
</template>
