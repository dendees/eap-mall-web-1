import request from '@/utils/request'

/**
 * 添加收货地址
 * @param {Object} data - 地址信息
 * @returns {Promise<any>}
 */
export function addAddress(data) {
  return request.post({
    url: '/member/address/create',
    data
  })
}

/**
 * 编辑收货地址
 * @param {Object} data - 地址信息
 * @returns {Promise<any>}
 */
export function updateAddress(data) {
  return request.put({
    url: '/member/address/update',
    data
  })
}

/**
 * 删除收货地址
 * @param {number} id - 地址ID
 * @returns {Promise<any>}
 */
export function deleteAddress(id) {
  return request.delete({
    url: `/member/address/delete?id=${id}`
  })
}

/**
 * 获取默认收货地址
 * @returns {Promise<any>}
 */
export function getDefaultAddress() {
  return request.get({
    url: '/member/address/get-default'
  })
}

/**
 * 获取收货地址列表
 * @returns {Promise<any>}
 */
export function getAddressList() {
  return request.get({
    url: '/member/address/list'
  })
}

/**
 * 获取收货地址详情
 * @param {number} id - 地址ID
 * @returns {Promise<any>}
 */
export function getAddressDetail(id) {
  return request.get({
    url: `/member/address/get?id=${id}`
  })
}

/**
 * 设置默认收货地址
 * @param {number} id - 地址ID
 * @returns {Promise<any>}
 */
export function setDefaultAddress(id) {
  return request.put({
    url: '/member/address/set-default',
    data: {
      id
    }
  })
}