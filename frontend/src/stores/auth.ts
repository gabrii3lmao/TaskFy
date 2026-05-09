import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

interface User {
  id: string
  name: string
  email: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(localStorage.getItem('@TaskFy:token'))
    const isAuthenticated = ref<boolean>(!!token.value)

    // Carrega os dados do localStorage ao iniciar a aplicação
    const loadStoredUser = () => {
      const storedUser = localStorage.getItem('@TaskFy:user')
      if (storedUser && token.value) {
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      }
    }

    const login = async (email: string, passwordPlain: string) => {
      const response = await api.post('/auth/login', { email, password: passwordPlain })

      const { token: receivedToken, user: receivedUser } = response.data.data

      // Salva no estado
      user.value = receivedUser
      token.value = receivedToken
      isAuthenticated.value = true

      localStorage.setItem('@TaskFy:token', receivedToken)
      localStorage.setItem('@TaskFy:user', JSON.stringify(receivedUser))
    }

    const logout = () => {
      user.value = null
      token.value = null
      isAuthenticated.value = false
      localStorage.removeItem('@TaskFy:token')
      localStorage.removeItem('@TaskFy:user')
    }

    return {
      user,
      token,
      isAuthenticated,
      login,
      logout,
      loadStoredUser,
    }
  },
  {
    persist: true,
  },
)
