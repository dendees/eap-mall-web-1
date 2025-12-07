import axios from '../utils/axios'
import * as cartApi from '@/api/trade/cart'

/**
 * 添加商品到购物车
 * @param {Object} params - 购物车商品信息
 * @returns {Promise<any>}
 */
export function addCart(params) {
  // 兼容旧版接口
  return cartApi.addCart(params);
}

/**
 * 修改购物车商品数量
 * @param {Object} params - 购物车商品信息
 * @returns {Promise<any>}
 */
export function modifyCart(params) {
  // 兼容旧版接口
  return cartApi.updateCartItem(params);
}

/**
 * 获取购物车列表
 * @param {Object} params - 查询参数
 * @returns {Promise<any>}
 */
export function getCart(params) {
  // 兼容旧版接口
  return cartApi.getCart();
}

/**
 * 删除购物车商品
 * @param {number} id - 购物车商品ID
 * @returns {Promise<any>}
 */
export function deleteCartItem(id) {
  // 兼容旧版接口
  return cartApi.deleteCartItem([id]);
}

/**
 * 根据购物车商品ID获取商品信息
 * @param {Object} params - 查询参数
 * @returns {Promise<any>}
 */
export function getByCartItemIds(params) {
  // 兼容旧版接口
  return cartApi.getByCartItemIds(params.cartItemIds);
}

