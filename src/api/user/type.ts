/**
 * 登录接口
 * @interface LoginRequest
 * @property {string} email - 用户的电子邮件
 * @property {string} password - 用户的密码
 */
export interface LoginRequest {
  email: string
  password: string
  [property: string]: any
}