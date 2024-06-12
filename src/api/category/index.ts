import service from '../../utils/service'

/**
 * 分类服务模块
 * @module CategoryAPI
 */
export const CategoryAPI = {
  /**
   * 获取分类列表
   * @function list
   * @returns {Promise} 返回一个Promise，其解析为分类列表的响应
   */
  list(pageNo: number, pageSize: number, sort: string, lazyParams: string): Promise<any> {
    return service.get('/api/v1/article/category/list', {
      params: {
        pageNo,
        pageSize,
        sort,
        lazyParams
      }
    })
  }
}
