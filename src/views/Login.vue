<template>
  <div class="login">
    <s-header :name="state.type == 'login' ? '登录' : '注册'" :back="'/home'"></s-header>
    <img class="logo" src="/src/assets/logo.svg" alt="">
    
    <!-- 登录表单 -->
    <div v-if="state.type == 'login'" class="login-body login">
      <van-form @submit="onSubmit">
        <van-field
          v-model="state.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="state.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          v-model="state.verify"
        >
          <template #button>
            <vue-img-verify ref="verifyRef" />
          </template>
        </van-field>
        <div style="margin: 16px;">
          <div class="link-register" @click="toggle('register')">立即注册</div>
          <van-button round block color="#1baeae" native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>
    
    <!-- 注册表单 -->
    <div v-else class="login-body register">
      <van-form @submit="onSubmit">
        <van-field
          v-model="state.username1"
          name="username1"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="state.password1"
          type="password"
          name="password1"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          v-model="state.verify"
        >
          <template #button>
            <vue-img-verify ref="verifyRef" />
          </template>
        </van-field>
        <div style="margin: 16px;">
          <div class="link-login" @click="toggle('login')">已有登录账号</div>
          <van-button round block color="#1baeae" native-type="submit">注册</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import sHeader from '@/components/SimpleHeader.vue'
import vueImgVerify from '@/components/VueImageVerify.vue'
import { login, register } from '@/api/member/user'
import { setToken } from '@/utils/auth'
import md5 from 'js-md5'
import { showSuccessToast, showFailToast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()
const verifyRef = ref(null)
const state = reactive({
  username: '',
  password: '',
  username1: '',
  password1: '',
  type: 'login',
  imgCode: '',
  verify: ''
})

// 提交登录或注册表单
const onSubmit = async () => {
  // 验证码校验
  if (!verifyRef.value?.state?.imgCode) {
    ElMessage.error('请先获取验证码');
    return;
  }
  
  if (form.captcha !== verifyRef.value.state.imgCode) {
    ElMessage.error('验证码错误');
    verifyRef.value?.handleDraw(); // 重新生成验证码
    return;
  }

  try {
    // 修改参数名：username -> mobile
    const loginData = {
      mobile: form.username,  // 将用户名字段映射为手机号
      password: md5(form.password)
    };
    
    const response = await login(loginData);
    if (response.code === 0) {
      setToken(response.data.accessToken)
      showSuccessToast('登录成功')
      router.push('/')
    } else {
      showFailToast(response.msg || '登录失败')
      // 重新生成验证码
      if (verifyRef.value && verifyRef.value.handleDraw) {
        verifyRef.value.handleDraw()
      }
    }
  } catch (error) {
    console.error('提交失败:', error)
    // 根据错误类型显示不同的提示信息
    if (error.response && error.response.data && error.response.data.msg) {
      showFailToast(error.response.data.msg)
    } else if (state.type === 'login') {
      showFailToast('登录失败，请检查用户名和密码')
    } else {
      showFailToast('注册失败，请重试')
    }
    // 重新生成验证码
    if (verifyRef.value && verifyRef.value.handleDraw) {
      verifyRef.value.handleDraw()
    }
  }
}

// 切换登录和注册两种模式
const toggle = (v) => {
  state.type = v
  state.verify = ''
  // 延迟执行，确保组件已经重新渲染
  setTimeout(() => {
    if (verifyRef.value && verifyRef.value.handleDraw) {
      verifyRef.value.handleDraw()
    }
  }, 100)
}
</script>

<style lang="less">
.login {
  .logo {
    width: 120px;
    height: 120px;
    display: block;
    margin: 80px auto 20px;
  }
  .login-body {
    padding: 0 20px;
  }
  .login {
    .link-register {
      font-size: 14px;
      margin-bottom: 20px;
      color: #1989fa;
      display: inline-block;
    }
  }
  .register {
    .link-login {
      font-size: 14px;
      margin-bottom: 20px;
      color: #1989fa;
      display: inline-block;
    }
  }
  .verify-bar-area {
    margin-top: 24px;
    .verify-left-bar {
      border-color: #1baeae;
    }
    .verify-move-block {
      background-color: #1baeae;
      color: #fff;
    }
  }
  .verify {
    >div {
      width: 100%;
    }
    display: flex;
    justify-content: center;
    .cerify-code-panel {
      margin-top: 16px;
    }
    .verify-code {
      width: 40%!important;
      float: left!important;
    }
    .verify-code-area {
      float: left!important;
      width: 54%!important;
      margin-left: 14px!important;
      .varify-input-code {
        width: 90px;
        height: 38px!important;
        border: 1px solid #e9e9e9;
        padding-left: 10px;
        font-size: 16px;
      }
      .verify-change-area {
        line-height: 44px;
      }
    }
  }
}
</style>
