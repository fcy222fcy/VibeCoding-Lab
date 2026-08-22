<template>
  <div>
    <PageHeader title="已下架内容" description="查看举报成立或审核拒绝后被下架的评价内容。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增下架</BaseButton>
      </template>
    </PageHeader>

    <table>
      <thead>
        <tr>
          <th style="width: 46px">
            <input type="checkbox" :checked="table.allSelectedOnPage" @change="table.selectAllOnPage($event.target.checked)" />
          </th>
          <th>评价 ID</th>
          <th>作者</th>
          <th>店铺</th>
          <th>下架原因</th>
          <th>处理人</th>
          <th>处理时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>
            <input type="checkbox" :checked="table.isSelected(row.id)" @change="table.toggleSelect(row.id, $event.target.checked)" />
          </td>
          <td>{{ row.reviewId }}</td>
          <td>{{ row.author }}</td>
          <td>{{ row.shop }}</td>
          <td>{{ row.reason }}</td>
          <td>{{ row.handler }}</td>
          <td>{{ row.time }}</td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="view(row)">查看详情</span>
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

    <AppModal v-model:open="detailOpen" :title="`已下架内容 · ${current?.reviewId ?? ''}`" confirm-text="知道了">
      <div v-if="current" class="preview-box">
        <div class="field-line"><label>评价 ID</label><span>{{ current.reviewId }}</span></div>
        <div class="field-line"><label>作者</label><span>{{ current.author }}</span></div>
        <div class="field-line"><label>店铺</label><span>{{ current.shop }}</span></div>
        <div class="field-line"><label>下架原因</label><span>{{ current.reason }}</span></div>
        <div class="field-line"><label>处理人</label><span>{{ current.handler }}</span></div>
        <div class="field-line"><label>处理时间</label><span>{{ current.time }}</span></div>
      </div>
    </AppModal>

    <AppModal v-model:open="addOpen" title="新增下架记录" confirm-text="保存" @confirm="doAdd">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>评价 ID</label><input v-model="form.reviewId" /></div>
        <div class="form-item"><label>作者</label><input v-model="form.author" /></div>
        <div class="form-item"><label>店铺</label><input v-model="form.shop" /></div>
        <div class="form-item"><label>下架原因</label><select v-model="form.reason"><option>广告推广</option><option>内容虚假</option><option>低俗内容</option><option>人身攻击</option></select></div>
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
import Pagination from '@/components/Pagination.vue'
import AppModal from '@/components/AppModal.vue'
import { useTable } from '@/composables/useTable'
import { useToast } from '@/composables/useToast'
import { useDialog } from '@/composables/useDialog'
import { appendLog, formatNow } from '@/store/logs'
import { removedContents } from '@/data/mock'

const rows = reactive(removedContents)
const table = useTable(rows, { pageSize: 3 })

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const current = ref(null)
const detailOpen = ref(false)
const addOpen = ref(false)
const form = reactive({ reviewId: '', author: '', shop: '', reason: '广告推广' })

function view(row) {
  current.value = row
  detailOpen.value = true
}

function remove(row) {
  openDialog({
    title: '删除记录',
    body: `确认删除「${row.reviewId}」的下架记录？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('内容管理员', '内容审核', '删除下架记录', row.reviewId)
      showToast('已删除该下架记录。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的记录。')
  openDialog({
    title: '批量删除',
    body: `确认删除 ${list.length} 条下架记录？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('内容管理员', '内容审核', '批量删除下架记录', `${list.length} 条`)
      showToast(`已删除 ${list.length} 条下架记录。`)
    }
  })
}

function openAdd() {
  Object.assign(form, { reviewId: '', author: '', shop: '', reason: '广告推广' })
  addOpen.value = true
}

function doAdd() {
  rows.unshift({
    id: Date.now(),
    reviewId: form.reviewId || `RV${formatNow().replace(/[-: ]/g, '').slice(0, 12)}`,
    author: form.author || '示例用户',
    shop: form.shop || '示例店铺',
    reason: form.reason,
    handler: '超级管理员',
    time: formatNow()
  })
  appendLog('超级管理员', '内容审核', '新增下架记录', form.reviewId || '示例评价')
  showToast('下架记录已添加到示例列表。')
  addOpen.value = false
}
</script>
