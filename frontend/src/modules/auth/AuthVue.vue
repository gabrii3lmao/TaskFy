<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'

const activeTab = ref<'login' | 'register'>('login')

const features = [
  { icon: 'pi-check-square', title: 'Gestão de Tarefas', desc: 'Organize e acompanhe tarefas em tempo real com sua equipe' },
  { icon: 'pi-users', title: 'Trabalho em Equipe', desc: 'Colabore com membros, atribua responsabilidades e acompanhe o progresso' },
  { icon: 'pi-chart-bar', title: 'Métricas e Relatórios', desc: 'Visualize a carga de trabalho e tome decisões baseadas em dados' },
  { icon: 'pi-clock', title: 'Cronômetro Integrado', desc: 'Controle o tempo gasto em cada tarefa diretamente na plataforma' },
]
</script>

<template>
  <div class="min-h-screen flex bg-background">
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-secondary p-12 xl:p-16 flex-col justify-between">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

      <div class="relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <i class="pi pi-check-circle text-white text-xl"></i>
          </div>
          <span class="text-2xl font-bold text-white">TaskFy</span>
        </div>

        <div class="mt-16">
          <h1 class="text-4xl xl:text-5xl font-bold text-white leading-tight">
            Gerencie seus projetos<br />
            <span class="text-white/80">com simplicidade</span>
          </h1>
          <p class="mt-4 text-lg text-white/70 max-w-md leading-relaxed">
            A plataforma completa para gestão de tarefas, equipes e produtividade. 
            Organize seu fluxo de trabalho em minutos.
          </p>
        </div>

        <div class="mt-12 space-y-6">
          <div v-for="f in features" :key="f.title" class="flex items-start gap-4">
            <div class="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
              <i :class="['pi text-white text-sm', f.icon]"></i>
            </div>
            <div>
              <h3 class="text-white font-semibold text-sm">{{ f.title }}</h3>
              <p class="text-white/60 text-sm mt-0.5">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative z-10">
        <div class="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-5 max-w-sm">
          <div class="flex items-center gap-1 text-yellow-300 text-sm mb-2">
            <i class="pi pi-star-fill"></i>
            <i class="pi pi-star-fill"></i>
            <i class="pi pi-star-fill"></i>
            <i class="pi pi-star-fill"></i>
            <i class="pi pi-star-fill"></i>
          </div>
          <p class="text-white/80 text-sm leading-relaxed">
            "TaskFy transformou a forma como nossa equipe organiza as tarefas. 
            A produtividade aumentou significativamente."
          </p>
          <div class="flex items-center gap-3 mt-3">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">MC</div>
            <div>
              <p class="text-white text-sm font-medium">Marina Costa</p>
              <p class="text-white/50 text-xs">Tech Lead · Atlas Corp</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center p-4 lg:p-8">
      <div class="w-full max-w-md">
        <div class="lg:hidden flex items-center justify-center gap-3 mb-8">
          <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <i class="pi pi-check-circle text-primary text-xl"></i>
          </div>
          <span class="text-2xl font-bold text-foreground">TaskFy</span>
        </div>

        <div class="bg-surface border border-border rounded-2xl shadow-sm p-6 sm:p-8">
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold text-foreground">
              {{ activeTab === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta' }}
            </h2>
            <p class="text-sm text-muted mt-1">
              {{ activeTab === 'login' ? 'Entre com suas credenciais para continuar' : 'Preencha os dados abaixo para começar' }}
            </p>
          </div>

          <div class="flex border border-border rounded-lg p-1 mb-6">
            <button
              @click="activeTab = 'login'"
              :class="[
                'flex-1 py-2 text-sm font-medium rounded-md transition-all',
                activeTab === 'login'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-foreground',
              ]"
            >
              Entrar
            </button>
            <button
              @click="activeTab = 'register'"
              :class="[
                'flex-1 py-2 text-sm font-medium rounded-md transition-all',
                activeTab === 'register'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-foreground',
              ]"
            >
              Cadastrar
            </button>
          </div>

          <LoginForm v-if="activeTab === 'login'" />
          <RegisterForm v-else @registered="activeTab = 'login'" />
        </div>

        <p class="text-center text-xs text-muted mt-6">
          Ao continuar, você concorda com nossos
          <a href="#" class="text-primary hover:underline">Termos de Serviço</a>
          e
          <a href="#" class="text-primary hover:underline">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  </div>
</template>
