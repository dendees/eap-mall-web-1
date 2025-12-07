<template>
  <div>
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
          <div class="inner">
            <h1>周六专场</h1>
            <h2>时间：2025/09/25 8:00 ~ 2025/09/25 17:00</h2>
          </div>
        </div>
        <div class="content_content_content mt-6">
          <div class="filter-container" v-if="filter.isShow">
            <div class="filter" :class="{ 'is-show': filter.isShow }">
              <div class="filter-header between">
                <h2 class="mt-1" style="display: block;">筛选</h2>
                <el-icon style="font-size: 20px; cursor: pointer;" @click="closeFilter">
                  <Close />
                </el-icon>
              </div>

              <div class="filter-content mt-1">
                <div class="filter-box" v-for="item in filter.model" :key="item.key">
                  <div class="title between">
                    <span>{{ item.name }}</span>
                    <el-icon v-if="!item.isExpand" @click="item.isExpand = !item.isExpand">
                      <Plus />
                    </el-icon>
                    <el-icon v-if="item.isExpand" @click="item.isExpand = !item.isExpand">
                      <Minus />
                    </el-icon>
                  </div>
                  <div class="content" v-if="item.isExpand">
                    <el-checkbox-group v-model="item.selects">
                      <p v-for="i in filterObj[item.key]" :key="i.key">
                        <el-checkbox :label="i.label" :value="i.key">
                          {{ i.label }}（{{ i.count }}）
                        </el-checkbox>
                      </p>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
              <div class="filter-footer">
                <el-button size="large" style="width: 45%;" @click="clearFilter">清除</el-button>
                <el-button type="primary" size="large" style="width: 45%;" @click="submitFilter">确认</el-button>
              </div>


            </div>
            <div class="bg" @click="closeFilter"></div>
          </div>

          <div class="product-list">
            <div class="product-list-header between">
              <div class="filter-icon">
                <span @click="showFilter" class="pointer">
                  <i class="iconfont icon-shaixuan"></i>
                  筛选
                </span>
              </div>
              <div class="count">
                <span>
                  共 212 件商品
                </span>
              </div>
              <div class="sort">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    默认排序<el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        价格从低到高
                      </el-dropdown-item>
                      <el-dropdown-item>
                        价格从高到低
                      </el-dropdown-item>
                      <el-dropdown-item>
                        折扣从少到多
                      </el-dropdown-item>
                      <el-dropdown-item>折扣从多少</el-dropdown-item>
                      <el-dropdown-item>精选商品</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            <div class="filter-show" v-if="filter.selectNames.length">
              <el-tag class="mt-2 mr-2" v-for="tag in filter.selectNames" :key="tag.key" closable type="info"
                effect="plain" size="large">
                {{ tag.label }}
              </el-tag>
            </div>
            <div class="product-list-content mt-4">
              <el-row :gutter="10">
                <el-col :xs="12" :sm="8" :md="6" v-for="p in products" :key="p.id">
                  <div class="product-item mt-1 mb-1">
                    <div class="heart">
                      <i class="iconfont icon-heart" v-if="collects.find(i=>i.id==p.id)"></i>
                      <i class="iconfont icon-heart-01" v-else @click="addCollects(p)"></i>
                    </div>
                    <div class="product-img">
                      <img :src="p.image" alt="">
                    </div>
                    <div class="product-text">
                      <div class="brand">{{ p.brand }}</div>
                      <div class="name">{{ p.name }}</div>
                      <div class="price">￥{{ p.price }}</div>
                    </div>
                  </div>
                </el-col>

              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer full-width"></div>
  </div>
