import request from '@/utils/request'

/**
 * 获取商品详情
 * @param {number} id - 商品ID
 * @returns {Promise<any>}
 */
export function getDetail(id) {
  return request.get({
    url: `/product/spu/get-detail?id=${id}`
  })
}

/**
 * 获取商品分类
 * @returns {Promise<any>}
 */
export function getCategory() {
  return request.get({
    url: '/product/category/list'
  })
}

/**
 * 搜索商品
 * @param {Object} params - 搜索参数
 * @returns {Promise<any>}
 */
export function search(params) {
  return request.get({
    url: '/product/spu/page',
    params
  })
}

/**
 * 获取商品列表
 * @param {Object} params - 查询参数
 * @returns {Promise<any>}
 */
export function getList(params) {
  return request.get({
    url: '/product/spu/list',
    params
  })
}

/**
 * 获取商品评论列表
 * @param {Object} params - 查询参数
 * @returns {Promise<any>}
 */
export function getCommentList(params) {
  return request.get({
    url: '/product/comment/page',
    params
  })
}