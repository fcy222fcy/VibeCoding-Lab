<template>
  <div>
    <PageHeader title="举报处理" description="处理用户对评价的举报，成立后评价永久下架。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增举报</BaseButton>
      </template>
    </PageHeader>

    <div class="filter-bar">
      <input v-model="keyword" placeholder="搜索评价 / 举报人" @keyup.enter="table.resetPage()" />
      <select v-model="reasonFilter">
        <option>全部原因</option>
        <option>内容虚假</option>
        <option>广告推广</option>
        <option>低俗内容</option>
        <option>人身攻击</option>
      </select>
      <BaseButton variant="primary" @click="table.resetPage()">查询</BaseButton>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 46px">
            <input type="checkbox" :checked="table.allSelectedOnPage" @change="table.selectAllOnPage($event.target.checked)" />
          </th>
          <th>举报人</th>
          <th>被举报评价</th>
          <th>原因</th>
          <th>举报次数</th>
          <th>举报时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>
            <input type="checkbox" :checked="table.isSelected(row.id)" @change="table.toggleSelect(row.id, $event.target.checked)" />
          </td>
          <td>{{ row.reporter }}</td>
          <td>{{ row.review }}</td>
          <td>{{ row.reason }}</td>
          <td>{{ row.count }}</td>
          <td>{{ row.time }}</td>
          <td><StatusTag :text="row.status" /></td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="view(row)">查看</span>
              <span class="op-link danger" @click="takeDown(row)">成立下架</span>
              <span class="op-link" @click="dismiss(row)">驳回</span>
              <span class="op-link danger" @click="remove(row)">删除</span>
            </div>
          </td>
        </tr>
        <tr v-if="!table.pagedRows.length">
          <td colspan="8" style="text-align: center; color: #9ca3af">暂无匹配数据</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />

    <AppModal v-model:open="detailOpen" :title="`举报详情 · ${current?.reporter ?? ''}`" confirm-text="知道了">
      <div v-if="current" class="preview-box">
        <div class="field-line"><label>举报人</label><span>{{ current.reporter }}</span></div>
        <div class="field-line"><label>被举报评价</label><span>{{ current.review }}</span></div>
        <div class="field-line"><label>举报原因</label><span>{{ current.reason }}</span></div>
        <div class="field-line"><label>举报次数</label><span>{{ current.count }} 次</span></div>
        <div class="field-line"><label>举报时间</label><span>{{ current.time }}</span></div>
        <div class="field-line"><label>当前状态</label><span><StatusTag :text="current.status" /></span></div>
      </div>
    </AppModal>

    <AppModal v-model:open="addOpen" title="新增举报" confirm-text="保存" @confirm="doAdd">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>举报人</label><input v-model="form.reporter" /></div>
        <div class="form-item"><label>被举报评价</label><input v-model="form.review" /></div>
        <div class="form-item"><label>举报原因</label><select v-model="form.reason"><option>内容虚假</option><option>广告推广</option><option>低俗内容</option><option>人身攻击</option></select></div>
        <div class="form-item"><label>状态</label><select v-model="form.status"><option>待处理</option><option>已自动隐藏</option></select></div>
      </div>
    </AppModal>

    <AppModal v-model:open="dlg.open" :title="dlg.title" :confirm-text="dlg.confirmText" @confirm="dlg.onConfirm">
      {{ dlg.body }}
    </AppModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/BaseButton.vue'
import StatusTag from '@/components/StatusTag.vue'
import Pagination from '@/components/Pagination.vue'
import AppModal from '@/components/AppModal.vue'
import { useTable } from '@/composables/useTable'
import { useToast } from '@/composables/useToast'
import { useDialog } from '@/composables/useDialog'
import { appendLog, formatNow } from '@/store/logs'
import { reports } from '@/data/mock'

const rows = reactive(reports)
const keyword = ref('')
const reasonFilter = ref('全部原因')

const table = useTable(rows, {
  pageSize: 3,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const matchKw = !kw || `${row.reporter} ${row.review}`.toLowerCase().includes(kw)
    const matchReason = reasonFilter.value === '全部原因' || row.reason === reasonFilter.value
    return matchKw && matchReason
  }
})

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const current = ref(null)
const detailOpen = ref(false)
const addOpen = ref(false)
const form = reactive({ reporter: '', review: '', reason: '内容虚假', status: '待处理' })

function view(row) {
  current.value = row
  detailOpen.value = true
}

// 举报成立 → 评价永久下架
function takeDown(row) {
  row.status = '已成立下架'
  appendLog('内容管理员', '内容审核', '举报成立下架评价', row.review)
  showToast(`举报已成立，「${row.review}」已永久下架。`)
}

function dismiss(row) {
  row.status = '已驳回'
  appendLog('内容管理员', '内容审核', '驳回举报', row.review)
  showToast('已驳回该举报。')
}

function remove(row) {
  openDialog({
    title: '删除举报',
    body: `确认删除「${row.review}」的举报记录？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('内容管理员', '内容审核', '删除举报', row.review)
      showToast('已删除该举报记录。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的举报。')
  openDialog({
    title: '批量删除举报',
    body: `确认删除 ${list.length} 条举报记录？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('内容管理员', '内容审核', '批量删除举报', `${list.length} 条`)
      showToast(`已删除 ${list.length} 条举报记录。`)
    }
  })
}

function openAdd() {
  Object.assign(form, { reporter: '', review: '', reason: '内容虚假', status: '待处理' })
  addOpen.value = true
}

function doAdd() {
  rows.unshift({
    id: Date.now(),
    reporter: form.reporter || '匿名用户',
    review: form.review || '示例评价内容...',
    reason: form.reason,
    count: 1,
    time: formatNow(),
    status: form.status
  })
  appendLog('内容管理员', '内容审核', '新增举报', form.reporter || '匿名用户')
  showToast('举报已添加到示例列表。')
  addOpen.value = false
}
</script>
