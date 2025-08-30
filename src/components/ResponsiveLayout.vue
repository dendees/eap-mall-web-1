<template>
  <div class="responsive-layout" :class="`layout-${deviceType}`">
    <slot :device="deviceType" :isMobile="isMobile" :isPC="isPC" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getDeviceType, watchScreenSize, setDeviceClass } from '@/utils/device'

// 响应式数据
const deviceType = ref('mobile')
const isMobile = ref(true)
const isPC = ref(false)

// 更新设备状态
const updateDeviceState = (type) => {
  deviceType.value = type
  isMobile.value = type === 'mobile'
  isPC.value = type === 'pc'
  setDeviceClass()
}

// 监听器清理函数
let unwatch = null

onMounted(() => {
  // 初始化设备状态
  updateDeviceState(getDeviceType())
  
  // 监听屏幕尺寸变化
  unwatch = watchScreenSize(updateDeviceState)
})

onUnmounted(() => {
  // 清理监听器
  if (unwatch) {
    unwatch()
  }
})
</script>

<style lang="less" scoped>
.responsive-layout {
  width: 100%;
  min-height: 100vh;
  
  &.layout-pc {
    // PC 端样式
    .pc-only {
      display: block;
    }
    .mobile-only {
      display: none;
    }
  }
  
  &.layout-mobile {
    // 移动端样式
    .pc-only {
      display: none;
    }
    .mobile-only {
      display: block;
    }
  }
}
</style>