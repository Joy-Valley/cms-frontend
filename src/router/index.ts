import { createRouter, createWebHistory } from 'vue-router'
import DashBoardView from '../views/DashBoardView.vue'
import ArticlesView from '@/views/article/ArticlesView.vue'
import LoginView from '@/views/LoginView.vue'
import { useUserStore } from '@/stores/user'
import ArticleCreateView from '@/views/article/ArticleCreateView.vue'
import ArticlesListView from '@/views/article/ArticlesListView.vue'
import CategoryView from '@/views/CategoryView.vue'
import TagView from '@/views/TagView.vue'
import UserView from '@/views/UserView.vue'
import UserLogView from '@/views/UserLogView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/dashboard',
      name: '仪表盘',
      component: DashBoardView,
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/articles',
      name: '文章管理',
      component: ArticlesView,
      redirect: '/articles/list',
      meta: {
        layout: 'default'
      },
      children: [
        {
          path: '/articles/list',
          name: '文章列表',
          component: ArticlesListView
        },
        {
          path: '/articles/create',
          name: '创建文章',
          component: ArticleCreateView
        }
      ]
    },

    {
      path: '/category',
      name: '分类管理',
      component: CategoryView,
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/tag',
      name: '标签管理',
      component: TagView,
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/user',
      name: '用户管理',
      component: UserView,
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/user_log',
      name: '用户日志',
      component: UserLogView,
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/login',
      name: '登录',
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
  if (!userStore.isLogin && to.path !== '/login') {
    // 重定向到登录页面
    next({ path: '/login' })
  } else {
    // 否则，允许他们访问
    next()
  }
})

export default router
