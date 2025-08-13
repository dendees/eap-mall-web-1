import request from '@/service/request'

// 拍卖商品用户端 API
export const AuctionApi = {
  // 获取拍卖商品列表
  getAuctionProductList: (params) => {
    return request.get('/mall/auction-product/app/page', { params })
  },

  // 获取拍卖商品详情
  getAuctionProductDetail: (id) => {
    return request.get(`/mall/auction-product/app/get/${id}`)
  },

  // 获取拍卖商品竞拍状态
  getBiddingStatus: (auctionProductId) => {
    return request.get(`/mall/auction-bidding/app/status/${auctionProductId}`)
  },

  // 提交竞拍
  submitBid: (data) => {
    return request.post('/mall/auction-bidding/app/bid', data)
  },

  // 获取用户竞拍历史
  getUserBidHistory: (params) => {
    return request.get('/mall/auction-bidding/app/user-bids', { params })
  },

  // 获取拍品竞拍记录
  getProductBidRecords: (auctionProductId, params) => {
    return request.get(`/mall/auction-bidding/app/product-bids/${auctionProductId}`, { params })
  },

  // 注册参与拍卖（缴纳保证金）
  registerAuction: (data) => {
    return request.post('/mall/auction-registration/app/register', data)
  },

  // 获取用户拍卖注册状态
  getRegistrationStatus: (auctionProductId) => {
    return request.get(`/mall/auction-registration/app/status/${auctionProductId}`)
  },

  // 设置自动代拍
  setAutoBid: (data) => {
    return request.post('/mall/auction-auto-bid/app/set', data)
  },

  // 获取用户自动代拍设置
  getUserAutoBids: (params) => {
    return request.get('/mall/auction-auto-bid/app/user-auto-bids', { params })
  },

  // 取消自动代拍
  cancelAutoBid: (id) => {
    return request.delete(`/mall/auction-auto-bid/app/cancel/${id}`)
  },

  // 获取用户拍卖结果
  getUserAuctionResults: (params) => {
    return request.get('/mall/auction-result/app/user-results', { params })
  }
}