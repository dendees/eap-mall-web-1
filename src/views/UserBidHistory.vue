<template>
  <div class="bid-history">
    <div class="page-header">
      <h1>我的竞拍</h1>
      <div class="header-stats">
        <div class="stat-item">
          <span class="count">{{ statistics.totalBids || 0 }}</span>
          <span class="label">总竞拍次数</span>
        </div>
        <div class="stat-item">
          <span class="count">{{ statistics.wonAuctions || 0 }}</span>
          <span class="label">中标次数</span>
        </div>
        <div class="stat-item">
          <span class="count">¥{{ formatPrice(statistics.totalAmount || 0) }}</span>
          <span class="label">总成交额</span>
        </div>
      </div>
    </div>

    <!-- 筛选标签 -->
    <div class="filter-tabs">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.value"
        :class="['tab-btn', { active: activeTab === tab.value }]"
        @click="handleTabChange(tab.value)"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="count-badge">{{ tab.count }}</span>
      </button>
    </div>

    <!-- 竞拍记录列表 -->
    <div class="bid-records" v-loading="loading">
      <div 
        v-for="record in bidRecords" 
        :key="record.id"
        class="record-card"
      >
        <div class="record-header">
          <div class="product-info">
            <img :src="record.productPicUrl" :alt="record.productName" class="product-image" />
            <div class="product-details">
              <h3 class="product-name">{{ record.productName }}</h3>
              <div class="product-attributes">
                <span class="brand">{{ record.brand }}</span>
                <span class="grade" :class="getGradeClass(record.grade)" v-if="record.grade">
                  {{ getGradeText(record.grade) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="auction-status">
            <div class="status-badge" :class="getStatusClass(record.auctionStatus)">
              {{ getStatusText(record.auctionStatus) }}
            </div>
            <div class="auction-time">
              {{ formatTime(record.auctionEndTime) }}
            </div>
          </div>
        </div>

        <div class="record-content">
          <!-- 竞拍信息 -->
          <div class="bid-info">
            <div class="info-row">
              <span class="label">我的出价：</span>
              <span class="value bid-amount">¥{{ formatPrice(record.myBidAmount) }}</span>
            </div>
            <div class="info-row">
              <span class="label">出价次数：</span>
              <span class="value">{{ record.myBidCount }}</span>
            </div>
            <div class="info-row">
              <span class="label">最后出价：</span>
              <span class="value">{{ formatTime(record.lastBidTime) }}</span>
            </div>
          </div>

          <!-- 拍卖结果 -->
          <div class="auction-result">
            <div class="info-row">
              <span class="label">成交价：</span>
              <span class="value final-price">
                {{ record.finalPrice ? `¥${formatPrice(record.finalPrice)}` : '未成交' }}
              </span>
            </div>
            <div class="info-row" v-if="record.winner">
              <span class="label">中标者：</span>
              <span class="value">
                {{ record.isWinner ? '我' : record.winner.nickname }}
              </span>
            </div>
            <div class="info-row" v-if="record.isWinner">
              <span class="label">中标状态：</span>
              <span class="value winner-badge">🎉 恭喜中标</span>
            </div>
          </div>
        </div>

        <div class="record-actions">
          <button class="action-btn detail-btn" @click="viewDetail(record.auctionProductId)">
            查看详情
          </button>
          
          <button 
            v-if="record.isWinner && record.auctionStatus === 2" 
            class="action-btn pay-btn"
            @click="handlePayment(record)"
          >
            立即付款
          </button>
          
          <button 
            v-if="record.auctionStatus === 1" 
            class="action-btn bid-btn"
            @click="continueBidding(record.auctionProductId)"
          >
            继续竞拍
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && bidRecords.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">暂无竞拍记录</div>
      <button class="browse-btn" @click="$router.push('/auction')">
        去看看拍品
      </button>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="total > 0">
      <button 
        :disabled="queryParams.pageNo <= 1" 
        @click="changePage(queryParams.pageNo - 1)"
        class="page-btn"
      >
        上一页
      </button>
      
      <span class="page-info">
        第 {{ queryParams.pageNo }} 页，共 {{ Math.ceil(total / queryParams.pageSize) }} 页
      </span>
      
      <button 
        :disabled="queryParams.pageNo >= Math.ceil(total / queryParams.pageSize)" 
        @click="changePage(queryParams.pageNo + 1)"
        class="page-btn"
      >
        下一页
      </button>
    </div>

    <!-- 自动代拍管理弹窗 -->
    <div v-if="showAutoBidModal" class="modal-overlay" @click="closeAutoBidModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>自动代拍管理</h3>
          <button class="close-btn" @click="closeAutoBidModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="auto-bid-list">
            <div 
              v-for="autoBid in userAutoBids" 
              :key="autoBid.id"
              class="auto-bid-item"
            >
              <div class="auto-bid-info">
                <div class="product-name">{{ autoBid.productName }}</div>
                <div class="bid-settings">
                  <span>最高出价：¥{{ formatPrice(autoBid.maxBidAmount) }}</span>
                  <span class="status" :class="autoBid.status.toLowerCase()">
                    {{ autoBid.status === 'ACTIVE' ? '启用中' : '已停用' }}
                  </span>
                </div>
              </div>
              
              <div class="auto-bid-actions">
                <button 
                  class="action-btn edit-btn" 
                  @click="editAutoBid(autoBid)"
                >
                  编辑
                </button>
                <button 
                  class="action-btn cancel-btn" 
                  @click="cancelAutoBid(autoBid.id)"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="userAutoBids.length === 0" class="no-auto-bids">
            暂无自动代拍设置
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AuctionApi } from '@/api/auction'

export default {
  name: 'UserBidHistory',
  data() {
    return {
      loading: false,
      bidRecords: [],
      total: 0,
      activeTab: 'all',
      statistics: {},
      
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        status: ''
      },
      
      filterTabs: [
        { label: '全部', value: 'all', count: 0 },
        { label: '竞拍中', value: 'ongoing', count: 0 },
        { label: '已中标', value: 'won', count: 0 },
        { label: '未中标', value: 'lost', count: 0 },
        { label: '已流拍', value: 'failed', count: 0 }
      ],
      
      // 自动代拍管理
      showAutoBidModal: false,
      userAutoBids: []
    }
  },
  
  async created() {
    await this.loadBidHistory()
    await this.loadStatistics()
  },
  
  methods: {
    async loadBidHistory() {
      this.loading = true
      try {
        const params = { ...this.queryParams }
        if (this.activeTab !== 'all') {
          params.status = this.activeTab
        }
        
        const response = await AuctionApi.getUserBidHistory(params)
        this.bidRecords = response.data.list || []
        this.total = response.data.total || 0
        
        // 更新标签计数
        this.updateTabCounts(response.data.statusCounts || {})
      } catch (error) {
        console.error('加载竞拍历史失败:', error)
        this.$message.error('加载竞拍历史失败')
      } finally {
        this.loading = false
      }
    },
    
    async loadStatistics() {
      try {
        const response = await AuctionApi.getUserBidStatistics()
        this.statistics = response.data
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    },
    
    async loadUserAutoBids() {
      try {
        const response = await AuctionApi.getUserAutoBids({ pageNo: 1, pageSize: 50 })
        this.userAutoBids = response.data.list || []
      } catch (error) {
        console.error('加载自动代拍失败:', error)
      }
    },
    
    updateTabCounts(statusCounts) {
      this.filterTabs.forEach(tab => {
        tab.count = statusCounts[tab.value] || 0
      })
    },
    
    handleTabChange(tab) {
      this.activeTab = tab
      this.queryParams.pageNo = 1
      this.loadBidHistory()
    },
    
    changePage(page) {
      this.queryParams.pageNo = page
      this.loadBidHistory()
    },
    
    viewDetail(auctionProductId) {
      this.$router.push(`/auction/${auctionProductId}`)
    },
    
    continueBidding(auctionProductId) {
      this.$router.push(`/auction/${auctionProductId}?quickBid=true`)
    },
    
    handlePayment(record) {
      // 跳转到支付页面
      this.$router.push(`/pay/auction/${record.orderId}`)
    },
    
    async showAutoBidManagement() {
      this.showAutoBidModal = true
      await this.loadUserAutoBids()
    },
    
    closeAutoBidModal() {
      this.showAutoBidModal = false
    },
    
    editAutoBid(autoBid) {
      // 编辑自动代拍设置
      this.$router.push(`/auction/${autoBid.auctionProductId}?editAutoBid=${autoBid.id}`)
    },
    
    async cancelAutoBid(autoBidId) {
      try {
        await this.$confirm('确认要取消这个自动代拍设置吗？', '确认取消')
        await AuctionApi.cancelAutoBid(autoBidId)
        this.$message.success('自动代拍已取消')
        await this.loadUserAutoBids()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消自动代拍失败:', error)
          this.$message.error('取消自动代拍失败')
        }
      }
    },
    
    getStatusClass(status) {
      const statusMap = {
        0: 'upcoming',
        1: 'ongoing',
        2: 'ended', 
        3: 'failed'
      }
      return statusMap[status] || ''
    },
    
    getStatusText(status) {
      const statusMap = {
        0: '即将开始',
        1: '进行中',
        2: '已结束',
        3: '已流拍'
      }
      return statusMap[status] || '未知'
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
        'N': 'N级',
        'S': 'S级', 
        'A': 'A级',
        'AB': 'AB级',
        'B': 'B级',
        'BC': 'BC级',
        'C': 'C级',
        'D': 'D级'
      }
      return gradeMap[grade] || grade
    },
    
    formatPrice(price) {
      return (price / 100).toFixed(2)
    },
    
    formatTime(time) {
      return new Date(time).toLocaleString()
    }
  }
}
</script>

