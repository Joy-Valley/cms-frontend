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
   * @returns {Promise<any>} 返回一个Promise，其解析为标签列表的响应
   */
  list(pageNo: number, pageSize: number, sort: string): Promise<any> {
    return service.get('/api/v1/article/tag/list', {
      params: {
        pageNo,
        pageSize,
        sort
      }
    })
  },
  /**
   * 查询标签列表
   * @function query
   * @returns {Promise} 返回一个Promise，其解析为标签列表的响应
   */
  query(lazyParams: string): Promise<any> {
    return service.get('/api/v1/article/tag/query', {
      params: {
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
   * 通过id删除标签
   * @function removeOne
   * @param {number} id
   * @returns {Promise<any>} 返回一个Promise，其解析为删除标签的响应
   */
  removeOne(id: number): Promise<any> {
    return service.post(`/api/v1/article/tag/remove/${id}`)
  },
  /**
   * 通过数组删除标签
   * @function removeList
   * @param {[id: number]} ids
   * @returns {Promise<any>} 返回一个Promise，其解析为删除标签的响应
   */
  removeList(ids: [id: number]): Promise<any> {
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
