import request from '@/utils/request'

/**
 * 获取用户信息
 * @returns {Promise<any>}
 */
export function getUserInfo() {
  return request.get({
    url: '/member/user/get-info'
  })
}

/**
 * 修改用户信息
 * @param {Object} data - 用户信息
 * @returns {Promise<any>}
 */
export function updateUserInfo(data) {
  return request.put({
    url: '/member/user/update',
    data
  })
}

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @returns {Promise<any>}
 */
export function login(data) {
  return request.post({
    url: '/member/auth/login',
    data
  })
}

/**
 * 用户退出登录
 * @returns {Promise<any>}
 */
export function logout() {
  return request.post({
    url: '/member/auth/logout'
  })
}

/**
 * 用户注册
 * @param {Object} data - 注册信息
 * @returns {Promise<any>}
 */
export function register(data) {
  return request.post({
    url: '/member/auth/register',
    data
  })
}

/**
 * 刷新令牌
 * @param {string} refreshToken - 刷新令牌
 * @returns {Promise<any>}
 */
export function refreshToken(refreshToken) {
  return request.post({
    url: '/member/auth/refresh-token',
    data: {
      refreshToken
    }
  })
}