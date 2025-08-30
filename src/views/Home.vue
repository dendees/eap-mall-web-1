<template>
  <ResponsiveLayout>
    <template #default="{ device, isMobile, isPC }">
      <div class="home-container" :class="`home-${device}`">
        <!-- PC端顶部导航 -->
        <nav v-if="isPC" class="pc-nav">
          <div class="pc-nav-content">
            <div class="logo">
              <span class="app-name">EAP 商城</span>
            </div>
            <div class="nav-links">
              <router-link to="/home" class="nav-link">首页</router-link>
              <router-link to="/category" class="nav-link">分类</router-link>
              <router-link to="/cart" class="nav-link">
                购物车
                <van-badge v-if="cart.count" :content="cart.count" />
              </router-link>
              <router-link to="/user" class="nav-link">我的</router-link>
            </div>
            <div class="user-actions">
              <router-link v-if="!state.isLogin" to="./login" class="login-btn">登录</router-link>
              <router-link v-else to="./user" class="user-info">
                <van-icon name="manager-o" />
              </router-link>
            </div>
          </div>
        </nav>

        <!-- 移动端头部 -->
        <header v-if="isMobile" class="home-header wrap" :class="{'active' : state.headerScroll}">
          <router-link tag="i" to="./category"><i class="nbicon nbmenu2"></i></router-link>
          <div class="header-search">
            <span class="app-name">EAP 商城</span>
            <i class="iconfont icon-search"></i>
            <router-link tag="span" class="search-title" to="./product-list?from=home">山河无恙，人间皆安</router-link>
          </div>
          <router-link class="login" tag="span" to="./login" v-if="!state.isLogin">登录</router-link>
          <router-link class="login" tag="span" to="./user" v-else>
            <van-icon name="manager-o" />
          </router-link>
        </header>

        <!-- 主内容区域 -->
        <main class="main-content" :class="{'pc-content': isPC, 'mobile-content': isMobile}">
          <!-- 轮播图 -->
          <swiper :list="state.swiperList" :class="{'pc-swiper': isPC}"></swiper>
          
          <!-- 分类列表 -->
          <div class="category-list" :class="{'pc-category': isPC}">
            <div v-for="item in state.categoryList" v-bind:key="item.categoryId" @click="tips">
              <img :src="item.imgUrl">
              <span>{{item.name}}</span>
            </div>
          </div>
          
          <!-- 商品展示区域 -->
          <div class="goods-container" :class="{'pc-goods': isPC}">
            <!-- 新品上线 -->
            <div class="good">
              <header class="good-header">新品上线</header>
              <van-skeleton title :row="3" :loading="state.loading">
                <div class="good-box" :class="{'pc-grid': isPC}">
                  <div class="good-item" v-for="item in state.newGoodses" :key="item.goodsId" @click="goToDetail(item)">
                    <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
                    <div class="good-desc">
                      <div class="title">{{ item.goodsName }}</div>
                      <div class="price">¥ {{ item.sellingPrice }}</div>
                    </div>
                  </div>
                </div>
              </van-skeleton>
            </div>
            
            <!-- 热门商品 -->
            <div class="good">
              <header class="good-header">热门商品</header>
              <van-skeleton title :row="3" :loading="state.loading">
                <div class="good-box" :class="{'pc-grid': isPC}">
                  <div class="good-item" v-for="item in state.hots" :key="item.goodsId" @click="goToDetail(item)">
                    <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
                    <div class="good-desc">
                      <div class="title">{{ item.goodsName }}</div>
                      <div class="price">¥ {{ item.sellingPrice }}</div>
                    </div>
                  </div>
                </div>
              </van-skeleton>
            </div>
            
            <!-- 最新推荐 -->
            <div class="good" :style="{ paddingBottom: isMobile ? '100px' : '20px'}">
              <header class="good-header">最新推荐</header>
              <van-skeleton title :row="3" :loading="state.loading">
                <div class="good-box" :class="{'pc-grid': isPC}">
                  <div class="good-item" v-for="item in state.recommends" :key="item.goodsId" @click="goToDetail(item)">
                    <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
                    <div class="good-desc">
                      <div class="title">{{ item.goodsName }}</div>
                      <div class="price">¥ {{ item.sellingPrice }}</div>
                    </div>
                  </div>
                </div>
              </van-skeleton>
            </div>
          </div>
        </main>

        <!-- 移动端底部导航 -->
        <nav-bar v-if="isMobile" />
      </div>
    </template>
  </ResponsiveLayout>
