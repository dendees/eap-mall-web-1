import axios from '../utils/axios'
import * as addressApi from '@/api/member/address'

/**
 * 添加收货地址
 * @param {Object} params - 地址信息
 * @returns {Promise<any>}
 */
export function addAddress(params) {
  // 兼容旧版接口
  return addressApi.addAddress(params);
}

/**
 * 编辑收货地址
 * @param {Object} params - 地址信息
 * @returns {Promise<any>}
 */
export function EditAddress(params) {
  // 兼容旧版接口
  return addressApi.updateAddress(params);
}

/**
 * 删除收货地址
 * @param {number} id - 地址ID
 * @returns {Promise<any>}
 */
export function DeleteAddress(id) {
  // 兼容旧版接口
  return addressApi.deleteAddress(id);
}

/**
 * 获取默认收货地址
 * @returns {Promise<any>}
 */
export function getDefaultAddress() {
  // 兼容旧版接口
  return addressApi.getDefaultAddress();
}

/**
 * 获取收货地址列表
 * @returns {Promise<any>}
 */
export function getAddressList() {
  // 兼容旧版接口
  return addressApi.getAddressList();
}

/**
 * 获取收货地址详情
 * @param {number} id - 地址ID
 * @returns {Promise<any>}
 */
export function getAddressDetail(id) {
  // 兼容旧版接口
  return addressApi.getAddressDetail(id);
}


