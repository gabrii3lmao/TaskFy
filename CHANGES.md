# Registro de Alterações

## Páginas Mockadas (Tasks + Workload)

- **`TasksView.vue`** — Nova página listando todas as tarefas entre projetos com dados mockados. Inclui filtros por status e projeto, cartões de tarefa com badges de status, prazos e responsáveis.
- **`WorkloadView.vue`** — Substituído o placeholder "Página em Construção" por um dashboard de carga de trabalho com cards de estatísticas, barras de progresso por membro (concluídas/andamento/pendentes) e progresso por projeto com prazos e percentuais.
- **Rotas adicionadas**: `/tasks` (Tasks) e `/workload` (Workload) no router, ambas sob o layout autenticado.
- **Sidebar**: Link "Tarefas" adicionado à navegação lateral.

## Dashboard / Agenda Enriquecido

- **Saudação**: "Bom dia/tarde/noite, {nome}" com data atual formatada.
- **Cards de estatísticas**: Projetos ativos, total de tarefas, membros, atrasadas (valores mockados).
- **Fallback offline**: Se a API `/tasks/dashboard` falhar, os dados mockados são usados silenciosamente com um badge "Modo offline".
- **Progresso dos projetos**: Barras de progresso para 4 projetos mockados com percentuais.
- **Atividade recente**: Feed com 5 entradas mockadas (conclusão, início, criação, entrada de membro, alerta de prazo).

## Página de Login/Registro (Estilo SaaS)

- **Layout dividido**: Versão desktop exibe painel esquerdo com gradiente azul→teal, logotipo, headline, 4 cards de funcionalidades e depoimento com avaliação.
- **Seleção de aba**: Alternador em estilo pill (botões arredondados) substituiu o antigo sublinhado.
- **Formulário de login**: Inputs com ícones à esquerda, botão de mostrar/ocultar senha, checkbox "Lembrar-me", link "Esqueceu a senha?".
- **Formulário de cadastro**: Inputs com ícones, medidor de força de senha (3 segmentos: Fraca/Média/Forte), banner de sucesso com auto-redirecionamento.
- **Responsivo**: Em telas pequenas, o painel esquerdo é ocultado e apenas o formulário é exibido.
