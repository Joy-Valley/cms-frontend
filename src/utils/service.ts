import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { baseURL } from '@/config/config'

const service = axios.create({
  baseURL, // 基础URL
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  async (config) => {
    const userStore = useUserStore()
    if (userStore.accessToken) {
      config.headers['Authorization'] = `Bearer ${userStore.accessToken}`
    }
    return config
  },
  (error) => {
    console.error('request error: ', error) // 打印错误信息
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    const originalRequest = error.config
    const userStore = useUserStore()
    if (userStore.isLogin && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const { data } = await axios.get(baseURL + '/api/v1/user/refresh', {
        params: { refreshToken: userStore.refreshToken },
        timeout: 5000
      })
      userStore.accessToken = data.data.accessToken
      userStore.refreshToken = data.data.refreshToken
      return service(originalRequest)
    }
    console.error('response error: ', error) // 打印错误信息
    return Promise.reject(error)
  }
)

export default service