import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/pages/Dashboard.vue'
import Login from '@/pages/Login.vue'
import Keuangan from '@/pages/Keuangan.vue' // Update the case to match file name
import SantriSaya from '@/pages/SantriSaya.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/keuangan',
    name: 'Keuangan',
    component: Keuangan,
    meta: { requiresAuth: true },
  },
  {
    path: '/santri',
    name: 'SantriSaya',
    component: SantriSaya,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')

  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
