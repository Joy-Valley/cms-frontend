import service from '../../utils/service'

/**
 * 系统状态服务模块
 * @module serverStatusAPI
 */
export const serverStatusAPI = {
  /**
   * 获取系统状态列表
   * @function status
   * @returns {Promise<any>} 返回一个Promise，其解析为分类列表的响应
   */
  status(): Promise<any> {
    return service.get('/api/v1/server-status/status')
  }
}
