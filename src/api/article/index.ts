import service from '../../utils/service'
import type { CreateRequest } from './type'

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
  }
}
