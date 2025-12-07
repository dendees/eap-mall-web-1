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
          </div>
          <!-- <div class="filter-list">
            <div class="rounds filter-item">
              <span class="filter-title"> 场次 </span>
              <el-radio-group v-model="params.round">
                <el-radio :value="r.value" size="mini" v-for="r in rounds">{{
                  r.label
                }}</el-radio>
              </el-radio-group>
            </div>
          </div> -->
        </div>
        <div class="content_content_content mt-6">
          <!-- <div class="filter-container" v-if="filter.isShow">
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
          </div> -->
          <el-tabs v-model="activeName" type="card" class="demo-tabs">
            <el-tab-pane label="商品列表" name="first">
              <!-- <el-row>
                <el-col :span="12" v-for="f in filter.model" :key="f.key">
                  <div class="filter-item">
                    <div class="filter-item-header">
                      <h2>{{ f.name }}</h2>
                      <span></span>
                    </div>
                    <div class="filter-item-content"></div>
                  </div>
                </el-col>
              </el-row> -->
              <div class="product-list">
                <div class="product-list-header between">
                  <div class="filter-icon">
                    <span @click="showFilter" class="pointer">
                      <i class="iconfont icon-shaixuan"></i>
                      筛选
                    </span>
                  </div>
                  <div class="count">
                    <span> 共 {{ total }} 件商品 </span>
                  </div>
                  <div class="sort">
                    <el-icon @click="changeMode('pic')" :class="{'act': viewmode=='pic'}"><Picture /></el-icon>
                    <el-icon @click="changeMode('list')" :class="{'act': viewmode=='list'}"><Menu /></el-icon>
                  </div>
                </div>
                <div class="filter-show">
                  <el-tag
                    class="mt-2 mr-2"
                    v-for="tag in filter.selectNames"
                    :key="tag.key"
                    closable
                    type="info"
                    effect="plain"
                    size="large"
                  >
                    {{ tag.label }}
                  </el-tag>
                </div>
                <div class="product-list-content mt-4" v-if="viewmode == 'pic'">
                  <el-row :gutter="20">
                    <el-col
                      :xs="12"
                      :sm="8"
                      :md="6"
                      v-for="p in products"
                      :key="p.id"
                    >
                      <div class="product-item mt-2 mb-2">
                        <div class="heart">
                          <i
                            class="iconfont icon-heart"
                            v-if="collects.find((i) => i.id == p.id)"
                          ></i>
                          <i
                            class="iconfont icon-heart-01"
                            v-else
                            @click="addCollects(p)"
                          ></i>
                        </div>
                        <div class="product-img" @click="toDetail(p)">
                          <img :src="p.image" alt="" />
                        </div>
                        <div class="product-text">
                          <div class="code">
                            <span class="level">{{ p.vpaFlag }}</span
                            > {{ p.receiptNumber }}
                          </div>
                          <div class="name mt-1">
                            {{ p.productName }}
                          </div>
                          <div class="price">起拍价：{{appendPrice(p.startPrice) }}</div>
                          <div class="price">
                            当前价：{{ appendPrice(p.currentPrice) }}
                          </div>
                          <div class="time">
                            拍卖时间：{{ formatTime(p.auctionStartTime) }}
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>

                <ag-grid-vue
                  v-if="viewmode == 'list'"
                  style="height: 600px; width: 100%;"
                  :autoSizeStrategy="true"
                  class="mt-2 ag-theme-alpine"
                  :rowData="products"
                  :enableCellTextSelection="true"
                  :suppressCellFocus="true"
                  :columnDefs="columnDefs"
                  :defaultColDef="defaultColDef"
                  @grid-ready="onGridReady"
                >
                </ag-grid-vue>
                <el-pagination
                class="mt-4 mb-4"
                  v-model:current-page="params.pageNo"
                  v-model:page-size="params.pageSize"
                  :page-sizes="[20, 40, 60, 100]"
                  :background="true"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="重点关注" name="second">关注列表</el-tab-pane>
          </el-tabs>
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
import { AgGridVue } from "ag-grid-vue3";

import { getList } from "@/service/good";
import { buttonEmits } from "element-plus";
const collectStore = useCollectStore();
const settingsStore = useSettingsStore();
export default {
  components:{AgGridVue},
  data() {
    return {
      gridApi:null,
      dialogVisible: false,
      searchText: "",
      isFilter: false,
      settingForm: {
        lang: "",
        currency: "",
      },
      activeName: "first",
      viewmode: 'pic',
      total: 0,
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
      params: {
        pageSize: 60,
        pageNo: 1,
      },

      filter: {
        model: [
          {
            name: "级别",
            key: "level",
            isExpand: true,
            selects: [],
            children: ["N", "S", "A", "AB", "B", "BC", "C", "D"],
          },
        ],
      },
      columnDefs:[
      {
        headerName: '序号',
        // 使用 valueGetter 动态计算序号
        valueGetter: (params) => {
          return params.node.rowIndex + 1;
        },
        sortable: false, // 通常序号列本身不参与排序
        filter: false,   // 通常序号列不参与过滤
        width: 100
      },
      {
        field: 'receiptNumber',
        headerName: '编号',
        width: 150
      },

      
        { 
          field: "productName", 
          headerName: "商品图", 
          autoHeight: true,
          cellRenderer: (params) => {
            const imgSrc = params.data.fileList.length ? params.data.fileList[0] : ""
            return `<img src="${imgSrc}" style="width: 100px;" />`;
          } 
        }, // 可排序、过滤
        { field: "productName", headerName: "商品名",minWidth: 500 },
        { field: "startPrice", headerName: "起拍价", width:150 },
        { field: "currentPrice", headerName: "当前价", width:150 },
        { headerName: "状态", width:150,cellRenderer:(params)=>{
          return ``
        }},
        { headerName: "操作", width:150,cellRenderer:(params)=>{
          return ``
        }},
      ],
      defaultColDef:{},
      products: [
        
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
    this.settingForm.lang = settingsStore.lang;
    this.settingForm.currency = settingsStore.currency;
    this.getList();
  },
  methods: {
    handleSizeChange(v){
      this.params.pageSize = v
      this.getList()
    },
    handleCurrentChange(v){
      this.params.pageNo = v
      this.getList()
    },
    formatTime(t){
      if(!t) return ""
      return t.split('T')[0]
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
    async getList() {
      const { list,total } = await getList(this.params);
      list.forEach((item) => {
        item.image = item.fileList.length ? item.fileList[0] : "";
      });
      this.products = list;
      this.total = total
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
</style>
