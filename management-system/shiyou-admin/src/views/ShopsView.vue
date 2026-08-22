<template>
  <div>
    <PageHeader title="店铺列表" description="维护正式店铺，支持校内 / 校外范围、类型、位置、上下线配置；支持搜索、筛选、批量删除和分页展示。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增正式店铺</BaseButton>
      </template>
    </PageHeader>

    <div class="filter-bar">
      <input v-model="keyword" placeholder="店铺名称" @keyup.enter="table.resetPage()" />
      <select v-model="rangeFilter">
        <option>全部范围</option>
        <option>校内</option>
        <option>校外</option>
      </select>
      <select v-model="statusFilter">
        <option>全部状态</option>
        <option>上线</option>
        <option>下线</option>
      </select>
      <BaseButton variant="primary" @click="table.resetPage()">查询</BaseButton>
      <BaseButton @click="resetFilters">重置</BaseButton>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 46px">
            <input type="checkbox" :checked="table.allSelectedOnPage" @change="table.selectAllOnPage($event.target.checked)" />
          </th>
          <th>店铺名称</th>
          <th>范围</th>
          <th>所属学校</th>
          <th>类型</th>
          <th>地址 / 位置</th>
          <th>创建人</th>
          <th>评价数</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>
            <input type="checkbox" :checked="table.isSelected(row.id)" @change="table.toggleSelect(row.id, $event.target.checked)" />
          </td>
          <td>{{ row.name }}</td>
          <td><StatusTag :text="row.range" :tone="row.range === '校内' ? 'blue' : 'orange'" /></td>
          <td>{{ row.school }}</td>
          <td><span class="tag">{{ row.type }}</span></td>
          <td>{{ row.address }}</td>
          <td>{{ row.creator }}</td>
          <td>{{ row.reviewCount }}</td>
          <td><StatusTag :text="row.status" :tone="row.status === '上线' ? 'green' : 'gray'" /></td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="view(row)">查看</span>
              <span class="op-link" @click="openEdit(row)">编辑</span>
              <span class="op-link danger" @click="remove(row)">删除</span>
            </div>
          </td>
        </tr>
        <tr v-if="!table.pagedRows.length">
          <td colspan="10" style="text-align: center; color: #9ca3af">暂无匹配数据</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />

    <AppModal v-model:open="detailOpen" :title="`店铺详情 · ${current?.name ?? ''}`" confirm-text="知道了">
      <div v-if="current" class="preview-box">
        <div class="field-line"><label>店铺名称</label><span>{{ current.name }}</span></div>
        <div class="field-line"><label>范围</label><span>{{ current.range }}</span></div>
        <div class="field-line"><label>所属学校</label><span>{{ current.school }}</span></div>
        <div class="field-line"><label>类型</label><span>{{ current.type }}</span></div>
        <div class="field-line"><label>地址 / 位置</label><span>{{ current.address }}</span></div>
        <div class="field-line"><label>创建人</label><span>{{ current.creator }}</span></div>
        <div class="field-line"><label>评价数</label><span>{{ current.reviewCount }}</span></div>
        <div class="field-line"><label>状态</label><span><StatusTag :text="current.status" /></span></div>
      </div>
    </AppModal>

    <AppModal v-model:open="editOpen" :title="editing ? '编辑店铺' : '新增正式店铺'" confirm-text="保存" @confirm="doSave">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>店铺名称</label><input v-model="form.name" /></div>
        <div class="form-item"><label>范围</label><select v-model="form.range"><option>校内</option><option>校外</option></select></div>
        <div class="form-item"><label>所属学校</label><input v-model="form.school" /></div>
        <div class="form-item"><label>类型</label><select v-model="form.type"><option>实体店</option><option>外卖</option><option>摊位</option></select></div>
        <div class="form-item" style="grid-column: 1 / -1"><label>地址 / 位置</label><input v-model="form.address" /></div>
        <div class="form-item"><label>状态</label><select v-model="form.status"><option>上线</option><option>下线</option></select></div>
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
import { shops } from '@/data/mock'

const rows = reactive(shops)
const keyword = ref('')
const rangeFilter = ref('全部范围')
const statusFilter = ref('全部状态')

const table = useTable(rows, {
  pageSize: 3,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const matchKw = !kw || row.name.toLowerCase().includes(kw)
    const matchRange = rangeFilter.value === '全部范围' || row.range === rangeFilter.value
    const matchStatus = statusFilter.value === '全部状态' || row.status === statusFilter.value
    return matchKw && matchRange && matchStatus
  }
})

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const current = ref(null)
const detailOpen = ref(false)
const editOpen = ref(false)
const editing = ref(null)
const form = reactive({ name: '', range: '校内', school: '', type: '实体店', address: '', status: '上线' })

function resetFilters() {
  keyword.value = ''
  rangeFilter.value = '全部范围'
  statusFilter.value = '全部状态'
  table.resetPage()
  showToast('店铺筛选条件已重置。')
}

function view(row) {
  current.value = row
  detailOpen.value = true
}

function openAdd() {
  editing.value = null
  Object.assign(form, { name: '', range: '校内', school: '', type: '实体店', address: '', status: '上线' })
  editOpen.value = true
}

function openEdit(row) {
  editing.value = row
  Object.assign(form, { name: row.name, range: row.range, school: row.school, type: row.type, address: row.address, status: row.status })
  editOpen.value = true
}

function doSave() {
  if (editing.value) {
    Object.assign(editing.value, { ...form })
    appendLog('店铺管理员', '店铺管理', '编辑店铺', form.name)
    showToast('店铺信息已更新。')
  } else {
    rows.unshift({ id: Date.now(), ...form, creator: '超级管理员', reviewCount: 0, createTime: formatNow() })
    appendLog('超级管理员', '店铺管理', '新增正式店铺', form.name || '新店铺')
    showToast('店铺已添加到示例列表。')
  }
  editOpen.value = false
}

function remove(row) {
  openDialog({
    title: '删除店铺',
    body: `确认删除店铺「${row.name}」？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('超级管理员', '店铺管理', '删除店铺', row.name)
      showToast('已删除该店铺。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的店铺。')
  openDialog({
    title: '批量删除店铺',
    body: `确认删除 ${list.length} 个店铺？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('超级管理员', '店铺管理', '批量删除店铺', `${list.length} 个`)
      showToast(`已删除 ${list.length} 个店铺。`)
    }
  })
}
</script>
