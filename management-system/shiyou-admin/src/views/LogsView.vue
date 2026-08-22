<template>
  <div>
    <PageHeader title="操作日志" description="记录后台关键请求日志，默认按操作时间倒序展示，最新操作在最前面。" />

    <div class="filter-bar log-filter-bar">
      <input v-model="keyword" placeholder="搜索管理员ID / 名字 / 操作内容 / 路径" style="min-width: 260px" @keyup.enter="table.resetPage()" />
      <select v-model="methodFilter">
        <option>全部请求方法</option>
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
      </select>
      <select v-model="statusFilter">
        <option>全部状态</option>
        <option>成功</option>
        <option>失败</option>
      </select>
      <input v-model="startDate" type="date" title="开始时间" />
      <input v-model="endDate" type="date" title="结束时间" />
      <BaseButton variant="primary" @click="table.resetPage()">查询</BaseButton>
      <BaseButton @click="resetFilters">重置</BaseButton>
    </div>

    <div class="mini-help">
      可按管理员ID / 名字 / 操作内容 / 路径、请求方法、操作状态和操作日期筛选；默认最新操作在前并支持分页。
    </div>

    <table style="margin-top: 16px">
      <thead>
        <tr>
          <th>操作管理员ID</th>
          <th>名字</th>
          <th>操作内容</th>
          <th>请求方法</th>
          <th>路径</th>
          <th>参数</th>
          <th>操作状态</th>
          <th>错误信息</th>
          <th>操作时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>{{ row.adminId }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.action }}</td>
          <td><StatusTag :text="row.method" :tone="methodTone(row.method)" /></td>
          <td>{{ row.path }}</td>
          <td>{{ row.params }}</td>
          <td><StatusTag :text="row.status" /></td>
          <td>{{ row.errorInfo }}</td>
          <td>{{ row.time }}</td>
        </tr>
        <tr v-if="!table.pagedRows.length">
          <td colspan="9" style="text-align: center; color: #9ca3af">暂无匹配日志</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/BaseButton.vue'
import StatusTag from '@/components/StatusTag.vue'
import Pagination from '@/components/Pagination.vue'
import { useTable } from '@/composables/useTable'
import { useToast } from '@/composables/useToast'
import { logsStore } from '@/store/logs'

const { showToast } = useToast()

const keyword = ref('')
const methodFilter = ref('全部请求方法')
const statusFilter = ref('全部状态')
const startDate = ref('')
const endDate = ref('')

// 按时间倒序展示（最新在前）
const logs = computed(() =>
  [...logsStore.items].sort((a, b) => b.time.localeCompare(a.time))
)

const table = useTable(logs, {
  pageSize: 5,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const haystack = `${row.adminId} ${row.name} ${row.action} ${row.path} ${row.params}`.toLowerCase()
    const matchKw = !kw || haystack.includes(kw)
    const matchMethod = methodFilter.value === '全部请求方法' || row.method === methodFilter.value
    const matchStatus = statusFilter.value === '全部状态' || row.status === statusFilter.value
    const rowDate = row.time.slice(0, 10)
    const matchStart = !startDate.value || rowDate >= startDate.value
    const matchEnd = !endDate.value || rowDate <= endDate.value
    return matchKw && matchMethod && matchStatus && matchStart && matchEnd
  }
})

const methodToneMap = { GET: 'gray', POST: 'orange', PUT: 'blue', DELETE: 'red' }
function methodTone(method) {
  return methodToneMap[method] || 'gray'
}

function resetFilters() {
  keyword.value = ''
  methodFilter.value = '全部请求方法'
  statusFilter.value = '全部状态'
  startDate.value = ''
  endDate.value = ''
  table.resetPage()
  showToast('操作日志筛选条件已重置。')
}
</script>
