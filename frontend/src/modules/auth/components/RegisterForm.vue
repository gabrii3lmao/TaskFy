<script setup lang="ts">
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import axios from 'axios'

const emit = defineEmits(['registered'])

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)

const passwordStrength = computed(() => {
  const p = password.value
  if (!p) return { level: 0, label: '', color: '' }
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  if (score <= 1) return { level: 1, label: 'Fraca', color: 'bg-danger' }
  if (score <= 3) return { level: 2, label: 'Média', color: 'bg-warning' }
  return { level: 3, label: 'Forte', color: 'bg-success' }
})

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'A senha deve ter no mínimo 8 caracteres.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
    })

    successMessage.value = 'Conta criada com sucesso! Redirecionando...'
    name.value = ''
    email.value = ''
    password.value = ''

    setTimeout(() => {
      emit('registered')
    }, 1500)
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || 'Erro ao criar conta. O e-mail pode já estar em uso.'
    } else {
      errorMessage.value = 'Erro ao criar conta. O e-mail pode já estar em uso.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister" class="space-y-5">
    <div v-if="errorMessage" class="p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-center gap-2">
      <i class="pi pi-exclamation-triangle text-danger text-sm shrink-0"></i>
      <p class="text-xs text-danger font-medium">{{ errorMessage }}</p>
    </div>

    <div v-if="successMessage" class="p-3 bg-success/10 border border-success/20 rounded-lg flex items-center gap-2">
      <i class="pi pi-check-circle text-success text-sm shrink-0"></i>
      <p class="text-xs text-success font-medium">{{ successMessage }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-foreground mb-1.5">Nome Completo</label>
      <div class="relative">
        <i class="pi pi-user absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm"></i>
        <input
          v-model="name"
          type="text"
          placeholder="Ex: João Silva"
          class="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
      <div class="relative">
        <i class="pi pi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm"></i>
        <input
          v-model="email"
          type="email"
          placeholder="joao@exemplo.com"
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
          placeholder="mínimo 8 caracteres"
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
      <div v-if="password" class="mt-2 space-y-1">
        <div class="flex gap-1">
          <div
            v-for="i in 3"
            :key="i"
            class="h-1 flex-1 rounded-full transition-all duration-300"
            :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-border'"
          ></div>
        </div>
        <p class="text-xs text-muted text-right">{{ passwordStrength.label }}</p>
      </div>
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      <i v-if="loading" class="pi pi-spinner animate-spin"></i>
      <span>{{ loading ? 'Criando conta...' : 'Criar Conta' }}</span>
    </button>

    <p class="text-xs text-muted text-center leading-relaxed">
      Ao se cadastrar, você concorda com nossos
      <a href="#" class="text-primary hover:underline">Termos de Serviço</a>
      e
      <a href="#" class="text-primary hover:underline">Política de Privacidade</a>.
    </p>
  </form>
</template>
