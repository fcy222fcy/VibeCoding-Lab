<template>
  <div>
    <PageHeader title="榜单快照" description="查看最近一次榜单计算结果，用于排查排名异常。" />

    <div class="filter-bar">
      <select v-model="snapshotType">
        <option>大学城店铺榜</option>
        <option>本周热门评论</option>
      </select>
      <BaseButton variant="primary" @click="query">查询</BaseButton>
    </div>

    <div class="mini-help">
      切换下拉榜单或点击查询，会刷新店铺榜 / 评论榜快照示例数据。
    </div>

    <table style="margin-top: 16px">
      <thead>
        <tr>
          <th>排名</th>
          <th>上榜对象</th>
          <th>对象类型</th>
          <th>最终分</th>
          <th>热度分</th>
          <th>有效评价数</th>
          <th>计算时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="`${snapshotType}-${row.rank}`">
          <td>{{ row.rank }}</td>
          <td>{{ row.name }}</td>
          <td><StatusTag :text="row.type" :tone="row.type === '店铺' ? 'blue' : 'green'" /></td>
          <td>{{ row.score }}</td>
          <td>{{ row.heat }}</td>
          <td>{{ row.reviews }}</td>
          <td>{{ calcTime }}</td>
        </tr>
        <tr v-if="!table.pagedRows.length">
          <td colspan="7" style="text-align: center; color: #9ca3af">暂无快照数据</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/BaseButton.vue'
import StatusTag from '@/components/StatusTag.vue'
import Pagination from '@/components/Pagination.vue'
import { useTable } from '@/composables/useTable'
import { useToast } from '@/composables/useToast'
import { formatNow } from '@/store/logs'
import { rankingSnapshots } from '@/data/mock'

const route = useRoute()
const { showToast } = useToast()

const snapshotType = ref('大学城店铺榜')

// 支持从榜单任务页携带 type 参数跳转过来
if (route.query.type && rankingSnapshots[route.query.type]) {
  snapshotType.value = route.query.type
}

const rows = computed(() => rankingSnapshots[snapshotType.value] || [])
const table = useTable(rows, { pageSize: 5 })
const calcTime = formatNow()

watch(snapshotType, () => table.resetPage())

function query() {
  table.resetPage()
  showToast(`已切换到「${snapshotType.value}」快照示例数据。`)
}
</script>
