import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const STORAGE_KEY = '@TaskFy:theme'

  const isDark = ref(document.documentElement.classList.contains('dark'))

  function apply(val: boolean) {
    const root = document.documentElement
    root.classList.toggle('dark', val)
    localStorage.setItem(STORAGE_KEY, val ? 'dark' : 'light')
    isDark.value = val
  }

  function toggle() {
    apply(!isDark.value)
  }

  return { isDark, toggle }
})
