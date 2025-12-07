<template>
  <div>
    <s-header></s-header>
    <swiper :swiper-list="state.swiperList" class="mt-4"></swiper>
    <div class="wrapper main-search">
      <div class="main-search-header">
        <h2>商品搜索</h2>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import swiper from '@/components/Swiper.vue'
import sHeader from '@/components/SimpleHeader.vue'
import { getHome } from '@/service/home'
import { getLocal } from '@/common/js/utils'
import { showLoadingToast, closeToast, showToast } from 'vant'
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
const router = useRouter()
const state = reactive({
  swiperList: [
    {
      name: 'xx1拍卖',
      time: '2025/10/01 9:00~2025/10/01 12:00',
      imgUrl: '/static-files/banner/banner1.webp',
      text: 'xx1拍卖xx1拍卖xx1拍卖xx1拍卖xx1拍卖',
      auctionId: 100001
    },
     {
      name: 'xx2拍卖',
      time: '2025/10/02 9:00~2025/10/01 12:00',
      imgUrl: '/static-files/banner/banner2.webp',
      auctionId: 100002,
      text: 'xx2拍卖xx1拍卖xx1拍卖xx1拍卖xx1拍卖',
    },
    {
      name: 'xx3拍卖',
      time: '2025/10/03 9:00~2025/10/01 12:00',
      imgUrl: '/static-files/banner/banner3.jpg',
      auctionId: 100003,
      text: 'xx3拍卖xx3拍卖xx1拍卖xx1拍卖xx1拍卖',
    },
  ], // 轮播图列表
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
    // 获取购物车数据.
    cart.updateCart()
  }
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  });
  // const { data } = await getHome()
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

<style lang="less" scoped >
  @import '../common/style/mixin';
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
      .icon-iconyonghu{
        color: #fff;
        font-size: 22px;
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
  .floor-list {
      width: 100%;
      padding-bottom: 50px;
      .floor-head {
        width: 100%;
        height: 40px;
        background: #F6F6F6;
      }
      .floor-content {
        display: flex;
        flex-shrink: 0;
        flex-wrap: wrap;
        width: 100%;
        .boxSizing();
        .floor-category {
          width: 50%;
          padding: 10px;
          border-right: 1px solid #dcdcdc;
          border-bottom: 1px solid #dcdcdc;
          .boxSizing();
          &:nth-child(2n) {
            border-right: none;
          }
          p {
            font-size: 17px;
            color: #333;
            &:nth-child(2) {
              padding: 5px 0;
              font-size: 13px;
              color: @primary;
            }
          }
          .floor-products {
            .fj();
            width: 100%;
            img {
              .wh(65px, 65px);
            }
          }
      }
    }
  }
</style>