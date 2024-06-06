import service from '../utils/service'

/**
 * 登录请求接口
 * @interface LoginRequest
 * @property {string} email - 用户的电子邮件
 * @property {string} password - 用户的密码
 * @property {string} [property] - 可选的任何其他属性
 */
export interface LoginRequest {
  email: string
  password: string
  [property: string]: any
}

/**
 * 用户服务模块
 * @module UserService
 */
export const UserService = {
  /**
   * 获取用户信息
   * @function info
   * @returns {Promise} 返回一个Promise，其解析为用户信息的响应
   */
  info(): Promise<any> {
    return service.get('/api/v1/user/info')
  },

  /**
   * 用户登录
   * @function login
   * @param {LoginRequest} data - 登录请求数据
   * @returns {Promise} 返回一个Promise，其解析为登录的响应
   */
  login(data: LoginRequest): Promise<any> {
    return service.post('/api/v1/user/login', data)
  },

  /**
   * 刷新用户信息
   * @function refresh
   * @returns {Promise} 返回一个Promise，其解析为刷新的响应
   */
  refresh(): Promise<any> {
    return service.get('/api/v1/user/refresh')
  }
}
