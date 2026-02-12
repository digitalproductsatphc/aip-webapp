import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@/auth/guards/authGuard';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/auth/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/systems',
      name: 'systems',
      component: () => import('@/views/SystemSelection.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutUs.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/HelpCentre.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('@/views/ReportProblem.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ]
});

router.beforeEach(authGuard);

export default router;
