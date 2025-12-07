<template>
    <div class="dark full-width">
        <div class="header_header wrapper between">
          <div class="header_header-icons">
            <span class="lang-select">
              <i class="iconfont icon-yuyan"></i>
              <span class="pl-2">中文</span>
              <span>￥</span>
            </span>
          </div>
          <div class="header_header-nav">
            <router-link to="/">会员权益</router-link>
            <router-link to="/">最新资讯</router-link>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                服务支持<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>服务支持1</el-dropdown-item>
                  <el-dropdown-item> 服务支持 2 </el-dropdown-item>
                  <el-dropdown-item>服务支持 3</el-dropdown-item>
                  <el-dropdown-item>服务支持 4</el-dropdown-item>
                  <el-dropdown-item>服务支持 5</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <router-link to="/">关于我们</router-link>
          </div>
        </div>
    </div>
    <div class="header_content wrapper between">
        <div class="header_content_logo">
          <a href="/" class="head-logo"></a>
        </div>
        <div class="header_content_nav ml-10 common">
          <a href="/">新品</a>
          <a href="/">包袋</a>
          <a href="/">珠宝</a>
          <a href="/">家居</a>
          <a href="/">拍卖</a>
          <a href="/">回收</a>
        </div>

        <div class="header_content_icons">
          <i class="iconfont icon-search"></i>
          <i class="iconfont icon-heart-01"></i>
          <i class="iconfont icon-24gl-bag2"></i>
          <i class="iconfont icon-account"></i>
        </div>
      </div>
</template>
<script setup>
import { reactive, onMounted, toRefs } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<style lang="scss" scoped>
.header_header {
  height: 36px;
  .lang-select {
    cursor: pointer;

    &:hover {
      color: grey-7;
    }

    .iconfont {
      font-size: 14px;
    }
  }

  .header_header-nav {
    font-size: 12px;

    .el-dropdown {
      line-height: 1.5;
      margin: 0 12px;

      .el-dropdown-link {
        font-size: 12px;
        cursor: pointer;
        color: grey-7;
      }
    }

    a {
      display: inline-block;
      margin: 0 12px;
      color: grey-7;

      &:hover {
        color: grey-8;
      }
    }
  }
}

.header_content {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 30px 0 20px;
  border-bottom: 1px grey-7 solid;

  .header_content_logo {
    display: inline-block;
    width: 140px;
    height: 30px;
    background-image: url(../assets/logo.png);
    background-repeat: no-repeat;
    background-size: contain;
  }

  .header_content_search {
    width: 180px;
    font-size: 14px;

    .iconfont {
      font-size: 18px;
    }
  }

  .header_content_nav {
    width: calc(100% - 280px);
    font-size: 14px;

    > a {
      margin: 0 20px;
    }
  }

  .header_content_icons {
    width: 160px;

    .iconfont {
      font-size: 20px;
      margin: 0 10px;
    }
  }
}
</style>