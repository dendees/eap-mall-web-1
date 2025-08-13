import request from '@/utils/request'

/**
 * 添加商品到购物车
 * @param {Object} data - 购物车商品信息
 * @returns {Promise<any>}
 */
export function addCart(data) {
  return request.post({
    url: '/trade/cart/add',
    data
  })
}

/**
 * 修改购物车商品数量
 * @param {Object} data - 购物车商品信息
 * @returns {Promise<any>}
 */
export function updateCartItem(data) {
  return request.put({
    url: '/trade/cart/update',
    data
  })
}

/**
 * 获取购物车列表
 * @returns {Promise<any>}
 */
export function getCart() {
  return request.get({
    url: '/trade/cart/list'
  })
}

/**
 * 删除购物车商品
 * @param {number[]} ids - 购物车商品ID数组
 * @returns {Promise<any>}
 */
export function deleteCartItem(ids) {
  return request.delete({
    url: '/trade/cart/delete',
    data: ids
  })
}

/**
 * 根据购物车商品ID获取商品信息
 * @param {number[]} ids - 购物车商品ID数组
 * @returns {Promise<any>}
 */
export function getByCartItemIds(ids) {
  return request.get({
    url: '/trade/cart/get-by-ids',
    params: {
      ids: ids.join(',')
    }
  })
}

/**
 * 获取购物车商品数量
 * @returns {Promise<any>}
 */
export function getCartCount() {
  return request.get({
    url: '/trade/cart/count'
  })
}