</template>

<script setup>
import { reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import swiper from '@/components/Swiper.vue'
import navBar from '@/components/NavBar.vue'
import ResponsiveLayout from '@/components/ResponsiveLayout.vue'
import { getHome } from '@/api/product/home'
import { getLocal } from '@/common/js/utils'
import { showLoadingToast, closeToast, showToast } from 'vant'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const router = useRouter()

const state = reactive({
  swiperList: [], // 轮播图列表
  isLogin: false, // 是否已登录
  headerScroll: false, // 滚动透明判断
  hots: [],
  newGoodses: [],
  recommends: [],
  categoryList: [
    {
      name: '超市',
      imgUrl: '/src/assets/logo.svg',
      categoryId: 100001
    },
    {
      name: '服饰',
      imgUrl: '/src/assets/logo.svg',
      categoryId: 100002
    },
    {
      name: '全球购',
      imgUrl: '/src/assets/logo.svg',
      categoryId: 100003
    },
    {
      name: '生鲜',
      imgUrl: '/src/assets/logo.svg',
      categoryId: 100004
    },
    {
      name: '到家',
      imgUrl: '/src/assets/logo.svg',
      categoryId: 100005
    },
    {
      name: '充值',
      imgUrl: '/src/assets/logo.svg',
      categoryId: 100006
    },
    {
      name: '9.9',
      imgUrl: '/src/assets/logo.svg',
      categoryId: 100007
    },
    {
      name: '领券',
      imgUrl: '/src/assets/logo.svg',
      categoryId: 100008
    },
    {
      name: '省钱',
      imgUrl: '/src/assets/logo.svg',
      categoryId: 100009
    },
    {
      name: '全部',
      imgUrl: '/src/assets/logo.svg',
      categoryId: 100010
    }
  ],
  loading: true
})

onMounted(async () => {
  const token = getLocal('token')
  if (token) {
    state.isLogin = true
    cart.updateCart()
  }
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  });
  
  const { data } = await getHome()
  state.swiperList = data.carousels
  state.newGoodses = data.newGoodses
  state.hots = data.hotGoodses
  state.recommends = data.recommendGoodses
  state.loading = false
  closeToast()
})

nextTick(() => {
  document.body.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    scrollTop > 100 ? state.headerScroll = true : state.headerScroll = false
  })
})

const goToDetail = (item) => {
  router.push({ path: `/product/${item.goodsId}` })
}

const tips = () => {
  showToast('敬请期待');
}
</script>

<style lang="less" scoped>
@import '../common/style/mixin';

