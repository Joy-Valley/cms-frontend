import service from '../../utils/service'

/**
 * 标签服务模块
 * @module TagAPI
 */
export const TagAPI = {
  /**
   * 获取标签列表
   * @function list
   * @param {number} pageNo - 页码
   * @param {number} pageSize - 每页数量
   * @param {string} sort - 排序方式
   * @param {string} lazyParams - 懒加载参数
   * @returns {Promise<any>} 返回一个Promise，其解析为标签列表的响应
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
  },
  /**
   * 更新标签
   * @function update
   * @param {number} id
   * @param {string} name
   * @param {string} description
   * @param {string} slug
   * @returns {Promise<any>} 返回一个Promise，其解析为更新标签的响应
   */
  update(id: number, name: string, description: string, slug: string): Promise<any> {
    return service.post(`/api/v1/article/tag/update/${id}`, {
      name,
      description,
      slug
    })
  },
  /**
   * 通过数组删除标签
   * @function remove
   * @param {[id: number]} ids
   * @returns {Promise<any>} 返回一个Promise，其解析为删除标签的响应
   */
  remove(ids: [id: number]): Promise<any> {
    return service.post(`/api/v1/article/tag/remove`, {
      ids
    })
  },
  /**
   * 新建标签
   * @function create
   * @param {string} name
   * @param {string} description
   * @returns {Promise<any>} 返回一个Promise，其解析为更新标签的响应
   */
  create(name: string, description: string): Promise<any> {
    return service.post(`/api/v1/article/tag/create`, {
      name,
      description
    })
  }
}
