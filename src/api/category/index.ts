import service from '../../utils/service'

/**
 * 分类服务模块
 * @module CategoryAPI
 */
export const CategoryAPI = {
  /**
   * 获取分类列表
   * @function list
   * @param {number} pageNo - 页码
   * @param {number} pageSize - 每页数量
   * @param {string} sort - 排序方式
   * @returns {Promise<any>} 返回一个Promise，其解析为分类列表的响应
   */
  list(pageNo: number, pageSize: number, sort: string): Promise<any> {
    return service.get('/api/v1/article/category/list', {
      params: {
        pageNo,
        pageSize,
        sort
      }
    })
  },
  /**
   * 查询分类列表
   * @function query
   * @returns {Promise} 返回一个Promise，其解析为文章列表的响应
   */
  query(lazyParams: string): Promise<any> {
    return service.get('/api/v1/article/category/query', {
      params: {
        lazyParams
      }
    })
  },
  /**
   * 更新分类
   * @function update
   * @param {number} id
   * @param {string} name
   * @param {string} description
   * @param {string} slug
   * @returns {Promise<any>} 返回一个Promise，其解析为更新分类的响应
   */
  update(id: number, name: string, description: string, slug: string): Promise<any> {
    return service.post(`/api/v1/article/category/update/${id}`, {
      name,
      description,
      slug
    })
  },
  /**
   * 通过数组删除分类
   * @function removeList
   * @param {[id: number]} ids
   * @returns {Promise<any>} 返回一个Promise，其解析为删除分类的响应
   */
  removeList(ids: [id: number]): Promise<any> {
    return service.post(`/api/v1/article/category/remove`, {
      ids
    })
  },
  /**
   * 新建分类
   * @function create
   * @param {string} name
   * @param {string} description
   * @returns {Promise<any>} 返回一个Promise，其解析为更新分类的响应
   */
  create(name: string, description: string): Promise<any> {
    return service.post(`/api/v1/article/category/create`, {
      name,
      description
    })
  }
}