.home-container {
  width: 100%;
  min-height: 100vh;
  
  // PC 端样式
  &.home-pc {
    .pc-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 1000;
      
      .pc-nav-content {
        max-width: 1200px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        
        .logo .app-name {
          font-size: 24px;
          font-weight: bold;
          color: @primary;
        }
        
        .nav-links {
          display: flex;
          gap: 30px;
          
          .nav-link {
            color: #333;
            text-decoration: none;
            font-size: 16px;
            position: relative;
            
            &:hover, &.router-link-active {
              color: @primary;
            }
          }
        }
        
        .user-actions {
          .login-btn, .user-info {
            color: @primary;
            text-decoration: none;
            font-size: 16px;
          }
        }
      }
    }
    
    .main-content.pc-content {
      margin-top: 60px;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      padding: 20px;
    }
    
    .pc-swiper {
      height: 300px;
      margin-bottom: 30px;
    }
    
    .category-list.pc-category {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 20px;
      margin-bottom: 30px;
      
      div {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        transition: all 0.3s;
        
        &:hover {
          background: #e9ecef;
          transform: translateY(-2px);
        }
        
        img {
          width: 48px;
          height: 48px;
          margin-bottom: 8px;
        }
        
        span {
          font-size: 14px;
          color: #333;
        }
      }
    }
    
    .goods-container.pc-goods {
      .good {
        margin-bottom: 40px;
        
        .good-header {
          font-size: 20px;
          padding: 20px 0;
          text-align: left;
          background: transparent;
          border-bottom: 2px solid @primary;
        }
        
        .good-box.pc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          
          .good-item {
            width: 100%;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            transition: all 0.3s;
            
            &:hover {
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              transform: translateY(-2px);
            }
            
            img {
              width: 100%;
              height: 200px;
              object-fit: cover;
              border-radius: 4px;
            }
            
            .good-desc {
              padding: 15px 0 0 0;
              
              .title {
                font-size: 16px;
                margin-bottom: 8px;
                height: 44px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              
              .price {
                font-size: 18px;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
  
  // 移动端样式（保持原有样式）
  &.home-mobile {
    // ... 保持原有的移动端样式 ...
    .home-header {
      position: fixed;
      left: 0;
      top: 0;
      .wh(100%, 50px);
      .fj();
      line-height: 50px;
      padding: 0 15px;
      .boxSizing();
      font-size: 15px;
      color: #fff;
      z-index: 10000;
      
      .nbmenu2 {
        color: @primary;
      }
      
      &.active {
        background: @primary;
        .nbmenu2 {
          color: #fff;
        }
        .login {
          color: #fff;
        }
      }

      .header-search {
        display: flex;
        width: 74%;
        line-height: 20px;
        margin: 10px 0;
        padding: 5px 0;
        color: #232326;
        background: rgba(255, 255, 255, .7);
        border-radius: 20px;
        
        .app-name {
          padding: 0 10px;
          color: @primary;
          font-size: 20px;
          font-weight: bold;
          border-right: 1px solid #666;
        }
        
        .icon-search {
          padding: 0 10px;
          font-size: 17px;
        }
        
        .search-title {
          font-size: 12px;
          color: #666;
          line-height: 21px;
        }
      }
      
      .login {
        color: @primary;
        line-height: 52px;
        
        .van-icon-manager-o {
          font-size: 20px;
          vertical-align: -3px;
        }
      }
    }
    
    .main-content.mobile-content {
      padding-top: 50px;
    }
    
    .category-list {
      display: flex;
      flex-shrink: 0;
      flex-wrap: wrap;
      width: 100%;
      padding-bottom: 13px;
      
      div {
        display: flex;
        flex-direction: column;
        width: 20%;
        text-align: center;
        
        img {
          .wh(36px, 36px);
          margin: 13px auto 8px auto;
        }
      }
    }
    
    .good {
      .good-header {
        background: #f9f9f9;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: @primary;
        font-size: 16px;
        font-weight: 500;
      }
      
      .good-box {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        
        .good-item {
          box-sizing: border-box;
          width: 50%;
          border-bottom: 1PX solid #e9e9e9;
          padding: 10px 10px;
          
          img {
            display: block;
            width: 120px;
            margin: 0 auto;
          }
          
          .good-desc {
            text-align: center;
            font-size: 14px;
            padding: 10px 0;
            
            .title {
              color: #222333;
            }
            
            .price {
              color: @primary;
            }
          }
          
          &:nth-child(2n + 1) {
            border-right: 1PX solid #e9e9e9;
          }
        }
      }
    }
  }
}
</style>