</template>
<script>
import { useCollectStore } from "@/stores/collects"
const collectStore = useCollectStore()
export default {
  data() {
    return {
      searchText: "",
      isFilter: false,
      filter: {
        isShow: false,
        selectNames: "",
        model: [
          {
            name: "品牌",
            key: "brand",
            isExpand: true,
            selects: [],
          },
          {
            name: "类型",
            key: "type",
            isExpand: true,
            selects: [],
          },

          {
            name: "价格区间",
            key: "priceLevel",
            isExpand: true,
            selects: [],
          },
          {
            name: "颜色",
            key: "priceLevel",
            isExpand: true,
            selects: [],
          },
        ]
      },
      filterObj: {
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
        brand: [
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
      products: [
        {
          "id": "P001",
          "image": "/static-files/products/1.jpg",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 299.00
        },
        {
          "id": "P002",
          "image": "/static-files/products/2.webp",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 3999.00
        },
        {
          "id": "P003",
          "image": "/static-files/products/3.webp",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 199.00
        },
        {
          "id": "P004",
          "image": "/static-files/products/4.webp",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 1299.00
        },
        {
          "id": "P005",
          "image": "/static-files/products/1.jpg",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 5999.00
        },
        {
          "id": "P006",
          "image": "/static-files/products/1.jpg",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 2499.00
        },
        {
          "id": "P007",
          "image": "/static-files/products/2.webp",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 499.00
        },
        {
          "id": "P008",
          "image": "/static-files/products/4.webp",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 299.00
        },
        {
          "id": "P009",
          "image": "/static-files/products/3.webp",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 89.00
        },
        {
          "id": "P010",
          "image": "/static-files/products/4.webp",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 159.00
        },
        {
          "id": "P011",
          "image": "/static-files/products/3.webp",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 129.00
        },
        {
          "id": "P012",
          "image": "/static-files/products/2.webp",
          "brand": "FENDI",
          "name": "Fendigraph 皮质迷你斜挎包",
          "price": 299.00
        }
      ]
    }
  },
  computed:{
    collects(){
      return collectStore.collects
    }
  },
  created(){

  },
  methods: {
    addCollects(product){
      const p = JSON.parse(JSON.stringify(product))
      collectStore.add_collects(p)
    },
    submitFilter() {
      let flag = false
      this.filter.selectNames = []
      this.filter.model.forEach(item => {
        if (item.selects.length) {
          let selectNames = this.filterObj[item.key].filter(i => {
            i.parentKey = item.key
            return item.selects.includes(i.key)
          })
          this.filter.selectNames = [...this.filter.selectNames, ...selectNames]
          this.flag = true
        }
      })
      this.isFilter = true
      this.closeFilter()
    },
    clearFilter() {
      this.filter.model.forEach(item => {
        if (item.selects.length) {
          item.selects = []
          this.filter.selectNames = []
        }
      })
      this.isFilter = false
      this.closeFilter()
    },
    showFilter() {
      this.filter.isShow = true
    },
    closeFilter() {
      this.filter.isShow = false
    },
    querySearch() {

    },
    handleSelect() {

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

.header_content {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 30px 0 20px;
  border-bottom: 1px $grey-7 solid;

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
    width: 100%;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #efefef;
    text-align: center;
  }

  .breadcrumb {
    color: #787878;
    padding: 10px 0;

    a {
      color: #191919;
    }

    span {
      margin: 0 10px;
    }
  }
}


.product-list {
  .product-list-header {
    padding: 10px;
    border-bottom: 1px #cdcdcd solid;
  }
}

.product-item {

  img {
    max-width: 100%;
  }

  position: relative;

  .heart {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color:rgba(255, 255, 255, 0.6) ;
    }
    i {
      font-size: 24px;
    }
  }
}

.product-text {
  .brand {
    font-size: 16px;
    color: #191919;
  }

  .name {
    font-size: 14px;
    color: #191919;
  }

  .price {
    font-size: 14px;
  }
}


.filter-container {
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .filter {
    position: absolute;
    z-index: 1;
    transform: translateX(-100%);
    left: 0;
    top: 0;
    width: 60%;
    max-width: 300px;
    height: 100%;
    overflow: hidden;
    background: #fff;
    transition: all 1s linear;
    box-sizing: border-box;

    &.is-show {
      transform: translateX(0);
    }

    padding: 10px 20px;
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }

  .filter {
    .filter-header {
      width: 100%;
      height: 40px;
    }

    .filter-footer {
      position: absolute;
      width: 100%;
      height: 50px;
      left: 0;
      bottom: 0;
      border-top: 1px $grey-7 solid;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .filter-content {
      border-top: 1px $grey-7 solid;
      max-height: calc(100% - 120px);
      overflow-y: auto;

      .filter-box {
        border-bottom: 1px $grey-7 solid;
        padding: 0 5px;

        >.title {
          font-size: medium;
          padding: 15px 5px;

          i {
            color: $grey-6;
            cursor: pointer;

            &:hover {
              color: $grey-1;
            }
          }
        }

        >.content {
          max-height: 300px;
          overflow-y: auto;
        }
      }
    }
  }
}
</style>