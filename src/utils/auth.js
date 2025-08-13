// Token键名
const AccessTokenKey = 'ACCESS_TOKEN'
const RefreshTokenKey = 'REFRESH_TOKEN'
const TenantIdKey = 'TENANT_ID'

/**
 * 获取访问令牌
 * @returns {string} 访问令牌
 */
export const getAccessToken = () => {
  return localStorage.getItem(AccessTokenKey)
}

/**
 * 获取刷新令牌
 * @returns {string} 刷新令牌
 */
export const getRefreshToken = () => {
  return localStorage.getItem(RefreshTokenKey)
}

/**
 * 设置令牌
 * @param {Object} token 令牌对象，包含accessToken和refreshToken
 */
export const setToken = (token) => {
  localStorage.setItem(RefreshTokenKey, token.refreshToken)
  localStorage.setItem(AccessTokenKey, token.accessToken)
}

/**
 * 删除令牌
 */
export const removeToken = () => {
  localStorage.removeItem(AccessTokenKey)
  localStorage.removeItem(RefreshTokenKey)
}

/**
 * 格式化令牌（JWT格式）
 * @param {string} token 原始令牌
 * @returns {string} 格式化后的令牌
 */
export const formatToken = (token) => {
  return 'Bearer ' + token
}

/**
 * 获取租户ID
 * @returns {string} 租户ID
 */
export const getTenantId = () => {
  return localStorage.getItem(TenantIdKey)
}

/**
 * 设置租户ID
 * @param {string} tenantId 租户ID
 */
export const setTenantId = (tenantId) => {
  localStorage.setItem(TenantIdKey, tenantId)
}