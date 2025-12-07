import axios from 'axios'
import { showToast, showFailToast } from 'vant'
import { getAccessToken, formatToken } from '@/utils/auth'
import router from '../router'

 // API基础路径配置
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL
axios.defaults.withCredentials = false
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

// 设置请求头中的token
const token = getAccessToken()
if (token) {
  axios.defaults.headers['Authorization'] = formatToken(token)
}

// 设置租户ID
if (import.meta.env.VITE_APP_TENANT_ENABLE === 'true') {
  const tenantId = import.meta.env.VITE_APP_TENANT_ID
  if (tenantId) {
    axios.defaults.headers['tenant-id'] = tenantId
  }
}

axios.defaults.headers.post['Content-Type'] = 'application/json'
 
 // 响应拦截器
axios.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 二进制数据直接返回
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return data
    }
    
    // 未设置状态码则默认成功状态
    const code = data.code || 200
    // 获取错误信息
    const msg = data.msg || '系统未知错误，请反馈给管理员'
    
    if (code === 401) {
      // 未登录或token过期
      showFailToast('登录状态已过期，请重新登录')
      router.push({ path: '/login' })
      return Promise.reject('登录状态已过期')
    } else if (code === 500) {
      showFailToast('系统错误')
      return Promise.reject(new Error(msg))
    } else if (code !== 0 && code !== 200) {
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
 
 export default axios
 