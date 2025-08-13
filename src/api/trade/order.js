import request from '@/utils/request'

/**
 * 创建订单
 * @param {Object} data - 订单信息
 * @returns {Promise<any>}
 */
export function createOrder(data) {
  return request.post({
    url: '/trade/order/create',
    data
  })
}

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 * @returns {Promise<any>}
 */
export function getOrderList(params) {
  return request.get({
    url: '/trade/order/page',
    params
  })
}

/**
 * 获取订单详情
 * @param {number} id - 订单ID
 * @returns {Promise<any>}
 */
export function getOrderDetail(id) {
  return request.get({
    url: `/trade/order/get-detail?id=${id}`
  })
}

/**
 * 取消订单
 * @param {number} id - 订单ID
 * @returns {Promise<any>}
 */
export function cancelOrder(id) {
  return request.put({
    url: '/trade/order/cancel',
    data: {
      id
    }
  })
}

/**
 * 确认收货
 * @param {number} id - 订单ID
 * @returns {Promise<any>}
 */
export function confirmOrder(id) {
  return request.put({
    url: '/trade/order/receive',
    data: {
      id
    }
  })
}

/**
 * 支付订单
 * @param {Object} data - 支付信息
 * @returns {Promise<any>}
 */
export function payOrder(data) {
  return request.post({
    url: '/pay/order/submit',
    data
  })
}

/**
 * 获取订单物流信息
 * @param {number} id - 订单ID
 * @returns {Promise<any>}
 */
export function getOrderLogistics(id) {
  return request.get({
    url: `/trade/order/get-logistics?id=${id}`
  })
}