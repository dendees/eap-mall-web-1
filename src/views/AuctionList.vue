<template>
  <div class="auction-list">
    <!-- 搜索筛选 -->
    <div class="search-filters">
      <div class="search-bar">
        <input 
          v-model="searchParams.productName" 
          placeholder="搜索拍品名称..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>
      
      <div class="filter-tabs">
        <button 
          v-for="status in statusTabs" 
          :key="status.value"
          :class="['tab-btn', { active: searchParams.status === status.value }]"
          @click="handleStatusFilter(status.value)"
        >
          {{ status.label }}
        </button>
      </div>
      
      <div class="filter-options">
        <select v-model="searchParams.brand" @change="handleSearch" class="filter-select">
          <option value="">全部品牌</option>
          <option v-for="brand in brandOptions" :key="brand" :value="brand">
            {{ brand }}
          </option>
        </select>
        
        <select v-model="searchParams.category" @change="handleSearch" class="filter-select">
          <option value="">全部类别</option>
          <option v-for="category in categoryOptions" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        
        <select v-model="searchParams.grade" @change="handleSearch" class="filter-select">
          <option value="">全部品级</option>
          <option v-for="grade in gradeOptions" :key="grade.value" :value="grade.value">
            {{ grade.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- 拍品列表 -->
    <div class="auction-grid" v-loading="loading">
      <div 
        v-for="item in auctionList" 
        :key="item.id"
        class="auction-card"
        @click="goToDetail(item.id)"
      >
        <div class="card-image">
          <img :src="item.productPicUrl" :alt="item.productName" />
          <div class="status-badge" :class="getStatusClass(item.status)">
            {{ getStatusText(item.status) }}
          </div>
          <div class="countdown-overlay" v-if="item.status === 1">
            <div class="countdown-text">
              {{ getCountdownText(item.endTime) }}
            </div>
          </div>
        </div>
        
        <div class="card-content">
          <h3 class="product-title">{{ item.productName }}</h3>
          
          <div class="product-attributes">
            <span class="brand">{{ item.brand }}</span>
            <span class="grade" :class="getGradeClass(item.grade)" v-if="item.grade">
              {{ getGradeText(item.grade) }}
            </span>
          </div>
          
          <div class="price-info">
            <div class="current-price">
              <span class="label">当前价：</span>
              <span class="price">¥{{ formatPrice(item.currentPrice || item.startPrice) }}</span>
            </div>
            <div class="start-price">
              <span class="label">起拍价：</span>
              <span class="price">¥{{ formatPrice(item.startPrice) }}</span>
            </div>
          </div>
          
          <div class="auction-stats">
            <div class="stat-item">
              <span class="count">{{ item.bidCount || 0 }}</span>
              <span class="label">次竞拍</span>
            </div>
            <div class="stat-item">
              <span class="count">¥{{ formatPrice(item.deposit) }}</span>
              <span class="label">保证金</span>
            </div>
          </div>
          
          <div class="card-actions">
            <button class="detail-btn">查看详情</button>
            <button 
              v-if="item.status === 1" 
              class="bid-btn"
              @click.stop="quickBid(item)"
            >
              立即竞拍
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && auctionList.length === 0" class="empty-state">
      <div class="empty-icon">📦</div>
      <div class="empty-text">暂无拍品</div>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="total > 0">
      <button 
        :disabled="searchParams.pageNo <= 1" 
        @click="changePage(searchParams.pageNo - 1)"
        class="page-btn"
      >
        上一页
      </button>
      
      <span class="page-info">
        第 {{ searchParams.pageNo }} 页，共 {{ Math.ceil(total / searchParams.pageSize) }} 页
      </span>
      
      <button 
        :disabled="searchParams.pageNo >= Math.ceil(total / searchParams.pageSize)" 
        @click="changePage(searchParams.pageNo + 1)"
        class="page-btn"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script>
import { AuctionApi } from '@/api/auction'

export default {
  name: 'AuctionList',
  data() {
    return {
      loading: false,
      auctionList: [],
      total: 0,
      searchParams: {
        pageNo: 1,
        pageSize: 12,
        productName: '',
        status: '',
        brand: '',
        category: '',
        grade: ''
      },
      
      statusTabs: [
        { label: '全部', value: '' },
        { label: '即将开始', value: '0' },
        { label: '进行中', value: '1' },
        { label: '已结束', value: '2' },
        { label: '已流拍', value: '3' }
      ],
      
      brandOptions: [
        'LV', 'Chanel', 'Hermès', 'Gucci', 'Prada', 'Dior', 'Cartier', 'Rolex'
      ],
      
      categoryOptions: [
        '包袋', '饰品', '腕表', '衣类', '小物'
      ],
      
      gradeOptions: [
        { label: 'N级 (全新)', value: 'N' },
        { label: 'S级 (近全新)', value: 'S' },
        { label: 'A级 (优秀)', value: 'A' },
        { label: 'AB级 (良好)', value: 'AB' },
        { label: 'B级 (一般)', value: 'B' },
        { label: 'BC级 (较差)', value: 'BC' },
        { label: 'C级 (差)', value: 'C' },
        { label: 'D级 (很差)', value: 'D' }
      ]
    }
  },
  
  async created() {
    await this.loadAuctionList()
  },
  
  methods: {
    async loadAuctionList() {
      this.loading = true
      try {
        const response = await AuctionApi.getAuctionProductList(this.searchParams)
        this.auctionList = response.data.list || []
        this.total = response.data.total || 0
      } catch (error) {
        console.error('加载拍品列表失败:', error)
        this.$message.error('加载拍品列表失败')
      } finally {
        this.loading = false
      }
    },
    
    handleSearch() {
      this.searchParams.pageNo = 1
      this.loadAuctionList()
    },
    
    handleStatusFilter(status) {
      this.searchParams.status = status
      this.handleSearch()
    },
    
    changePage(page) {
      this.searchParams.pageNo = page
      this.loadAuctionList()
    },
    
    goToDetail(id) {
      this.$router.push(`/auction/${id}`)
    },
    
    quickBid(item) {
      // 快速竞拍，跳转到详情页并自动聚焦到出价输入框
      this.$router.push(`/auction/${item.id}?quickBid=true`)
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
    
    getCountdownText(endTime) {
      const now = new Date().getTime()
      const end = new Date(endTime).getTime()
      const distance = end - now
      
      if (distance <= 0) return '已结束'
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      
      if (days > 0) return `${days}天${hours}时`
      if (hours > 0) return `${hours}时${minutes}分`
      return `${minutes}分钟`
    },
    
    formatPrice(price) {
      return (price / 100).toFixed(2)
    }
  }
}
</script>

<style scoped>
.auction-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-filters {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.search-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 8px 16px;
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

.filter-options {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.auction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.auction-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.auction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.status-badge.upcoming { background: #6c757d; }
.status-badge.ongoing { background: #28a745; }
.status-badge.ended { background: #17a2b8; }
.status-badge.failed { background: #dc3545; }

.countdown-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  padding: 20px 10px 10px;
}

.countdown-text {
  color: white;
  font-weight: bold;
  text-align: center;
}

.card-content {
  padding: 15px;
}

.product-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-attributes {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
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

.price-info {
  margin-bottom: 12px;
}

.current-price {
  margin-bottom: 4px;
}

.current-price .price {
  font-size: 18px;
  font-weight: bold;
  color: #dc3545;
}

.start-price .price {
  font-size: 14px;
  color: #666;
}

.auction-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.stat-item {
  text-align: center;
}

.stat-item .count {
  display: block;
  font-weight: bold;
  color: #333;
}

.stat-item .label {
  font-size: 12px;
  color: #666;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.detail-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.bid-btn {
  flex: 1;
  padding: 8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
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

@media (max-width: 768px) {
  .auction-list {
    padding: 10px;
  }
  
  .auction-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .filter-options {
    flex-direction: column;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .search-bar {
    flex-direction: column;
  }
}
</style>