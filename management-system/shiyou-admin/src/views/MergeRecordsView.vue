<template>
  <div>
    <PageHeader title="店铺合并记录" description="记录待确认店铺被合并至正式店铺的历史。" />

    <table>
      <thead>
        <tr>
          <th>原店铺</th>
          <th>目标店铺</th>
          <th>合并原因</th>
          <th>操作人</th>
          <th>操作时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>{{ row.source }}</td>
          <td>{{ row.target }}</td>
          <td>{{ row.reason }}</td>
          <td>{{ row.operator }}</td>
          <td>{{ row.time }}</td>
        </tr>
        <tr v-if="!table.pagedRows.length">
          <td colspan="5" style="text-align: center; color: #9ca3af">暂无合并记录</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import Pagination from '@/components/Pagination.vue'
import { useTable } from '@/composables/useTable'
import { mergeRecords } from '@/data/mock'

const rows = reactive(mergeRecords)
const table = useTable(rows, { pageSize: 3 })
</script>
