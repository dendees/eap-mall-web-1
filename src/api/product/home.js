import request from '@/utils/request'

/**
 * 获取首页信息
 * @returns {Promise<any>}
 */
export function getHome() {
  return request.get({
    url: '/product/home/index-infos'
  })
}

/**
 * 获取首页轮播图
 * @returns {Promise<any>}
 */
export function getBanners() {
  return request.get({
    url: '/product/home/banners'
  })
}

/**
 * 获取首页推荐商品
 * @returns {Promise<any>}
 */
export function getRecommendProducts() {
  return request.get({
    url: '/product/home/recommend-products'
  })
}

/**
 * 获取首页热门商品
 * @returns {Promise<any>}
 */
export function getHotProducts() {
  return request.get({
    url: '/product/home/hot-products'
  })
}

/**
 * 获取首页新品
 * @returns {Promise<any>}
 */
export function getNewProducts() {
  return request.get({
    url: '/product/home/new-products'
  })
}