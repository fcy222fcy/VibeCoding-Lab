<template>
  <div>
    <PageHeader title="待审核凭证" description="处理用户上传的消费凭证，审核通过后评价展示「已验证消费」。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增待审</BaseButton>
      </template>
    </PageHeader>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <input v-model="keyword" placeholder="搜索提交人 / 店铺" @keyup.enter="table.resetPage()" />
      <select v-model="statusFilter">
        <option>全部状态</option>
        <option>待审核</option>
        <option>已超时</option>
      </select>
      <BaseButton variant="primary" @click="table.resetPage()">查询</BaseButton>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 46px">
            <input
              type="checkbox"
              :checked="table.allSelectedOnPage"
              @change="table.selectAllOnPage($event.target.checked)"
            />
          </th>
          <th>提交人</th>
          <th>关联店铺</th>
          <th>评价摘要</th>
          <th>凭证</th>
          <th>提交时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>
            <input
              type="checkbox"
              :checked="table.isSelected(row.id)"
              @change="table.toggleSelect(row.id, $event.target.checked)"
            />
          </td>
          <td>{{ row.user }}</td>
          <td>{{ row.shop }}</td>
          <td>{{ row.summary }}</td>
          <td><span class="op-link" @click="view(row)">预览图片</span></td>
          <td>{{ row.submitTime }}</td>
          <td><StatusTag :text="row.status" /></td>
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
          <td colspan="8" style="text-align: center; color: #9ca3af">暂无匹配数据</td>
        </tr>
      </tbody>
    </table>

    <Pagination
      :page="table.page"
      :total-pages="table.totalPages"
      :total="table.filtered.length"
      @prev="table.goPage(-1)"
      @next="table.goPage(1)"
    />

    <!-- 查看凭证详情 -->
    <AppModal v-model:open="detailOpen" :title="`凭证详情 · ${current?.user ?? ''}`" confirm-text="知道了">
      <div v-if="current" class="preview-box">
        <div class="field-line"><label>提交人</label><span>{{ current.user }}</span></div>
        <div class="field-line"><label>关联店铺</label><span>{{ current.shop }}</span></div>
        <div class="field-line"><label>评价摘要</label><span>{{ current.summary }}</span></div>
        <div class="field-line"><label>提交时间</label><span>{{ current.submitTime }}</span></div>
        <div class="field-line"><label>当前状态</label><span><StatusTag :text="current.status" /></span></div>
      </div>
    </AppModal>

    <!-- 拒绝凭证 -->
    <AppModal v-model:open="rejectOpen" title="拒绝凭证" confirm-text="确认拒绝" @confirm="doReject">
      <div class="field-line"><label>用户</label><span>{{ current?.user }}</span></div>
      <div class="field-line"><label>拒绝原因</label><input v-model="rejectReason" placeholder="如：凭证模糊" /></div>
    </AppModal>

    <!-- 新增待审 -->
    <AppModal v-model:open="addOpen" title="新增待审凭证" confirm-text="保存" @confirm="doAdd">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>提交人</label><input v-model="form.user" /></div>
        <div class="form-item"><label>关联店铺</label><input v-model="form.shop" /></div>
        <div class="form-item"><label>评价摘要</label><input v-model="form.summary" /></div>
        <div class="form-item"><label>状态</label><select v-model="form.status"><option>待审核</option><option>已超时</option></select></div>
      </div>
    </AppModal>

    <!-- 删除确认 -->
    <AppModal v-model:open="dlg.open" :title="dlg.title" :confirm-text="dlg.confirmText" @confirm="dlg.onConfirm">
      {{ dlg.body }}
    </AppModal>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/BaseButton.vue'
import StatusTag from '@/components/StatusTag.vue'
import Pagination from '@/components/Pagination.vue'
import AppModal from '@/components/AppModal.vue'
import { useTable } from '@/composables/useTable'
import { useToast } from '@/composables/useToast'
import { useDialog } from '@/composables/useDialog'
import { appendLog, formatNow } from '@/store/logs'
import { vouchers } from '@/data/mock'

const rows = reactive(vouchers)
const keyword = ref('')
const statusFilter = ref('全部状态')

const table = useTable(rows, {
  pageSize: 3,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const matchKw = !kw || `${row.user} ${row.shop}`.toLowerCase().includes(kw)
    const matchStatus = statusFilter.value === '全部状态' || row.status === statusFilter.value
    return matchKw && matchStatus
  }
})

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const current = ref(null)
const detailOpen = ref(false)
const rejectOpen = ref(false)
const rejectReason = ref('')
const addOpen = ref(false)
const form = reactive({ user: '', shop: '', summary: '', status: '待审核' })

function view(row) {
  current.value = row
  detailOpen.value = true
}

function approve(row) {
  row.status = '已通过'
  appendLog('内容管理员', '内容审核', '审核通过凭证', row.user)
  showToast(`已通过「${row.user}」的凭证。`)
}

function reject(row) {
  current.value = row
  rejectReason.value = ''
  rejectOpen.value = true
}

function doReject() {
  current.value.status = '已拒绝'
  appendLog('内容管理员', '内容审核', '审核拒绝凭证', current.value.user, '成功', rejectReason.value || '凭证不符')
  showToast(`已拒绝「${current.value.user}」的凭证。`)
  rejectOpen.value = false
}

function remove(row) {
  openDialog({
    title: '删除凭证',
    body: `确认删除「${row.user} · ${row.shop}」的待审记录？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('内容管理员', '内容审核', '删除凭证', `${row.user} · ${row.shop}`)
      showToast('已删除该凭证。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的凭证。')
  openDialog({
    title: '批量删除凭证',
    body: `确认删除 ${list.length} 条凭证？${list.map((r) => r.user).join('、')}。此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('内容管理员', '内容审核', '批量删除凭证', `${list.length} 条`)
      showToast(`已删除 ${list.length} 条凭证。`)
    }
  })
}

function openAdd() {
  Object.assign(form, { user: '', shop: '', summary: '', status: '待审核' })
  addOpen.value = true
}

function doAdd() {
  rows.unshift({
    id: Date.now(),
    user: form.user || '新用户',
    shop: form.shop || '示例店铺',
    summary: form.summary || '示例评价摘要...',
    hasImage: true,
    submitTime: formatNow(),
    status: '待审核'
  })
  appendLog('内容管理员', '内容审核', '新增凭证', form.user || '新用户')
  showToast('待审凭证已添加到示例列表。')
  addOpen.value = false
}
</script>
