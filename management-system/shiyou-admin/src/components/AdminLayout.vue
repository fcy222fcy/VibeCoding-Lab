<template>
  <div class="app">
    <!-- 左侧导航：菜单分组与页面一一对应，结构同 README 中的模块划分 -->
    <aside class="sidebar">
      <div class="brand">
        <h1>食友 ShiYou</h1>
        <p>校园美食评价平台 · 后台管理</p>
      </div>

      <nav class="menu">
        <div v-for="group in menuGroups" :key="group.title" class="menu-group">
          <div class="menu-title">{{ group.title }}</div>
          <button
            v-for="item in group.items"
            :key="item.routeName"
            :class="{ active: route.name === item.routeName }"
            @click="go(item)"
          >
            <span>{{ item.label }}</span>
            <span v-if="item.badge" class="badge">{{ item.badge }}</span>
          </button>
        </div>
      </nav>
    </aside>

    <!-- 右侧主区域 -->
    <main class="main">
      <header class="topbar">
        <div class="breadcrumb">
          后台管理系统 <strong>{{ pageTitle }}</strong>
        </div>
        <div class="admin-info">
          <span>超级管理员</span>
          <span class="avatar">A</span>
        </div>
      </header>

      <div class="content">
        <router-view />
      </div>
    </main>

    <ToastHost />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ToastHost from './ToastHost.vue'

const route = useRoute()
const router = useRouter()

// 导航结构（与 router/index.js 的路由一一对应）
const menuGroups = [
  {
    title: '首页',
    items: [{ label: '工作台', routeName: 'dashboard' }]
  },
  {
    title: '内容审核',
    items: [
      { label: '待审核凭证', routeName: 'voucherAudit', badge: 12 },
      { label: '举报处理', routeName: 'reportAudit', badge: 7 },
      { label: '二次审核队列', routeName: 'secondAudit', badge: 4 },
      { label: '已下架内容', routeName: 'removedContent' }
    ]
  },
  {
    title: '用户与基础数据',
    items: [
      { label: '用户管理', routeName: 'users' },
      { label: '学校管理', routeName: 'schools' },
      { label: '标签列表', routeName: 'tags' },
      { label: '标签分组列表', routeName: 'tagGroups' }
    ]
  },
  {
    title: '店铺管理',
    items: [
      { label: '店铺列表', routeName: 'shops' },
      { label: '待确认店铺', routeName: 'pendingShops', badge: 9 },
      { label: '合并记录', routeName: 'mergeRecords' }
    ]
  },
  {
    title: '榜单管理',
    items: [
      { label: '榜单任务', routeName: 'rankingTasks' },
      { label: '榜单快照', routeName: 'rankingSnapshot' }
    ]
  },
  {
    title: '系统管理',
    items: [
      { label: '系统设置', routeName: 'settings' },
      { label: '操作日志', routeName: 'logs' }
    ]
  },
  {
    title: '权限管理',
    items: [
      { label: '管理员账号', routeName: 'admins' },
      { label: '角色管理', routeName: 'roles' },
      { label: '权限管理', routeName: 'permissions' },
      { label: '菜单管理', routeName: 'menus' }
    ]
  }
]

const pageTitle = computed(() => route.meta?.title || '后台页面')

function go(item) {
  router.push({ name: item.routeName })
}
</script>
