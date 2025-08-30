<template>
  <div class="s-canvas">
    <canvas id="s-canvas" :width="contentWidth" :height="contentHeight" @click="handleDraw"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 先定义所有函数和变量
const state = ref({
  imgCode: ''
});

const contentWidth = ref(112);
const contentHeight = ref(31);

// 生成随机数
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// 生成随机颜色
const randomColor = (min, max) => {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
};

// 绘制验证码
const draw = () => {
  const canvas = document.getElementById('s-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'bottom';
  
  // 绘制背景
  ctx.fillStyle = randomColor(180, 240);
  ctx.fillRect(0, 0, contentWidth.value, contentHeight.value);
  
  // 绘制文字
  const str = 'ABCEFGHJKLMNPQRSTWXY123456789';
  let imgCode = '';
  for (let i = 0; i < 4; i++) {
    const txt = str[randomNum(0, str.length)];
    imgCode += txt;
    ctx.fillStyle = randomColor(50, 160);
    ctx.font = randomNum(15, 25) + 'px SimHei';
    const x = (i + 1) * (contentWidth.value / 5);
    const y = randomNum(25, 30);
    const deg = randomNum(-45, 45);
    ctx.translate(x, y);
    ctx.rotate(deg * Math.PI / 180);
    ctx.fillText(txt, 0, 0);
    ctx.rotate(-deg * Math.PI / 180);
    ctx.translate(-x, -y);
  }
  
  // 绘制干扰线
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = randomColor(40, 180);
    ctx.beginPath();
    ctx.moveTo(randomNum(0, contentWidth.value), randomNum(0, contentHeight.value));
    ctx.lineTo(randomNum(0, contentWidth.value), randomNum(0, contentHeight.value));
    ctx.stroke();
  }
  
  // 绘制干扰点
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    ctx.arc(randomNum(0, contentWidth.value), randomNum(0, contentHeight.value), 1, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  state.value.imgCode = imgCode;
};

// 重新绘制验证码
const handleDraw = () => {
  draw();
};

// 组件挂载后初始化
onMounted(() => {
  draw();
});

// 暴露给父组件的方法和状态（放在所有函数定义之后）
defineExpose({ state, handleDraw });
</script>

<style scoped>
.s-canvas {
  height: 38px;
}
.s-canvas canvas {
  margin-top: 1px;
  margin-left: 8px;
}
</style>