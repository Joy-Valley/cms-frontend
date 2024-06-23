import service from '../../utils/service'

/**
 * 系统状态服务模块
 * @module userLogsAPI
 */
export const userLogsAPI = {
  /**
   * 获取系统日志列表
   * @function status
   * @returns {Promise<any>} 返回一个Promise，其解析为系统日志列表的响应
   */
  list(pageNo: number, pageSize: number, sort: string): Promise<any> {
    return service.get('/api/v1/userlogs/list', {
      params: {
        pageNo,
        pageSize,
        sort
      }
    })
  }
}
