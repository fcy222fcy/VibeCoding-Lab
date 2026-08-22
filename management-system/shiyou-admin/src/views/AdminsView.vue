<template>
  <div>
    <PageHeader title="管理员账号" description="超级管理员创建后台管理员账号，并为其分配角色；支持搜索、筛选、批量删除和分页展示。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增管理员</BaseButton>
      </template>
    </PageHeader>

    <div class="filter-bar admin-filter-bar">
      <input v-model="keyword" placeholder="搜索账号" @keyup.enter="table.resetPage()" />
      <select v-model="roleFilter">
        <option>全部角色</option>
        <option>超级管理员</option>
        <option>内容管理员</option>
        <option>系统管理员</option>
        <option>用户和店铺信息管理员</option>
      </select>
      <select v-model="statusFilter">
        <option>全部状态</option>
        <option>启用</option>
        <option>禁用</option>
      </select>
      <BaseButton variant="primary" @click="table.resetPage()">查询</BaseButton>
      <BaseButton @click="resetFilters">重置</BaseButton>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 46px">
            <input
              type="checkbox"
              :disabled="!table.pagedRows.some((r) => !r.builtin)"
              :checked="table.allSelectedOnPage"
              @change="table.selectAllOnPage($event.target.checked)"
            />
          </th>
          <th>账号</th>
          <th>角色</th>
          <th>状态</th>
          <th>创建时间</th>
          <th>最近更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>
            <input
              type="checkbox"
              :disabled="row.builtin"
              :checked="table.isSelected(row.id)"
              @change="table.toggleSelect(row.id, $event.target.checked)"
            />
          </td>
          <td>{{ row.account }}</td>
          <td><StatusTag :text="row.role" :tone="row.role === '超级管理员' ? 'red' : 'blue'" /></td>
          <td><StatusTag :text="row.status" /></td>
          <td>{{ row.createTime }}</td>
          <td>{{ row.updateTime }}</td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="openEdit(row)">查看(可修改)</span>
              <span v-if="!row.builtin" class="op-link danger" @click="remove(row)">删除</span>
            </div>
          </td>
        </tr>
        <tr v-if="!table.pagedRows.length">
          <td colspan="7" style="text-align: center; color: #9ca3af">暂无匹配数据</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />

    <AppModal v-model:open="editOpen" :title="editing ? '编辑管理员' : '新增管理员'" confirm-text="保存" @confirm="doSave">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>账号</label><input v-model="form.account" :disabled="editing?.builtin" /></div>
        <div class="form-item"><label>角色</label><select v-model="form.role"><option>内容管理员</option><option>系统管理员</option><option>用户和店铺信息管理员</option></select></div>
        <div class="form-item"><label>状态</label><select v-model="form.status"><option>启用</option><option>禁用</option></select></div>
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
import { admins } from '@/data/mock'

const rows = reactive(admins)
const keyword = ref('')
const roleFilter = ref('全部角色')
const statusFilter = ref('全部状态')

const table = useTable(rows, {
  pageSize: 5,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const matchKw = !kw || row.account.toLowerCase().includes(kw)
    const matchRole = roleFilter.value === '全部角色' || row.role === roleFilter.value
    const matchStatus = statusFilter.value === '全部状态' || row.status === statusFilter.value
    return matchKw && matchRole && matchStatus
  }
})

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const editOpen = ref(false)
const editing = ref(null)
const form = reactive({ account: '', role: '内容管理员', status: '启用' })

function resetFilters() {
  keyword.value = ''
  roleFilter.value = '全部角色'
  statusFilter.value = '全部状态'
  table.resetPage()
  showToast('管理员筛选条件已重置。')
}

function openAdd() {
  editing.value = null
  Object.assign(form, { account: '', role: '内容管理员', status: '启用' })
  editOpen.value = true
}

function openEdit(row) {
  editing.value = row
  Object.assign(form, { account: row.account, role: row.role, status: row.status })
  editOpen.value = true
}

function doSave() {
  if (editing.value) {
    Object.assign(editing.value, { role: form.role, status: form.status, updateTime: formatNow() })
    appendLog('超级管理员', '权限管理', '编辑管理员账号', form.account)
    showToast('管理员信息已更新。')
  } else {
    rows.unshift({
      id: Date.now(),
      account: form.account || 'new_admin',
      role: form.role,
      status: form.status,
      createTime: formatNow().slice(0, 10),
      updateTime: formatNow(),
      builtin: false
    })
    appendLog('超级管理员', '权限管理', '新增管理员账号', form.account || 'new_admin')
    showToast('管理员已添加到示例列表。')
  }
  editOpen.value = false
}

function remove(row) {
  openDialog({
    title: '删除管理员',
    body: `确认删除管理员「${row.account}」？超级管理员为内置账号不可删除。此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('超级管理员', '权限管理', '删除管理员账号', row.account)
      showToast('已删除该管理员。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的管理员。')
  openDialog({
    title: '批量删除管理员',
    body: `确认删除 ${list.length} 个管理员？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('超级管理员', '权限管理', '批量删除管理员', `${list.length} 个`)
      showToast(`已删除 ${list.length} 个管理员。`)
    }
  })
}
</script>
