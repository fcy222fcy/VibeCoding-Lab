<template>
  <div class="login-page">
    <!-- 左侧品牌介绍区 -->
    <div class="login-visual">
      <h1>食友 ShiYou</h1>
      <p>
        校园美食评价平台后台管理系统。<br />
        本系统为「原型演示版」，用于说明后台各模块的功能设计：
        内容审核、用户与店铺管理、榜单运营、系统设置以及 RBAC 权限体系。
      </p>
    </div>

    <!-- 右侧登录表单 -->
    <div class="login-box-wrapper">
      <div class="login-box">
        <h2>管理员登录</h2>
        <p>使用后台管理员账号登录</p>
        <input v-model="account" placeholder="账号（原型：任意输入）" />
        <input v-model="password" type="password" placeholder="密码（原型：任意输入）" @keyup.enter="login" />
        <button class="btn primary" @click="login">登 录</button>
        <div class="prototype-note">
          静态原型演示：无需真实校验，点击登录即可进入后台，体验各模块页面布局与交互。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const account = ref('')
const password = ref('')

function login() {
  router.push('/admin/dashboard')
}
</script>
