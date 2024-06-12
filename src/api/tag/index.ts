import service from '../../utils/service'

/**
 * 标签服务模块
 * @module TagAPI
 */
export const TagAPI = {
  /**
   * 获取标签列表
   * @function list
   * @returns {Promise} 返回一个Promise，其解析为标签列表的响应
   */
  list(pageNo: number, pageSize: number, sort: string, lazyParams: string): Promise<any> {
    return service.get('/api/v1/article/tag/list', {
      params: {
        pageNo,
        pageSize,
        sort,
        lazyParams
      }
    })
  }
}
