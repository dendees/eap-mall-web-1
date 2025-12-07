<template>
  <div class="about">
    <s-header :name="'关于我们'"></s-header>
    <div class="about-body">
      <img class="intro-img" src="/src/assets/logo.svg" alt="">
      <van-divider :style="{ color: '#1baeae', borderColor: '#1baeae', fontSize: '20px', fontWeight: 500 }">简介</van-divider>
      <div>EAP Mall 是一套面向企业级的电商与拍卖一体化前端，基于 Vue3 + Vant4 构建，支持移动端与PC端自适应展示。功能包含首页门户、商品分类、搜索、购物车、订单、个人中心等模块，后续会整合拍卖业务能力。</div>
      <van-divider :style="{ color: '#1baeae', borderColor: '#1baeae', fontSize: '20px', fontWeight: 500 }">开源地址</van-divider>
      <div>
        <div>前后端开源地址将统一在 EAP 平台仓库中维护。</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import sHeader from '@/components/SimpleHeader.vue'
</script>

<style lang="less" scoped>
  .about {
    box-sizing: border-box;
    padding: 20px;
    .intro-img {
      width: 100%;
    }
    .about-body {
      font-size: 16px;
      a {
        color: #007fff;
      }
    }
  }
</style>
