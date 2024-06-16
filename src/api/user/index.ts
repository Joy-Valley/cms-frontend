import service from '../../utils/service'
import type { LoginRequest } from './type'

/**
 * 用户服务模块
 * @module UserAPI
 */
export const UserAPI = {
  /**
   * 获取用户信息
   * @function info
   * @returns {Promise} 返回一个Promise，其解析为用户信息的响应
   */
  info(): Promise<any> {
    return service.get('/api/v1/user/userInfo')
  },

  /**
   * 用户登录
   * @function login
   * @param {LoginRequest} data - 登录请求数据
   * @returns {Promise} 返回一个Promise，其解析为登录的响应
   */
  login(data: LoginRequest): Promise<any> {
    return service.post('/api/v1/auth/login', data)
  }
}
