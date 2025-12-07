import axios from '../utils/axios'
import * as userApi from '@/api/member/user'

/**
 * 获取用户信息
 * @returns {Promise<any>}
 */
export function getUserInfo() {
  // 兼容旧版接口
  return userApi.getUserInfo();
}

/**
 * 修改用户信息
 * @param {Object} params - 用户信息
 * @returns {Promise<any>}
 */
export function EditUserInfo(params) {
  // 兼容旧版接口
  return userApi.updateUserInfo(params);
}

/**
 * 用户登录
 * @param {Object} params - 登录信息
 * @returns {Promise<any>}
 */
export function login(params) {
  // 兼容旧版接口
  return userApi.login(params);
}

/**
 * 用户退出登录
 * @returns {Promise<any>}
 */
export function logout() {
  // 兼容旧版接口
  return userApi.logout();
}

/**
 * 用户注册
 * @param {Object} params - 注册信息
 * @returns {Promise<any>}
 */
export function register(params) {
  // 兼容旧版接口
  return userApi.register(params);
}

