<template>
  <el-carousel height="400px" class="wrapper" :interval="6000">
      <el-carousel-item v-for="item in swiperList" :key="item.auctionId">
        <div class="carousel-i">
          <div class="carousel-text">
           <div class="inner">
            <h2>{{ item.name }}</h2>
            <h3>{{ item.time }}</h3>
            <span>{{ item.text  }}</span>
            <el-button size="lanrge" class="mt-2" @click="toList(item)">去逛逛</el-button>
           </div>
          </div>
          <div class="carousel-img">
           <img :src="item.imgUrl" alt="">
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
</template>

<script>
export default {
  props: {
    swiperList: Array
  },
  methods: {
    toList(item) {
      this.$router.push({path:'/auction'})
    }
  }
}
</script>

<style lang='scss' scoped>
 .demonstration {
  color: var(--el-text-color-secondary);
}
.carousel-i {
  height: 400px;
  .carousel-img {
    float: right;
    width: 600px;
    height: 400px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .carousel-text {
    float: left;
    width: calc(100% - 600px);
    height: 400px;
    background-color: rgba(180,180,180,0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    h2{
      font-size: 24px;
      display: block;
    }
    h3{
      font-size: 16px;
      display: block;
    }
    span{
      font-size: 14px;
      display: block;
    }
  }
}

</style>
