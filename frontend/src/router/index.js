import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/signup', name: 'signup', component: () => import('../views/SignupView.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/calendar/CalendarView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/alarms',
      name: 'alarms',
      component: () => import('../views/alarms/AlarmsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/todo',
      name: 'todo',
      component: () => import('../views/todo/TodoView.vue'),
      meta: { requiresAuth: true },
    }
  ],
});

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth();
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login' };
  }
  return true;
});

export default router;
