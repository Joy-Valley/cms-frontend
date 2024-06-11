import service from '../../utils/service'

/**
 * 文章服务模块
 * @module articleApi
 */
export const articleApi = {
  /**
   * 获取文章统计数量
   * @function total
   * @returns {Promise} 返回一个Promise，其解析为文章统计数量的响应
   */
  total(): Promise<any> {
    return service.get('/api/v1/article/total')
  },
  /**
   * 获取文章列表
   * @function list
   * @returns {Promise} 返回一个Promise，其解析为文章列表的响应
   */
  list(pageNo: number, pageSize: number, sort: string, lazyParams: string): Promise<any> {
    return service.get('/api/v1/article/list', {
      params: {
        pageNo,
        pageSize,
        sort,
        lazyParams
      }
    })
  }
}
