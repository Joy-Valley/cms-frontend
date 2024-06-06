import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 从本地存储中获取 accessToken，refreshToken 和 userInfo 的值
  const accessToken = ref(localStorage.getItem('accessToken') || '')
  const refreshToken = ref(localStorage.getItem('refreshToken') || '')
  const userInfo = ref('{}')

  // 计算属性 isLogin，根据 accessToken 是否存在来判断用户是否已登录
  const isLogin = computed(() => !!accessToken.value)

  // 监听 accessToken，refreshToken 和 userInfo 的变化
  watch([accessToken, refreshToken], ([newAccessToken, newRefreshToken]) => {
    // 当这些值发生变化时，将它们存储到本地存储中
    localStorage.setItem('accessToken', newAccessToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  })

  return { isLogin, accessToken, refreshToken, userInfo }
})
