<h1 align="center">TaskFy</h1>

<p align="center">
  Plataforma full-stack para organização e acompanhamento do fluxo de trabalho da sua equipe.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge" alt="Status: Em Desenvolvimento" />
  <img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node >=22.12" />
  <img src="https://img.shields.io/badge/typescript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 6" />
</p>

<br />

## Funcionalidades

|                                |                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------- |
| **Autenticação JWT** &nbsp; 🔐 | Cadastro e login seguros com tokens JWT e senhas hasheadas (bcrypt).          |
| **Dashboard** &nbsp; 📊        | Visão geral com tarefas atrasadas, com vencimento hoje, futuras e concluídas. |
| **Projetos** &nbsp; 📁         | Criação, listagem e gerenciamento de projetos.                                |
| **Equipes** &nbsp; 👥          | Criação de times e adição de membros.                                         |
| **Tarefas** &nbsp; ✅          | CRUD completo, subtarefas, temporizador, notificação de atraso e conclusão.   |
| **Workload** &nbsp; ⚖️         | Balanceamento de carga de trabalho entre membros da equipe.                   |
| **Notificações** &nbsp; 🔔     | Sistema de notificações em tempo real com contagem de não lidas.              |
| **Tema escuro** &nbsp; 🌙      | Suporte a dark mode com persistência de preferência.                          |

<br />

## Stack

<p align="center">
  <img src="https://img.shields.io/badge/vue.js-3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/pinia-3-FFD859?style=for-the-badge&logo=pinia&logoColor=black" alt="Pinia 3" />
  <img src="https://img.shields.io/badge/tailwind_css-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3" />
  <img src="https://img.shields.io/badge/express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/drizzle_orm-0.45-C5F74F?style=for-the-badge&logo=drizzle-orm&logoColor=white" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/zod-4-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod 4" />
  <img src="https://img.shields.io/badge/vue_router-5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue Router 5" />
  <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
</p>

<br />

## Problemas que o TaskFy resolve

- **Centralização de informações** — Tarefas, prazos e equipes em um único lugar, eliminando planilhas e mensagens soltas.
- **Visibilidade do progresso** — Dashboard que mostra o panorama geral: o que está atrasado, o que vence hoje e o que vem pela frente.
- **Distribuição de carga** — Visão de workload para evitar sobrecarga de membros da equipe.
- **Rastreamento de tempo** — Temporizador integrado por tarefa para registro de horas trabalhadas.
- **Notificações proativas** — Alertas de atraso e atualizações mantêm todos alinhados.
- **Subtarefas** — Detalhamento de tarefas complexas em passos menores e verificáveis.

<br />

## Arquitetura
