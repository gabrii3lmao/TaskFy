<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/services/api'

const emit = defineEmits(['registered'])

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

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

    successMessage.value = 'Conta criada com sucesso! Você já pode fazer login.'
    // Limpa os campos
    name.value = ''
    email.value = ''
    password.value = ''

    // Avisa a View pai para trocar para a aba de login após 1.5s
    setTimeout(() => {
      emit('registered')
    }, 1500)
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || 'Erro ao criar conta. O e-mail pode já estar em uso.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
      <input
        v-model="name"
        type="text"
        placeholder="Ex: João da Silva"
        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
      <input
        v-model="email"
        type="email"
        placeholder="joao@exemplo.com"
        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Senha</label>
      <input
        v-model="password"
        type="password"
        placeholder="mínimo de 8 caracteres"
        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
      />
    </div>

    <p v-if="errorMessage" class="text-sm text-danger font-medium">{{ errorMessage }}</p>
    <p v-if="successMessage" class="text-sm text-success font-medium">{{ successMessage }}</p>

    <button
      type="submit"
      :disabled="loading"
      class="w-full py-2 px-4 bg-primary hover:bg-secondary text-white font-medium rounded-md transition-colors disabled:opacity-50"
    >
      {{ loading ? 'Cadastrando...' : 'Criar Conta' }}
    </button>
  </form>
</template>
