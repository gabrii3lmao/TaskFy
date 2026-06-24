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
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const user = ref<User | null>(null)
    const isAuthenticated = ref<boolean>(false)

    const loadStoredUser = () => {
      const storedToken = localStorage.getItem('@TaskFy:token')
      const storedRefreshToken = localStorage.getItem('@TaskFy:refreshToken')
      const storedUser = localStorage.getItem('@TaskFy:user')
      if ((storedToken || storedRefreshToken) && storedUser) {
        accessToken.value = storedToken
        refreshToken.value = storedRefreshToken
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      }
    }

    const login = async (email: string, passwordPlain: string) => {
      const response = await api.post('/auth/login', { email, password: passwordPlain })
      const { accessToken: receivedAccessToken, refreshToken: receivedRefreshToken, user: receivedUser } = response.data.data

      accessToken.value = receivedAccessToken
      refreshToken.value = receivedRefreshToken
      user.value = receivedUser
      isAuthenticated.value = true

      localStorage.setItem('@TaskFy:token', receivedAccessToken)
      localStorage.setItem('@TaskFy:refreshToken', receivedRefreshToken)
      localStorage.setItem('@TaskFy:user', JSON.stringify(receivedUser))
    }

    const logout = async () => {
      const currentRefreshToken = localStorage.getItem('@TaskFy:refreshToken')
      if (currentRefreshToken) {
        try {
          await api.post('/auth/logout', { refreshToken: currentRefreshToken })
        } catch {
          // Ignora erro no logout
        }
      }

      accessToken.value = null
      refreshToken.value = null
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('@TaskFy:token')
      localStorage.removeItem('@TaskFy:refreshToken')
      localStorage.removeItem('@TaskFy:user')
    }

    return {
      accessToken,
      refreshToken,
      user,
      isAuthenticated,
      login,
      logout,
      loadStoredUser,
    }
  },
)
