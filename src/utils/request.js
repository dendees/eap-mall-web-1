import axios from 'axios'
import { showToast, showFailToast, closeToast } from 'vant'
import { getAccessToken, getRefreshToken, getTenantId, removeToken, setToken } from '@/utils/auth'
import router from '../router'

// 是否正在刷新中
let isRefreshToken = false
// 请求队列
let requestList = []
// 是否显示重新登录
const isRelogin = { show: false }
// 请求白名单，无须token的接口
const whiteList = ['/login', '/refresh-token']

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL,
  timeout: 30000,
  withCredentials: false // 禁用 Cookie 等信息
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    let isToken = (config.headers || {}).isToken === false
    whiteList.some((v) => {
      if (config.url) {
        config.url.indexOf(v) > -1
        return (isToken = false)
      }
    })
    if (getAccessToken() && !isToken) {
      config.headers.Authorization = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token
    }
    // 设置租户
    if (import.meta.env.VITE_APP_TENANT_ENABLE === 'true') {
      const tenantId = getTenantId()
      if (tenantId) config.headers['tenant-id'] = tenantId
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  async (response) => {
    const { data } = response
    const config = response.config
    if (!data) {
      // 返回"[HTTP]请求没有返回值";
      throw new Error()
    }
    // 未设置状态码则默认成功状态
    const code = data.code || 200
    // 获取错误信息
    const msg = data.msg || '系统未知错误，请反馈给管理员'
    // 二进制数据则直接返回
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return data
    }
    // 如果是401，并且未进行刷新令牌，说明可能是访问令牌过期了
    if (code === 401 && !isRefreshToken) {
      isRefreshToken = true
      // 1. 如果获取不到刷新令牌，则只能执行登出操作
      if (!getRefreshToken()) {
        return handleAuthorized()
      }
      // 2. 进行刷新访问令牌
      try {
        const refreshTokenRes = await refreshToken()
        // 2.1 刷新成功，则回放队列的请求 + 当前请求
        setToken(refreshTokenRes.data.data)
        config.headers.Authorization = 'Bearer ' + getAccessToken()
        requestList.forEach((cb) => {
          cb()
        })
        requestList = []
        return service(config)
      } catch (e) {
        // 2.2 刷新失败，只回放队列的请求
        requestList.forEach((cb) => {
          cb()
        })
        // 提示是否要登出
        return handleAuthorized()
      } finally {
        requestList = []
        isRefreshToken = false
      }
    } else if (isRefreshToken) {
      // 添加到队列，等待刷新获取到新的令牌
      return new Promise((resolve) => {
        requestList.push(() => {
          config.headers.Authorization = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token
          resolve(service(config))
        })
      })
    } else if (code === 500) {
      showFailToast('系统错误')
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      showFailToast(msg)
      return Promise.reject('error')
    } else {
      return data
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    let { message } = error
    if (message === 'Network Error') {
      message = '网络异常'
    } else if (message.includes('timeout')) {
      message = '请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    showFailToast(message)
    return Promise.reject(error)
  }
)

// 刷新访问令牌
const refreshToken = async () => {
  // 设置租户ID
  if (import.meta.env.VITE_APP_TENANT_ENABLE === 'true') {
    axios.defaults.headers.common['tenant-id'] = getTenantId()
  }
  return await axios.post(
    import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/auth/refresh-token?refreshToken=' + getRefreshToken()
  )
}

// 处理认证失败
const handleAuthorized = () => {
  if (!isRelogin.show) {
    isRelogin.show = true
    showFailToast('登录状态已过期，请重新登录')
    removeToken()
    isRelogin.show = false
    router.push({ path: '/login' })
  }
  return Promise.reject('登录状态已过期')
}

// 封装请求方法
const request = (option) => {
  const { url, method, params, data, headersType, responseType, ...config } = option
  return service({
    url: url,
    method,
    params,
    data,
    ...config,
    responseType: responseType,
    headers: {
      'Content-Type': headersType || 'application/json'
    }
  })
}

// 导出封装的请求方法
export default {
  get: async (option) => {
    const res = await request({ method: 'GET', ...option })
    return res.data
  },
  post: async (option) => {
    const res = await request({ method: 'POST', ...option })
    return res.data
  },
  postOriginal: async (option) => {
    const res = await request({ method: 'POST', ...option })
    return res
  },
  delete: async (option) => {
    const res = await request({ method: 'DELETE', ...option })
    return res.data
  },
  put: async (option) => {
    const res = await request({ method: 'PUT', ...option })
    return res.data
  },
  download: async (option) => {
    const res = await request({ method: 'GET', responseType: 'blob', ...option })
    return res
  },
  upload: async (option) => {
    option.headersType = 'multipart/form-data'
    const res = await request({ method: 'POST', ...option })
    return res
  }
}