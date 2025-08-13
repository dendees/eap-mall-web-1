import axios from '../utils/axios'
import * as homeApi from '@/api/product/home'

/**
 * 获取首页信息
 * @returns {Promise<any>}
 */
export function getHome() {
  // 兼容旧版接口
  return homeApi.getHome();
}

