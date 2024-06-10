import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  // 从会话存储和本地存储中获取 accessToken 和 refreshToken
  const accessToken = ref(
    sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || ''
  )
  const refreshToken = ref(
    sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken') || ''
  )
  const isRemember = ref<boolean>(localStorage.getItem('refreshToken') !== null)

  const userInfo = ref({})

  // 计算属性 isLogin，根据 refreshToken 是否存在来判断用户是否已登录
  const isLogin = computed(() => !!refreshToken.value)

  // 监听 accessToken，refreshToken 和 userInfo 的变化
  watch([accessToken, refreshToken], ([newAccessToken, newRefreshToken]) => {
    //如果newAccessToken和newRefreshToken等于空，清空本地存储和会话存储
    if (!newAccessToken && !newRefreshToken) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('refreshToken')
      router.push('/login')
      return
    }
    if (isRemember.value) {
      // 如果用户选择记住我，将这些值存储到本地存储中
      localStorage.setItem('accessToken', newAccessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
    } else {
      // 如果用户没有选择记住我，只将这些值存储到会话存储中
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('isRemember')
      sessionStorage.setItem('accessToken', newAccessToken)
      sessionStorage.setItem('refreshToken', newRefreshToken)
    }
    // 如果 refreshToken 为空，导航到 /login
    if (!refreshToken.value) {
      router.push('/login')
    }
  })

  // 退出登录
  function logout() {
    accessToken.value = ''
    refreshToken.value = ''
    userInfo.value = {}
  }

  return { logout, isRemember, isLogin, accessToken, refreshToken, userInfo }
})
