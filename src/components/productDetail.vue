<template>
  <div>
    <div class="header">
      <div class="dark full-width">
        <div class="header_header wrapper between">
          <div class="header_header-icons">
            <span class="lang-select" @click="changeLang">
              <i class="iconfont icon-yuyan"></i>
              <span class="pl-2">{{ langName }}</span>
              <span class="pl-2">{{ currencySign }}</span>
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
          <a href="/">包袋</a>
          <a href="/">珠宝</a>
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
            拍卖
            <span>/</span>
            详情
          </div>
        </div>
        <div class="content_content_content mt-6">
          <el-row :gutter="40">
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              ref="carouselRef"
            >
            <el-carousel ref="carousel" height="auto" :style="{'height': height +'px'}" :interval="3000"  arrow="always" @change="changeIndex">
              <el-carousel-item :style="{height: height+'px'}" v-for="item in detail.fileList" :key="item">
                <img  style="width: 100%;" :src="item">
                <!-- <h3 text="2xl" justify="center">{{ item }}</h3> -->
              </el-carousel-item>
            </el-carousel>
            <div style="clear: both;"></div>
            <el-row :gutter="10">
              <el-col :class="{'current': currentIndex == index}" class="carousel-pic" :xs="8" :sm="6" :md="4" v-for="(item, index) in detail.fileList" :key="index" @click="changeCarousel(index)" >
                <img style="width: 100%;" :src="item" alt="">
              </el-col>
            </el-row>
          </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              
            >
            <div class="detail">
              <div class="detail_header">
                <div class="expand between">
                  <el-tag type="warning">尚未开始</el-tag>
                  <span>开始时间：{{ formatTime(detail.auctionStartTime) }}</span>
                </div>
                <h1>
                  {{ detail.productName }}
                </h1>
                <p>
                  CHANELChanel/X/31268948/Matrasse链式包粉色单肩包【机器翻译】
                </p>
                <p>
                  <span>商品编号：{{ detail.receiptNumber }} </span>
                </p>
                
              </div>
              <div class="detail_operation mt-4">
                <div class="detail_operation_header between">
                  <p>起拍价格：<span>{{ appendPrice(detail.startPrice) }}</span></p>
                  
                </div>
                <div class="detail_operation_content">
                  <p>当前价格: <span>{{ appendPrice(detail.currentPrice) }}</span></p>
                  <p v-if="detail.buyNowPrice">一口价:<span>{{ appendPrice(detail.currentPrice) }}</span></p>
                </div>
                <div class="detail_operation_footer mt-4">
                  <el-button type="warning" size="large">我要出价</el-button>
                  <el-button v-if="detail.buyNowPrice">一口价</el-button>
                </div>
              </div>
              <div class="detail_info">
                <h3>商品信息</h3>
              </div>
              <div class="detail_detail"></div>
            </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="footer full-width"></div>
    <el-dialog
      v-model="dialogVisible"
      title="语言和货币"
      width="400"
      :before-close="handleClose"
    >
      <el-form :model="settingForm">
        <el-form-item label="选择语言">
          <el-select v-model="settingForm.lang">
            <el-option v-for="l in langs" :label="l.label" :value="l.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择币种 ">
          <el-select v-model="settingForm.currency">
            <el-option v-for="c in currencys" :label="c.label" :value="c.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitLang"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { useCollectStore } from "@/stores/collects";
