<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Notificações</h1>
        <p class="text-sm text-muted mt-1">
          Acompanhe atualizações de tarefas, projetos e equipes.
        </p>
      </div>

      <button
        class="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 transition-all duration-200"
      >
        Marcar todas como lidas
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-2 p-2 bg-surface border border-border rounded-xl">
      <button class="px-3 md:px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">
        Todas
      </button>
      <button class="px-3 md:px-4 py-2 rounded-lg text-sm text-muted hover:bg-background transition-all duration-200">
        Não lidas
      </button>
      <button class="px-3 md:px-4 py-2 rounded-lg text-sm text-muted hover:bg-background transition-all duration-200">
        Menções
      </button>
      <button class="px-3 md:px-4 py-2 rounded-lg text-sm text-muted hover:bg-background transition-all duration-200">
        Projetos
      </button>
    </div>

    <!-- Notifications -->
    <div class="space-y-3">
      <!-- Notification -->
      <div
        class="group flex items-start gap-4 p-4 bg-surface border border-border rounded-xl hover:shadow-subtle transition-all duration-200"
      >
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <i class="pi pi-check-circle text-primary text-lg"></i>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-foreground leading-relaxed">
                <span class="font-semibold">Marina Costa</span>
                concluiu a tarefa
                <span class="font-medium"> "Implementar autenticação JWT" </span>
              </p>

              <div class="flex items-center gap-3 mt-2 text-xs text-muted">
                <span>Projeto Atlas</span>
                <span>•</span>
                <span>há 12 minutos</span>
              </div>
            </div>

            <div class="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
          </div>
        </div>
      </div>

      <!-- Notification -->
      <div
        class="group flex items-start gap-4 p-4 bg-surface border border-border rounded-xl hover:shadow-subtle transition-all duration-200"
      >
        <div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
          <i class="pi pi-clock text-yellow-500 text-lg"></i>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-foreground leading-relaxed">
                A tarefa
                <span class="font-medium"> "Criar dashboard financeiro" </span>
                está próxima do prazo final.
              </p>

              <div class="flex items-center gap-3 mt-2 text-xs text-muted">
                <span>Projeto Finance</span>
                <span>•</span>
                <span>há 1 hora</span>
              </div>
            </div>

            <div class="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
          </div>
        </div>
      </div>

      <!-- Notification -->
      <div
        class="group flex items-start gap-4 p-4 bg-surface border border-border rounded-xl hover:shadow-subtle transition-all duration-200"
      >
        <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
          <i class="pi pi-users text-secondary text-lg"></i>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-foreground leading-relaxed">
                Você foi adicionado ao projeto
                <span class="font-medium">"TaskFy Mobile"</span>.
              </p>

              <div class="flex items-center gap-3 mt-2 text-xs text-muted">
                <span>Equipe Mobile</span>
                <span>•</span>
                <span>ontem</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification -->
      <div
        class="group flex items-start gap-4 p-4 bg-surface border border-border rounded-xl hover:shadow-subtle transition-all duration-200 opacity-80"
      >
        <div class="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
          <i class="pi pi-exclamation-circle text-danger text-lg"></i>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-foreground leading-relaxed">
                O deploy do ambiente de produção falhou no projeto
                <span class="font-medium">"Core API"</span>.
              </p>

              <div class="flex items-center gap-3 mt-2 text-xs text-muted">
                <span>Infraestrutura</span>
                <span>•</span>
                <span>2 dias atrás</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State Example -->
    <!--
    <div
      class="flex flex-col items-center justify-center py-20 bg-surface border border-border rounded-xl"
    >
      <div
        class="w-16 h-16 rounded-2xl bg-background flex items-center justify-center"
      >
        <i class="pi pi-bell text-2xl text-muted"></i>
      </div>

      <h2 class="mt-5 text-lg font-semibold text-foreground">
        Nenhuma notificação
      </h2>

      <p class="mt-2 text-sm text-muted text-center max-w-sm">
        Quando houver atualizações importantes em tarefas ou projetos,
        elas aparecerão aqui.
      </p>
    </div>
    -->
  </div>
</template>
