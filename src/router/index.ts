import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { initAuth, useAuth } from '@/composables/useAuth';
import TabsPage from '@/views/TabsPage.vue';

const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    redirect: '/app/dashboard' 
  },
  { 
    path: '/login', 
    component: () => import('@/views/LoginPage.vue'),
     meta: { guest: true } 
    },
  { 
    path: '/cadastro', 
    component: () => import('@/views/CadastroPage.vue'), 
    meta: { guest: true } },
  {
    path: '/app/',
    component: TabsPage,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/app/dashboard' },
      { path: 'dashboard', component: () => import('@/views/DashboardPage.vue') },
      { path: 'receitas', component: () => import('@/views/ReceitasPage.vue') },
      { path: 'despesas', component: () => import('@/views/DespesasPage.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  await initAuth();
  const { user } = useAuth();
  if (to.matched.some((r) => r.meta.requiresAuth) && !user.value) return '/login';
  if (to.matched.some((r) => r.meta.guest) && user.value) return '/app/dashboard';
  return true;
});

export default router;