import { useSettingsStore } from "@/stores/settings";
import dayjs from 'dayjs';
import { getDetail } from "@/service/good";
const collectStore = useCollectStore();
const settingsStore = useSettingsStore();
export default {
  data() {
    return {
      settingForm: {
        lang: "",
        currency: "",
      },
      dialogVisible: false,
      currentIndex: 0,
      height: 500,
      detail:{
        zoomFileList: []
      },
      appendPrice:(price)=>{
        if(!price) return
        let cache = price, currentPrice
        if(this.currency !== 'JPY'){
          let current = this.currencys.find((l) => l.key == this.currency)
          currentPrice = price*current.rate
          cache = `¥ ${cache} ( ${current.sign} ${currentPrice})`
        }else {
          cache = `¥ ${cache}`
        }
        
        return cache
      },
      rounds: [
        {
          value: "120",
          label: "A120",
        },
        {
          value: "121",
          label: "B121",
        },
      ],
      

      
    };
  },
  computed: {
    collects() {
      return collectStore.collects;
    },
    langs() {
      return settingsStore.langs;
    },
    lang() {
      return settingsStore.lang;
    },
    currency() {
      return settingsStore.currency;
    },
    currencys() {
      return settingsStore.currencys;
    },
    langName() {
      return this.langs.find((l) => l.key == this.lang).label;
    },
    currencySign() {
      return this.currencys.find((l) => l.key == this.currency).sign;
    },
  },
  created() {
    this.getDetail();
  },
  mounted(){
    this.$nextTick(() => {
      this.height = this.$refs.carouselRef.$el.offsetWidth*0.75
    });
  },
  methods: {
    changeIndex(i){
      console.log(i)
      this.currentIndex = i
    },
    changeCarousel(index){
      this.$refs.carousel.setActiveItem(index);
    },
    formatTime(t){
      if(!t) return ""
      return dayjs(t).format("YYYY/MM/DD HH:mm:ss")
    },
    onGridReady(params){
      this.gridApi = params.api
    },
    changeMode(state){
      this.viewmode = state
    },
    handleClose() {
      this.dialogVisible = false;
    },
    submitLang() {
      settingsStore.setLang(this.settingForm.lang);
      settingsStore.setCurrency(this.settingForm.currency);
      this.dialogVisible = false;
    },
    changeLang() {
      this.dialogVisible = true;
    },
    async getDetail() {
      const data = await getDetail(this.$route.params.id);
      this.detail = data
      
    },
    addCollects(product) {
      const p = JSON.parse(JSON.stringify(product));
      collectStore.add_collects(p);
    },
    toDetail(item) {
      this.$router.push({
        path: "/product/" + item.id,
      });
    },
    submitFilter() {
      let flag = false;
      this.filter.selectNames = [];
      this.filter.model.forEach((item) => {
        if (item.selects.length) {
          let selectNames = this.filterObj[item.key].filter((i) => {
            i.parentKey = item.key;
            return item.selects.includes(i.key);
          });
          this.filter.selectNames = [
            ...this.filter.selectNames,
            ...selectNames,
          ];
          this.flag = true;
        }
      });
      this.isFilter = true;
      this.closeFilter();
    },
    clearFilter() {
      this.filter.model.forEach((item) => {
        if (item.selects.length) {
          item.selects = [];
          this.filter.selectNames = [];
        }
      });
      this.isFilter = false;
      this.closeFilter();
    },
    showFilter() {
      this.filter.isShow = true;
    },
    closeFilter() {
      this.filter.isShow = false;
    },
    querySearch() {},
    handleSelect() {},
  },
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
    font-size: 10px;

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
    .sort {
      font-size: 18px;
      i {
        color: #969696;
        cursor: pointer;
        margin: 0 2px;
        &.act{
          color:#191919;
        }
      }
    }
  }
}

.product-item {
  // box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4);
  .product-img {
    width: 100%;
    aspect-ratio: 16 / 9
  }
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
      background-color: rgba(255, 255, 255, 0.6);
    }
    i {
      font-size: 24px;
    }
  }
}

.product-text {
  padding: 8px;
  .brand {
    font-size: 16px;
    color: #191919;
  }

  .code {
    line-height: 18px;
    font-size: 14px;
    color: #191919;
  }

  .name {
    height: 36px;
    line-height: 18px;
    font-size: 12px;
    color: #191919;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .level {
      display: inline-block;
      height: 16px;
      padding: 0 3px;
      border: 1px #787878 solid;
      margin-right: 3px;
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

        > .title {
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

        > .content {
          max-height: 300px;
          overflow-y: auto;
        }
      }
    }
  }
}

::v-deep {
  .el-carousel__item{
    width: 100%;
    height: 300px
  }
  .el-button--large {
    font-size: 14px;
    padding: 8px 48px;
  }
}

.carousel-pic {
  &.current {
    border: 2px #999 solid
  }
}
.detail {
  font-size: 14px;
  p {
    margin: 10px 0;
  }
  .detail_header {
    h1 {
      font-size: 28px;
      margin: 10px 0
    }
    .expand {
      font-size: 12px;
    }
  }
  .detail_operation {
    border: 1px #dfdfdf solid;
    background: #f2f2f2;
    padding: 20px;
    .detail_operation_header {
      height: 42px;
      line-height: 42px;
      border-bottom: 1px #dfdfdf solid ;
    }
    .detail_operation_content {

    }
  }
}
</style>
