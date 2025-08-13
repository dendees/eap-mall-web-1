<template>
  <div class="auction-detail">
    <!-- 商品图片轮播 -->
    <div class="product-gallery">
      <div class="main-image">
        <img :src="productDetail.productPicUrl" :alt="productDetail.productName" />
      </div>
    </div>

    <!-- 商品基本信息 -->
    <div class="product-info">
      <h1 class="product-title">{{ productDetail.productName }}</h1>
      
      <!-- 奢侈品特殊属性 -->
      <div class="luxury-attributes" v-if="productDetail.brand">
        <div class="attribute-row">
          <span class="label">品牌：</span>
          <span class="value">{{ productDetail.brand }}</span>
        </div>
        <div class="attribute-row" v-if="productDetail.category">
          <span class="label">类别：</span>
          <span class="value">{{ productDetail.category }}</span>
        </div>
        <div class="attribute-row" v-if="productDetail.grade">
          <span class="label">品级：</span>
          <span class="value grade" :class="getGradeClass(productDetail.grade)">
            {{ getGradeText(productDetail.grade) }}
          </span>
        </div>
        <div class="attribute-row" v-if="productDetail.conditionExternal">
          <span class="label">外观成色：</span>
          <span class="value">{{ productDetail.conditionExternal }}</span>
        </div>
        <div class="attribute-row" v-if="productDetail.conditionInternal">
          <span class="label">内部成色：</span>
          <span class="value">{{ productDetail.conditionInternal }}</span>
        </div>
      </div>

      <!-- 拍卖信息 -->
      <div class="auction-info">
        <div class="price-section">
          <div class="current-price">
            <span class="label">当前价：</span>
            <span class="price">¥{{ formatPrice(biddingStatus.currentPrice || productDetail.startPrice) }}</span>
          </div>
          <div class="start-price">
            <span class="label">起拍价：</span>
            <span class="price">¥{{ formatPrice(productDetail.startPrice) }}</span>
          </div>
        </div>

        <div class="auction-status">
          <div class="status-item">
            <span class="label">竞拍次数：</span>
            <span class="value">{{ biddingStatus.bidCount || 0 }}</span>
          </div>
          <div class="status-item">
            <span class="label">保证金：</span>
            <span class="value">¥{{ formatPrice(productDetail.deposit) }}</span>
          </div>
          <div class="status-item">
            <span class="label">加价幅度：</span>
            <span class="value">¥{{ formatPrice(productDetail.incrementAmount) }}</span>
          </div>
        </div>

        <!-- 倒计时 -->
        <div class="countdown-section" v-if="productDetail.status === 1">
          <div class="countdown-label">剩余时间：</div>
          <div class="countdown-timer">
            <div class="time-unit">
              <span class="number">{{ countdown.days }}</span>
              <span class="unit">天</span>
            </div>
            <div class="time-unit">
              <span class="number">{{ countdown.hours }}</span>
              <span class="unit">时</span>
            </div>
            <div class="time-unit">
              <span class="number">{{ countdown.minutes }}</span>
              <span class="unit">分</span>
            </div>
            <div class="time-unit">
              <span class="number">{{ countdown.seconds }}</span>
              <span class="unit">秒</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 竞拍操作区 -->
    <div class="bidding-section">
      <!-- 注册状态 -->
      <div class="registration-status" v-if="!registrationStatus.registered">
        <div class="warning-message">
          <i class="icon-warning"></i>
          <span>您需要先缴纳保证金才能参与竞拍</span>
        </div>
        <button class="register-btn" @click="handleRegister" :disabled="registering">
          {{ registering ? '处理中...' : `缴纳保证金 ¥${formatPrice(productDetail.deposit)}` }}
        </button>
      </div>

      <!-- 竞拍操作 -->
      <div class="bidding-actions" v-else-if="productDetail.status === 1">
        <div class="bid-input-section">
          <div class="current-leader" v-if="biddingStatus.leadingBidder">
            <span class="label">当前领先：</span>
            <span class="bidder">{{ biddingStatus.leadingBidder.nickname }}</span>
          </div>
          
          <div class="bid-input-group">
            <input 
              type="number" 
              v-model="bidAmount" 
              :min="getMinBidAmount()"
              :step="productDetail.incrementAmount / 100"
              placeholder="请输入出价金额"
              class="bid-input"
            />
            <button class="bid-btn" @click="handleBid" :disabled="bidding || !canBid">
              {{ bidding ? '出价中...' : '出价' }}
            </button>
          </div>

          <div class="quick-bid-buttons">
            <button 
              v-for="increment in quickBidIncrements" 
              :key="increment"
              class="quick-bid-btn"
              @click="setQuickBid(increment)"
            >
              +¥{{ increment }}
            </button>
          </div>
        </div>

        <!-- 自动代拍设置 -->
        <div class="auto-bid-section">
          <div class="auto-bid-toggle">
            <label class="toggle-label">
              <input 
                type="checkbox" 
                v-model="autoBidEnabled" 
                @change="handleAutoBidToggle"
              />
              <span class="toggle-text">启用自动代拍</span>
            </label>
          </div>
          
          <div class="auto-bid-settings" v-if="autoBidEnabled">
            <div class="setting-item">
              <label>最高出价：</label>
              <input 
                type="number" 
                v-model="autoBidMaxAmount" 
                :min="getMinBidAmount()"
                placeholder="设置自动代拍最高金额"
                class="auto-bid-input"
              />
            </div>
            <button class="save-auto-bid-btn" @click="handleSaveAutoBid" :disabled="savingAutoBid">
              {{ savingAutoBid ? '保存中...' : '保存设置' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 拍卖结束状态 -->
      <div class="auction-ended" v-else>
        <div class="end-status">
          <span class="status-text">
            {{ productDetail.status === 2 ? '拍卖已结束' : '拍卖已流拍' }}
          </span>
          <div v-if="productDetail.status === 2 && biddingStatus.winner">
            <span class="winner-info">
              中标者：{{ biddingStatus.winner.nickname }}
            </span>
            <span class="final-price">
              成交价：¥{{ formatPrice(biddingStatus.finalPrice) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 竞拍记录 -->
    <div class="bid-records-section">
      <div class="section-header">
        <h3>竞拍记录</h3>
        <button class="refresh-btn" @click="loadBidRecords">刷新</button>
      </div>
      
      <div class="bid-records-list">
        <div 
          v-for="record in bidRecords" 
          :key="record.id"
          class="bid-record-item"
        >
          <div class="bidder-info">
            <span class="bidder-name">{{ record.bidder.nickname }}</span>
            <span class="bid-type" :class="record.bidType.toLowerCase()">
              {{ record.bidType === 'MANUAL' ? '手动' : '自动' }}
            </span>
          </div>
          <div class="bid-amount">¥{{ formatPrice(record.bidAmount) }}</div>
          <div class="bid-time">{{ formatTime(record.bidTime) }}</div>
        </div>
        
        <div v-if="bidRecords.length === 0" class="no-records">
          暂无竞拍记录
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AuctionApi } from '@/api/auction'

export default {
  name: 'AuctionDetail',
  data() {
    return {
      productDetail: {},
      biddingStatus: {},
      registrationStatus: { registered: false },
      bidRecords: [],
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      
      // 竞拍相关
      bidAmount: '',
      bidding: false,
      registering: false,
      
      // 自动代拍相关
      autoBidEnabled: false,
      autoBidMaxAmount: '',
      savingAutoBid: false,
      
      // 快速出价金额
      quickBidIncrements: [10, 50, 100, 200, 500],
      
      // 定时器
      countdownTimer: null,
      statusTimer: null
    }
  },
  
  computed: {
    canBid() {
      const minAmount = this.getMinBidAmount()
      return this.bidAmount >= minAmount && this.registrationStatus.registered
    }
  },
  
  async created() {
    const id = this.$route.params.id
    await this.loadProductDetail(id)
    await this.loadBiddingStatus(id)
    await this.loadRegistrationStatus(id)
    await this.loadBidRecords()
    
    this.startCountdown()
    this.startStatusPolling()
  },
  
  beforeUnmount() {
    this.stopCountdown()
    this.stopStatusPolling()
  },
  
  methods: {
    async loadProductDetail(id) {
      try {
        const response = await AuctionApi.getAuctionProductDetail(id)
        this.productDetail = response.data
      } catch (error) {
        console.error('加载商品详情失败:', error)
        this.$message.error('加载商品详情失败')
      }
    },
    
    async loadBiddingStatus(id) {
      try {
        const response = await AuctionApi.getBiddingStatus(id)
        this.biddingStatus = response.data
      } catch (error) {
        console.error('加载竞拍状态失败:', error)
      }
    },
    
    async loadRegistrationStatus(id) {
      try {
        const response = await AuctionApi.getRegistrationStatus(id)
        this.registrationStatus = response.data
      } catch (error) {
        console.error('加载注册状态失败:', error)
      }
    },
    
    async loadBidRecords() {
      try {
        const response = await AuctionApi.getProductBidRecords(this.productDetail.id, {
          pageNo: 1,
          pageSize: 20
        })
        this.bidRecords = response.data.list || []
      } catch (error) {
        console.error('加载竞拍记录失败:', error)
      }
    },
    
    async handleRegister() {
      this.registering = true
      try {
        await AuctionApi.registerAuction({
          auctionProductId: this.productDetail.id,
          depositAmount: this.productDetail.deposit
        })
        this.$message.success('保证金缴纳成功')
        await this.loadRegistrationStatus(this.productDetail.id)
      } catch (error) {
        console.error('注册失败:', error)
        this.$message.error('保证金缴纳失败')
      } finally {
        this.registering = false
      }
    },
    
    async handleBid() {
      if (!this.canBid) return
      
      this.bidding = true
      try {
        await AuctionApi.submitBid({
          auctionProductId: this.productDetail.id,
          bidAmount: Math.round(this.bidAmount * 100) // 转换为分
        })
        this.$message.success('出价成功')
        this.bidAmount = ''
        await this.loadBiddingStatus(this.productDetail.id)
        await this.loadBidRecords()
      } catch (error) {
        console.error('出价失败:', error)
        this.$message.error(error.message || '出价失败')
      } finally {
        this.bidding = false
      }
    },
    
    setQuickBid(increment) {
      const currentPrice = this.biddingStatus.currentPrice || this.productDetail.startPrice
      this.bidAmount = (currentPrice / 100 + increment).toFixed(2)
    },
    
    async handleAutoBidToggle() {
      if (!this.autoBidEnabled) {
        // 取消自动代拍
        try {
          // 这里需要获取当前的自动代拍ID并取消
          this.$message.success('自动代拍已取消')
        } catch (error) {
          console.error('取消自动代拍失败:', error)
        }
      }
    },
    
    async handleSaveAutoBid() {
      if (!this.autoBidMaxAmount) {
        this.$message.error('请设置最高出价金额')
        return
      }
      
      this.savingAutoBid = true
      try {
        await AuctionApi.setAutoBid({
          auctionProductId: this.productDetail.id,
          maxBidAmount: Math.round(this.autoBidMaxAmount * 100)
        })
        this.$message.success('自动代拍设置成功')
      } catch (error) {
        console.error('设置自动代拍失败:', error)
        this.$message.error('设置自动代拍失败')
      } finally {
        this.savingAutoBid = false
      }
    },
    
    getMinBidAmount() {
      const currentPrice = this.biddingStatus.currentPrice || this.productDetail.startPrice
      return (currentPrice + this.productDetail.incrementAmount) / 100
    },
    
    getGradeClass(grade) {
      const gradeMap = {
        'N': 'grade-n',
        'S': 'grade-s', 
        'A': 'grade-a',
        'AB': 'grade-ab',
        'B': 'grade-b',
        'BC': 'grade-bc',
        'C': 'grade-c',
        'D': 'grade-d'
      }
      return gradeMap[grade] || ''
    },
    
    getGradeText(grade) {
      const gradeMap = {
        'N': 'N级 (全新)',
        'S': 'S级 (近全新)',
        'A': 'A级 (优秀)',
        'AB': 'AB级 (良好)',
        'B': 'B级 (一般)',
        'BC': 'BC级 (较差)',
        'C': 'C级 (差)',
        'D': 'D级 (很差)'
      }
      return gradeMap[grade] || grade
    },
    
    formatPrice(price) {
      return (price / 100).toFixed(2)
    },
    
    formatTime(time) {
      return new Date(time).toLocaleString()
    },
    
    startCountdown() {
      if (!this.productDetail.endTime) return
      
      this.countdownTimer = setInterval(() => {
        const now = new Date().getTime()
        const endTime = new Date(this.productDetail.endTime).getTime()
        const distance = endTime - now
        
        if (distance > 0) {
          this.countdown = {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          }
        } else {
          this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 }
          this.stopCountdown()
          this.loadBiddingStatus(this.productDetail.id)
        }
      }, 1000)
    },
    
    stopCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
    },
    
    startStatusPolling() {
      this.statusTimer = setInterval(() => {
        this.loadBiddingStatus(this.productDetail.id)
        this.loadBidRecords()
      }, 5000) // 每5秒刷新一次状态
    },
    
    stopStatusPolling() {
      if (this.statusTimer) {
        clearInterval(this.statusTimer)
        this.statusTimer = null
      }
    }
  }
}
</script>

<style scoped>
.auction-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-gallery {
  margin-bottom: 30px;
}

.main-image img {
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 8px;
}

.product-info {
  margin-bottom: 30px;
}

.product-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.luxury-attributes {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.attribute-row {
  display: flex;
  margin-bottom: 10px;
}

.attribute-row .label {
  width: 100px;
  color: #666;
  font-weight: 500;
}

.attribute-row .value {
  color: #333;
}

.grade {
  padding: 2px 8px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
}

.grade-n, .grade-s { background: #28a745; }
.grade-a, .grade-ab { background: #17a2b8; }
.grade-b, .grade-bc { background: #ffc107; color: #333; }
.grade-c, .grade-d { background: #dc3545; }

.auction-info {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
}

.price-section {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.current-price .price {
  font-size: 28px;
  font-weight: bold;
  color: #dc3545;
}

.start-price .price {
  font-size: 18px;
  color: #666;
}

.auction-status {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.status-item .label {
  color: #666;
  margin-right: 8px;
}

.countdown-section {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 10px;
  border-radius: 8px;
  min-width: 60px;
}

.time-unit .number {
  font-size: 24px;
  font-weight: bold;
  color: #dc3545;
}

.time-unit .unit {
  font-size: 12px;
  color: #666;
}

.bidding-section {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.registration-status {
  text-align: center;
  padding: 20px;
}

.warning-message {
  color: #856404;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
}

.register-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.register-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.bid-input-section {
  margin-bottom: 20px;
}

.current-leader {
  margin-bottom: 15px;
  padding: 10px;
  background: #e7f3ff;
  border-radius: 4px;
}

.bid-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.bid-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.bid-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.bid-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.quick-bid-buttons {
  display: flex;
  gap: 10px;
}

.quick-bid-btn {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.quick-bid-btn:hover {
  background: #e9ecef;
}

.auto-bid-section {
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
}

.auto-bid-toggle {
  margin-bottom: 15px;
}

.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-text {
  margin-left: 8px;
}

.auto-bid-settings {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.auto-bid-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.save-auto-bid-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.auction-ended {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-text {
  font-size: 18px;
  font-weight: bold;
  color: #666;
}

.winner-info, .final-price {
  display: block;
  margin-top: 10px;
  font-size: 16px;
}

.final-price {
  color: #dc3545;
  font-weight: bold;
}

.bid-records-section {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: #333;
}

.refresh-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.bid-record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.bid-record-item:last-child {
  border-bottom: none;
}

.bidder-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bid-type {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: white;
}

.bid-type.manual {
  background: #007bff;
}

.bid-type.auto {
  background: #28a745;
}

.bid-amount {
  font-weight: bold;
  color: #dc3545;
}

.bid-time {
  color: #666;
  font-size: 14px;
}

.no-records {
  text-align: center;
  color: #666;
  padding: 30px;
}

@media (max-width: 768px) {
  .auction-detail {
    padding: 10px;
  }
  
  .price-section,
  .auction-status {
    flex-direction: column;
    gap: 10px;
  }
  
  .countdown-timer {
    gap: 8px;
  }
  
  .time-unit {
    min-width: 50px;
    padding: 8px;
  }
  
  .bid-input-group {
    flex-direction: column;
  }
  
  .quick-bid-buttons {
    flex-wrap: wrap;
  }
}
</style>