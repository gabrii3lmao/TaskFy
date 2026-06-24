import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/modules/auth/AuthVue.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/',
    component: () => import('@/layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/modules/dashboard/DashboardView.vue'),
      },
      {
        path: 'projects',
        name: 'Projects',
        component: () => import('@/modules/projects/ProjectsView.vue'),
      },
      {
        path: 'teams',
        name: 'Teams',
        component: () => import('@/modules/teams/TeamsView.vue'),
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/modules/notifications/NotificationsView.vue'),
      },
      {
        path: 'tasks',
        name: 'Tasks',
        component: () => import('@/modules/tasks/TasksView.vue'),
      },
      {
        path: 'workload',
        name: 'Workload',
        component: () => import('@/modules/workloads/WorkloadView.vue'),
      },
      // Rota Dinâmica das Tarefas do Projeto ligada corretamente
      {
        path: 'projects/:id',
        name: 'ProjectDetails',
        component: () => import('@/modules/projects/ProjectDetailsView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login' })
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router
