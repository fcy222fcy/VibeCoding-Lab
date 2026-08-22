<template>
  <div>
    <PageHeader title="工作台" description="集中展示今日待处理事项、榜单任务状态和系统运行情况。">
      <template #actions>
        <BaseButton variant="primary" @click="refresh">刷新数据</BaseButton>
      </template>
    </PageHeader>

    <!-- 待办统计（点击卡片可跳转到对应处理页面） -->
    <div class="grid cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="card stat-card"
        style="cursor: pointer"
        @click="go(stat.route)"
      >
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-value" style="color: #2563eb">{{ stat.value }}</div>
        <div class="stat-tip">{{ stat.tip }}</div>
      </div>
    </div>

    <div class="grid cols-2" style="margin-top: 16px">
      <!-- 快捷处理入口 -->
      <div class="card">
        <div class="section-title"><h3>快捷处理入口</h3></div>
        <div class="actions">
          <BaseButton variant="primary" @click="go('voucherAudit')">去审核凭证</BaseButton>
          <BaseButton variant="warning" @click="go('reportAudit')">去处理举报</BaseButton>
          <BaseButton @click="go('pendingShops')">处理待确认店铺</BaseButton>
          <BaseButton @click="go('rankingTasks')">查看榜单任务</BaseButton>
        </div>
      </div>

      <!-- 最新操作动态 -->
      <div class="card">
        <div class="section-title"><h3>最新操作动态</h3></div>
        <div class="timeline">
          <div v-for="(item, i) in activities" :key="i" class="timeline-item">
            <div class="dot"></div>
            <div class="timeline-content">
              <strong>{{ item.title }}</strong>
              <span>{{ item.meta }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { showToast } = useToast()

const stats = [
  { label: '待审核凭证', value: 12, tip: '其中 3 条已超 48 小时', route: 'voucherAudit' },
  { label: '待处理举报', value: 7, tip: '2 条评价已自动隐藏', route: 'reportAudit' },
  { label: '待确认店铺', value: 9, tip: '用户新增店铺待处理', route: 'pendingShops' },
  { label: '二次审核队列', value: 4, tip: '低信誉用户评价审核', route: 'secondAudit' }
]

const activities = [
  { title: '内容管理员审核通过消费凭证', meta: '评价 ID：RV20260503001 · 10 分钟前' },
  { title: '系统管理员手动刷新店铺排行榜', meta: '任务执行成功 · 38 分钟前' },
  { title: '超级管理员调整系统热度权重', meta: '点赞权重 3.0 → 3.5 · 1 小时前' }
]

function go(name) {
  router.push({ name })
}

function refresh() {
  showToast('示例数据已刷新。')
}
</script>
