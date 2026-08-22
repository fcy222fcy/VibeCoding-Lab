<template>
  <div>
    <PageHeader title="标签分组列表" description="管理标签分组，支持添加、编辑、删除分组。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增分组</BaseButton>
      </template>
    </PageHeader>

    <div class="filter-bar">
      <input v-model="keyword" placeholder="搜索分组名称" @keyup.enter="table.resetPage()" />
      <select v-model="statusFilter">
        <option>全部状态</option>
        <option>启用</option>
        <option>停用</option>
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
          <th>分组名称</th>
          <th>分组描述</th>
          <th>排序</th>
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
          <td>{{ row.desc }}</td>
          <td>{{ row.sort }}</td>
          <td><StatusTag :text="row.status" /></td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="openEdit(row)">编辑</span>
              <span class="op-link danger" @click="remove(row)">删除</span>
            </div>
          </td>
        </tr>
        <tr v-if="!table.pagedRows.length">
          <td colspan="6" style="text-align: center; color: #9ca3af">暂无匹配数据</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />

    <AppModal v-model:open="editOpen" :title="editing ? '编辑分组' : '新增分组'" confirm-text="保存" @confirm="doSave">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>分组名称</label><input v-model="form.name" /></div>
        <div class="form-item"><label>排序</label><input v-model="form.sort" type="number" /></div>
        <div class="form-item" style="grid-column: 1 / -1"><label>分组描述</label><input v-model="form.desc" /></div>
        <div class="form-item"><label>状态</label><select v-model="form.status"><option>启用</option><option>停用</option></select></div>
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
import { appendLog } from '@/store/logs'
import { tagGroups } from '@/data/mock'

const rows = reactive(tagGroups)
const keyword = ref('')
const statusFilter = ref('全部状态')

const table = useTable(rows, {
  pageSize: 3,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const matchKw = !kw || row.name.toLowerCase().includes(kw)
    const matchStatus = statusFilter.value === '全部状态' || row.status === statusFilter.value
    return matchKw && matchStatus
  }
})

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const editOpen = ref(false)
const editing = ref(null)
const form = reactive({ name: '', desc: '', sort: 1, status: '启用' })

function resetFilters() {
  keyword.value = ''
  statusFilter.value = '全部状态'
  table.resetPage()
  showToast('分组筛选条件已重置。')
}

function openAdd() {
  editing.value = null
  Object.assign(form, { name: '', desc: '', sort: 1, status: '启用' })
  editOpen.value = true
}

function openEdit(row) {
  editing.value = row
  Object.assign(form, { name: row.name, desc: row.desc, sort: row.sort, status: row.status })
  editOpen.value = true
}

function doSave() {
  if (editing.value) {
    Object.assign(editing.value, { ...form })
    appendLog('超级管理员', '标签管理', '编辑标签分组', form.name)
    showToast('分组信息已更新。')
  } else {
    rows.unshift({ id: Date.now(), ...form })
    appendLog('超级管理员', '标签管理', '新增标签分组', form.name || '新分组')
    showToast('分组已添加到示例列表。')
  }
  editOpen.value = false
}

function remove(row) {
  openDialog({
    title: '删除分组',
    body: `确认删除分组「${row.name}」？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('超级管理员', '标签管理', '删除标签分组', row.name)
      showToast('已删除该分组。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的分组。')
  openDialog({
    title: '批量删除分组',
    body: `确认删除 ${list.length} 个分组？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('超级管理员', '标签管理', '批量删除标签分组', `${list.length} 个`)
      showToast(`已删除 ${list.length} 个分组。`)
    }
  })
}
</script>
