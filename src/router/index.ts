import { createRouter, createWebHistory } from 'vue-router'
import DashBoardView from '../views/DashBoardView.vue'
import ArticlesView from '@/views/ArticlesView.vue'
import LoginView from '@/views/LoginView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: 'dashboard' },
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
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        layout: 'none'
      }
    }
  ]
})

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 如果用户没有登录并且试图访问非登录页面
  if (!userStore.isLogin && to.name !== 'login') {
    // 重定向到登录页面
    next({ name: 'login' })
  } else {
    // 否则，允许他们访问
    next()
  }
})

export default router
