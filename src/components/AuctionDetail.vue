<template>
  <div class="layout">
    <div class="header ">
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
                  <el-dropdown-item>
                    服务支持 2
                  </el-dropdown-item>
                  <el-dropdown-item
                    >服务支持 3</el-dropdown-item
                  >
                  <el-dropdown-item>服务支持 4</el-dropdown-item>
                  <el-dropdown-item
                    >服务支持 5</el-dropdown-item
                  >
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
    </div>
    <div class="content wrapper">
     
      <div class="content_content">
        <div class="content_content_header">
          <div class="breadcrumb common">
            <a href="/">首页</a>
            <span>/</span>
            <a href="/">拍卖</a>
            <span>/</span>
            周六专场
          </div>
        </div>
         <div class="banner">
        <img src="/images/banner/banner001.jpg"/>
      </div>
        <div class="content_content_content mt-6">
          <el-row :gutter="40">
            <el-col :span="6" class="hidden-sm-and-down">
              <div class="side-nav">
                <h2 class="mt-1">筛选</h2>
                <div class="side-nav-container mt-1">
                  <div class="side-nav-box">
                    <div class="title between">
                      <span>品牌</span>
                      <el-icon v-if="!showFilter.brands" @click="showFilter.brands=!showFilter.brands"><Plus /></el-icon>
                      <el-icon v-if="showFilter.brands" @click="showFilter.brands=!showFilter.brands"><Minus /></el-icon>
                    </div>
                    <div class="content" v-if="showFilter.brands">
                      <el-checkbox-group
                      v-model="filter.brands"
                    >
                      <p v-for="item in filterObj.brands" :key="item.key" >
                        <el-checkbox :label="item.label" :value="item.key">
                          {{ item.label }}（{{ item.count }}）
                        </el-checkbox>
                      </p>
                    </el-checkbox-group>
                    </div>
                  </div>

                  <div class="side-nav-box">
                    <div class="title between">
                      <span>分类</span>
                      <el-icon v-if="!showFilter.type" @click="showFilter.type=!showFilter.type"><Plus /></el-icon>
                      <el-icon v-if="showFilter.type" @click="showFilter.type=!showFilter.type"><Minus /></el-icon>
                    </div>
                    <div class="content" v-if="showFilter.type">
                      <el-checkbox-group
                      v-model="filter.type"
                    >
                      <p v-for="item in filterObj.type" :key="item.key" >
                        <el-checkbox :label="item.label" :value="item.key">
                          {{ item.label }}
                        </el-checkbox>
                      </p>
                    </el-checkbox-group>
                    </div>
                  </div>
                </div>
               
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="18">
              <div class="product-list">
                  <div class="product-list-header between">
                    <div class="sort">11</div>
                    <div class="count">asd</div>
                  </div>
                  33
                  <div class="product-list-content">
                    <el-row :gutter="20">
                      <el-col :xs="12" :sm="8" :md="6">
                        <div class="product-item">
                          <div class="product-img">

                          </div>
                          <div class="product-text">
                            <div class="title">111</div>
                            <div class="explan">22</div>
                            <div class="price">222</div>
                          </div>
                        </div>
                      </el-col>
                      <el-col :xs="12" :sm="8" :md="6">
                        11
                      </el-col>
                      <el-col :xs="12" :sm="8" :md="6">
                        11
                      </el-col>
                      <el-col :xs="12" :sm="8" :md="6">
                        11
                      </el-col>
                      <el-col :xs="12" :sm="8" :md="6">
                        11
                      </el-col>
                      <el-col :xs="12" :sm="8" :md="6">
                        11
                      </el-col>
                      <el-col :xs="12" :sm="8" :md="6">
                        11
                      </el-col>
                      <el-col :xs="12" :sm="8" :md="6">
                        11
                      </el-col>
                      <el-col :xs="12" :sm="8" :md="6">
                        11
                      </el-col>
                      <el-col :xs="12" :sm="8" :md="6">
                        11
                      </el-col>
                      <el-col :xs="12" :sm="8" :md="6">
                        11
                      </el-col>
                    </el-row>
                  </div>
              </div>
            </el-col>
          </el-row>  
        </div>
      </div>
    </div>
    <div class="footer full-width"></div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      searchText: "",
      filter:{
        type: '',
        brands: '',
      },
      showFilter:{
        type: false,
        brands: true
      },
      filterObj:{
        type: [
          {
            key: '1001',
            label: 'refineId單肩包 & 斜挎包',
            count: 10
          },
          {
            key: '1002',
            label: '手提袋袋',
            count: 10
          },
          {
            key: '1003',
            label: '手柄包',
            count: 10
          },
          {
            key: '1004',
            label: '斜挎包和信使包',
            count: 10
          },
         ],
         brands:[
          {
            key: '1001',
            label: '迈克·科尔斯',
            count: 10
          },
          {
            key: '1002',
            label: '古驰',
            count: 10
          },
          {
            key: '1003',
            label: '巴利',
            count: 10
          },
          {
            key: '1004',
            label: '芬迪',
            count: 10
          },
          {
            key: '1005',
            label: '巴利',
            count: 10
          },
          {
            key: '1006',
            label: '芬迪',
            count: 10
          },
         ]
      },
     
    }
  },
  methods:{
    querySearch(){

    },
    handleSelect(){

    }
  }
};
</script>
<style lang="scss" scoped>
.header_header {
  height: 36px;
  .lang-select {
    cursor: pointer;
    &:hover {
      color: $grey-7;
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
        color: $grey-7;
      }      
    }

    a {
      display: inline-block;
      margin: 0 12px;
      color: $grey-7;
      &:hover {
        color: $grey-8;
      }
    }
  }
}
.header_content{
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 30px 0 20px;
  border-bottom: 1px $grey-7 solid;
  .header_content_logo{
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
    >a {
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
.content {
  .banner {
    img {
      width: 100%;
      height: auto;
    }
  }
  .breadcrumb {
    color: #787878;
    padding: 10px 0;
    a{
      color: #191919;
    }
    span {
      margin: 0 10px;
    }
  }
}
.side-nav {
  .side-nav-container {
    border-top: 1px $grey-7 solid;
    .side-nav-box {
      border-bottom: 1px $grey-7 solid;
      padding: 0 5px;
      >.title {
        font-size:medium;
        padding: 15px 5px;
        i {
          color: $grey-6;
          cursor: pointer;
          &:hover {
            color: $grey-1;
          }
        }
      }
    }
  }
}

</style>