<style scoped>
.bid-history {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.page-header h1 {
  margin: 0;
  color: #333;
}

.header-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-item .count {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}

.stat-item .label {
  font-size: 14px;
  color: #666;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 0 20px;
}

.tab-btn {
  position: relative;
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.count-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc3545;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.bid-records {
  space-y: 20px;
}

.record-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.product-info {
  display: flex;
  gap: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.product-attributes {
  display: flex;
  gap: 10px;
}

.brand {
  background: #f8f9fa;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.grade {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
  font-weight: bold;
}

.grade-n, .grade-s { background: #28a745; }
.grade-a, .grade-ab { background: #17a2b8; }
.grade-b, .grade-bc { background: #ffc107; color: #333; }
.grade-c, .grade-d { background: #dc3545; }

.auction-status {
  text-align: right;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
}

.status-badge.upcoming { background: #6c757d; }
.status-badge.ongoing { background: #28a745; }
.status-badge.ended { background: #17a2b8; }
.status-badge.failed { background: #dc3545; }

.auction-time {
  font-size: 14px;
  color: #666;
}

.record-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 20px;
}

.bid-info, .auction-result {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  color: #666;
}

.info-row .value {
  font-weight: 500;
  color: #333;
}

.bid-amount {
  color: #007bff !important;
  font-weight: bold !important;
}

.final-price {
  color: #dc3545 !important;
  font-weight: bold !important;
}

.winner-badge {
  color: #28a745 !important;
  font-weight: bold !important;
}

.record-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.detail-btn {
  background: white;
  color: #333;
}

.detail-btn:hover {
  background: #f8f9fa;
}

.pay-btn {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.pay-btn:hover {
  background: #c82333;
}

.bid-btn {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.bid-btn:hover {
  background: #0056b3;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 20px;
}

.browse-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

/* 自动代拍弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.auto-bid-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  margin-bottom: 10px;
}

.auto-bid-info .product-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.bid-settings {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #666;
}

.status.active {
  color: #28a745;
}

.status.inactive {
  color: #dc3545;
}

.auto-bid-actions {
  display: flex;
  gap: 10px;
}

.edit-btn {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.cancel-btn {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.no-auto-bids {
  text-align: center;
  color: #666;
  padding: 40px;
}

@media (max-width: 768px) {
  .bid-history {
    padding: 10px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-stats {
    justify-content: center;
  }
  
  .filter-tabs {
    flex-wrap: wrap;
    padding: 0 10px;
  }
  
  .record-content {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .record-actions {
    justify-content: center;
  }
  
  .product-info {
    flex-direction: column;
    text-align: center;
  }
  
  .record-header {
    flex-direction: column;
    gap: 15px;
  }
}
</style>