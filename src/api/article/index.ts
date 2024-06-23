import service from '../../utils/service'
import type { ArticleUpdateRequest, CreateRequest } from './type'

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
  list(pageNo: number, pageSize: number, sort: string): Promise<any> {
    return service.get('/api/v1/article/list', {
      params: {
        pageNo,
        pageSize,
        sort
      }
    })
  },
  /**
   * 查询文章列表
   * @function query
   * @returns {Promise} 返回一个Promise，其解析为文章列表的响应
   */
  query(lazyParams: string): Promise<any> {
    return service.get('/api/v1/article/query', {
      params: {
        lazyParams
      }
    })
  },
  /**
   * 创建文章
   * @function create
   * @returns {Promise} 返回一个Promise，其解析为文章列表的响应
   */
  create(data: CreateRequest): Promise<any> {
    return service.post('/api/v1/article/create', data)
  },
  /**
   * 通过id删除文章
   * @function removeOne
   * @param {number} id
   * @returns {Promise<any>} 返回一个Promise，其解析为删除文章的响应
   */
  removeOne(id: number): Promise<any> {
    return service.post(`/api/v1/article/remove/${id}`)
  },
  /**
   * 通过数组删除文章
   * @function removeList
   * @param {[id: number]} ids
   * @returns {Promise<any>} 返回一个Promise，其解析为删除文章的响应
   */
  removeList(ids: [id: number]): Promise<any> {
    return service.post(`/api/v1/article/remove`, {
      ids
    })
  },
  /**
   * 通过id更新状态
   * @function updateStatus
   * @param {number} id
   * @param {string} status
   * @returns {Promise<any>} 返回一个Promise，其解析为更新状态的响应
   */
  updateStatus(id: number, status: string): Promise<any> {
    return service.post(`/api/v1/article/update/status/${id}`, {
      status
    })
  },
  /**
   * 通过id获取文章
   * @function getArticleById
   * @param {number} id
   * @returns {Promise<any>} 返回一个Promise，其解析为更新文章的响应
   */
  getArticleById(id: number): Promise<any> {
    return service.get(`/api/v1/article/${id}`)
  },
  /**
   * 通过id更新文章
   * @function update
   * @param {number} id
   * @param {ArticleUpdateRequest} data
   * @returns {Promise<any>} 返回一个Promise，其解析为更新文章的响应
   */
  update(id: number, data: ArticleUpdateRequest): Promise<any> {
    return service.post(`/api/v1/article/update/${id}`, data)
  }
}
