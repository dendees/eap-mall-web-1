import axios from '../utils/axios'
import * as goodsApi from '@/api/product/goods'

/**
 * 获取商品详情
 * @param {number} id - 商品ID
 * @returns {Promise<any>}
 */
export function getDetail(id) {
  // 兼容旧版接口
  return goodsApi.getDetail(id);
}

/**
 * 获取商品分类
 * @returns {Promise<any>}
 */
export function getCategory() {
  // 兼容旧版接口
  return goodsApi.getCategory();
}

/**
 * 搜索商品
 * @param {Object} params - 搜索参数
 * @returns {Promise<any>}
 */
export function search(params) {
  // 兼容旧版接口
  return goodsApi.search(params);
}

