<template>
  <div>
    <PageHeader title="二次审核队列" description="低信誉用户或消费凭证多次被拒用户发布的评价，需要审核后公开。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增审核</BaseButton>
      </template>
    </PageHeader>

    <table>
      <thead>
        <tr>
          <th style="width: 46px">
            <input type="checkbox" :checked="table.allSelectedOnPage" @change="table.selectAllOnPage($event.target.checked)" />
          </th>
          <th>用户</th>
          <th>信誉分</th>
          <th>店铺</th>
          <th>评价内容</th>
          <th>触发原因</th>
          <th>详细原因</th>
          <th>提交时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>
            <input type="checkbox" :checked="table.isSelected(row.id)" @change="table.toggleSelect(row.id, $event.target.checked)" />
          </td>
          <td>{{ row.user }}</td>
          <td><StatusTag :text="row.credit" :tone="row.credit < 60 ? 'red' : 'orange'" /></td>
          <td>{{ row.shop }}</td>
          <td>{{ row.content }}</td>
          <td>{{ row.trigger }}</td>
          <td>{{ row.reason }}</td>
          <td>{{ row.time }}</td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="view(row)">查看</span>
              <span class="op-link" @click="approve(row)">通过</span>
              <span class="op-link danger" @click="reject(row)">拒绝</span>
              <span class="op-link danger" @click="remove(row)">删除</span>
            </div>
          </td>
        </tr>
        <tr v-if="!table.pagedRows.length">
          <td colspan="9" style="text-align: center; color: #9ca3af">暂无匹配数据</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />

    <AppModal v-model:open="detailOpen" :title="`二次审核 · ${current?.user ?? ''}`" confirm-text="知道了">
      <div v-if="current" class="preview-box">
        <div class="field-line"><label>用户</label><span>{{ current.user }}</span></div>
        <div class="field-line"><label>信誉分</label><span>{{ current.credit }}</span></div>
        <div class="field-line"><label>店铺</label><span>{{ current.shop }}</span></div>
        <div class="field-line"><label>评价内容</label><span>{{ current.content }}</span></div>
        <div class="field-line"><label>触发原因</label><span>{{ current.trigger }}</span></div>
        <div class="field-line"><label>详细原因</label><span>{{ current.reason }}</span></div>
        <div class="field-line"><label>提交时间</label><span>{{ current.time }}</span></div>
      </div>
    </AppModal>

    <AppModal v-model:open="addOpen" title="新增二次审核" confirm-text="保存" @confirm="doAdd">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>用户</label><input v-model="form.user" /></div>
        <div class="form-item"><label>信誉分</label><input v-model="form.credit" type="number" /></div>
        <div class="form-item"><label>店铺</label><input v-model="form.shop" /></div>
        <div class="form-item"><label>评价内容</label><input v-model="form.content" /></div>
        <div class="form-item"><label>触发原因</label><select v-model="form.trigger"><option>信誉分低于 60</option><option>凭证多次被拒</option></select></div>
        <div class="form-item"><label>详细原因</label><input v-model="form.reason" /></div>
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
import { secondAudits } from '@/data/mock'

const rows = reactive(secondAudits)
const table = useTable(rows, { pageSize: 3 })

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const current = ref(null)
const detailOpen = ref(false)
const addOpen = ref(false)
const form = reactive({ user: '', credit: 60, shop: '', content: '', trigger: '信誉分低于 60', reason: '' })

function view(row) {
  current.value = row
  detailOpen.value = true
}

function approve(row) {
  row.status = '已通过'
  appendLog('内容管理员', '内容审核', '二次审核通过', row.user)
  showToast(`已通过「${row.user}」的二次审核。`)
}

function reject(row) {
  row.status = '已拒绝'
  appendLog('内容管理员', '内容审核', '二次审核拒绝', row.user)
  showToast(`已拒绝「${row.user}」的二次审核。`)
}

function remove(row) {
  openDialog({
    title: '删除审核记录',
    body: `确认删除「${row.user}」的审核记录？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('内容管理员', '内容审核', '删除二次审核记录', row.user)
      showToast('已删除该审核记录。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的审核记录。')
  openDialog({
    title: '批量删除',
    body: `确认删除 ${list.length} 条二次审核记录？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('内容管理员', '内容审核', '批量删除二次审核记录', `${list.length} 条`)
      showToast(`已删除 ${list.length} 条审核记录。`)
    }
  })
}

function openAdd() {
  Object.assign(form, { user: '', credit: 60, shop: '', content: '', trigger: '信誉分低于 60', reason: '' })
  addOpen.value = true
}

function doAdd() {
  rows.unshift({
    id: Date.now(),
    user: form.user || '新用户',
    credit: Number(form.credit) || 60,
    shop: form.shop || '示例店铺',
    content: form.content || '示例评价内容...',
    trigger: form.trigger,
    reason: form.reason || form.trigger,
    time: formatNow()
  })
  appendLog('内容管理员', '内容审核', '新增二次审核', form.user || '新用户')
  showToast('二次审核记录已添加到示例列表。')
  addOpen.value = false
}
</script>
