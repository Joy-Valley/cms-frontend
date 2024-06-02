import { createRouter, createWebHistory } from 'vue-router'
import DashBoardView from '../views/DashBoardView.vue'
import ArticlesView from '@/views/ArticlesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoardView,
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesView,
      meta: {
        layout: 'default'
      }
    }
  ]
})

export default router
