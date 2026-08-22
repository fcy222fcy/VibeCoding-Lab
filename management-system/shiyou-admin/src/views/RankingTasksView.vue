<template>
  <div>
    <PageHeader title="榜单任务" description="查看店铺榜和评论榜刷新状态，可新建榜单任务，任务类型仅支持店铺和评论。">
      <template #actions>
        <BaseButton variant="primary" @click="openAdd">新建榜单任务</BaseButton>
        <BaseButton @click="manualRefresh">手动刷新榜单</BaseButton>
      </template>
    </PageHeader>

    <div class="mini-help">
      可点击「新建榜单任务」「手动刷新榜单」「查看快照」「重试」，任务类型仅支持店铺榜和评论榜。
    </div>

    <table style="margin-top: 16px">
      <thead>
        <tr>
          <th>任务名称</th>
          <th>榜单类型</th>
          <th>最近刷新时间</th>
          <th>触发方式</th>
          <th>状态</th>
          <th>失败原因</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>{{ row.name }}</td>
          <td>{{ row.type }}</td>
          <td>{{ row.lastRefresh }}</td>
          <td>{{ row.trigger }}</td>
          <td><StatusTag :text="row.status" /></td>
          <td>{{ row.error }}</td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="goSnapshot(row)">查看快照</span>
              <span v-if="row.status === '失败'" class="op-link" @click="retry(row)">重试</span>
            </div>
          </td>
        </tr>
        <tr v-if="!table.pagedRows.length">
          <td colspan="7" style="text-align: center; color: #9ca3af">暂无任务</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />

    <AppModal v-model:open="addOpen" title="新建榜单任务" confirm-text="创建" @confirm="doAdd">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>任务名称</label><input v-model="form.name" /></div>
        <div class="form-item"><label>榜单类型</label><select v-model="form.type"><option>店铺榜</option><option>评论榜</option></select></div>
        <div class="form-item"><label>触发方式</label><select v-model="form.trigger"><option>自动任务</option><option>手动任务</option></select></div>
        <div class="form-item"><label>初始状态</label><select v-model="form.status"><option>成功</option><option>待执行</option></select></div>
      </div>
      <p class="modal-tip" style="color: #6b7280; font-size: 13px; margin-top: 14px">
        示例限制：榜单任务只允许创建「店铺榜」或「评论榜」，不再提供口味标签榜 / 菜品类别榜。
      </p>
    </AppModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/BaseButton.vue'
import StatusTag from '@/components/StatusTag.vue'
import Pagination from '@/components/Pagination.vue'
import AppModal from '@/components/AppModal.vue'
import { useTable } from '@/composables/useTable'
import { useToast } from '@/composables/useToast'
import { appendLog, formatNow } from '@/store/logs'
import { rankingTasks } from '@/data/mock'

const router = useRouter()
const rows = reactive(rankingTasks)
const table = useTable(rows, { pageSize: 3 })

const { showToast } = useToast()

const addOpen = ref(false)
const form = reactive({ name: '校园店铺榜刷新', type: '店铺榜', trigger: '自动任务', status: '成功' })

// 手动刷新全部榜单任务
function manualRefresh() {
  rows.forEach((row) => {
    row.lastRefresh = formatNow()
    row.trigger = '手动刷新'
    row.status = '成功'
    row.error = '-'
  })
  appendLog('系统管理员', '榜单管理', '手动刷新榜单', '全部榜单任务')
  showToast('榜单任务已手动刷新，快照数据已更新为示例结果。')
}

// 查看快照：跳转到榜单快照页并预选榜单类型
function goSnapshot(row) {
  router.push({
    name: 'rankingSnapshot',
    query: { type: row.type === '评论榜' ? '本周热门评论' : '大学城店铺榜' }
  })
}

function retry(row) {
  row.lastRefresh = formatNow()
  row.trigger = '手动重试'
  row.status = '成功'
  row.error = '-'
  appendLog('系统管理员', '榜单管理', '重试榜单任务', row.name)
  showToast('失败任务已重试成功。')
}

function openAdd() {
  Object.assign(form, { name: '校园店铺榜刷新', type: '店铺榜', trigger: '自动任务', status: '成功' })
  addOpen.value = true
}

function doAdd() {
  rows.unshift({
    id: Date.now(),
    name: form.name || '新榜单任务',
    type: form.type,
    lastRefresh: form.status === '成功' ? formatNow() : '-',
    trigger: form.trigger,
    status: form.status,
    error: '-'
  })
  appendLog('系统管理员', '榜单管理', '新建榜单任务', form.name || '新榜单任务')
  showToast('榜单任务已创建。')
  addOpen.value = false
}
</script>
