import request from '@/utils/request'

/**
 * 认证相关API
 */
const AuthApi = {
  // 刷新令牌
  refreshToken: (refreshToken) => {
    return request.post({
      url: '/member/auth/refresh-token',
      data: {
        refreshToken
      }
    })
  }
}

export default AuthApi