<template>
  <div>
    <PageHeader title="权限管理" description="维护接口权限和按钮权限，支持批量删除、创建时间、更新时间和分页展示。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增权限</BaseButton>
      </template>
    </PageHeader>

    <div class="filter-bar">
      <input v-model="keyword" placeholder="搜索权限名称 / 权限编码" @keyup.enter="table.resetPage()" />
      <select v-model="moduleFilter">
        <option>全部模块</option>
        <option>内容审核</option>
        <option>榜单管理</option>
        <option>系统设置</option>
        <option>权限管理</option>
      </select>
      <select v-model="typeFilter">
        <option>全部类型</option>
        <option>接口 / 按钮</option>
        <option>接口</option>
        <option>按钮</option>
      </select>
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
          <th>权限名称</th>
          <th>权限编码</th>
          <th>所属模块</th>
          <th>类型</th>
          <th>状态</th>
          <th>创建时间</th>
          <th>最近更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>
            <input type="checkbox" :checked="table.isSelected(row.id)" @change="table.toggleSelect(row.id, $event.target.checked)" />
          </td>
          <td>{{ row.name }}</td>
          <td>{{ row.code }}</td>
          <td>{{ row.module }}</td>
          <td>{{ row.type }}</td>
          <td><StatusTag :text="row.status" /></td>
          <td>{{ row.createTime }}</td>
          <td>{{ row.updateTime }}</td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="openEdit(row)">编辑</span>
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

    <AppModal v-model:open="editOpen" :title="editing ? '编辑权限' : '新增权限'" confirm-text="保存" @confirm="doSave">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>权限名称</label><input v-model="form.name" /></div>
        <div class="form-item"><label>权限编码</label><input v-model="form.code" /></div>
        <div class="form-item"><label>所属模块</label><select v-model="form.module"><option>内容审核</option><option>榜单管理</option><option>系统设置</option><option>权限管理</option></select></div>
        <div class="form-item"><label>类型</label><select v-model="form.type"><option>接口 / 按钮</option><option>接口</option><option>按钮</option></select></div>
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
import { appendLog, formatNow } from '@/store/logs'
import { permissions } from '@/data/mock'

const rows = reactive(permissions)
const keyword = ref('')
const moduleFilter = ref('全部模块')
const typeFilter = ref('全部类型')
const statusFilter = ref('全部状态')

const table = useTable(rows, {
  pageSize: 5,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const matchKw = !kw || `${row.name} ${row.code}`.toLowerCase().includes(kw)
    const matchModule = moduleFilter.value === '全部模块' || row.module === moduleFilter.value
    const matchType = typeFilter.value === '全部类型' || row.type === typeFilter.value
    const matchStatus = statusFilter.value === '全部状态' || row.status === statusFilter.value
    return matchKw && matchModule && matchType && matchStatus
  }
})

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const editOpen = ref(false)
const editing = ref(null)
const form = reactive({ name: '', code: '', module: '内容审核', type: '接口 / 按钮', status: '启用' })

function resetFilters() {
  keyword.value = ''
  moduleFilter.value = '全部模块'
  typeFilter.value = '全部类型'
  statusFilter.value = '全部状态'
  table.resetPage()
  showToast('权限筛选条件已重置。')
}

function openAdd() {
  editing.value = null
  Object.assign(form, { name: '', code: '', module: '内容审核', type: '接口 / 按钮', status: '启用' })
  editOpen.value = true
}

function openEdit(row) {
  editing.value = row
  Object.assign(form, { name: row.name, code: row.code, module: row.module, type: row.type, status: row.status })
  editOpen.value = true
}

function doSave() {
  if (editing.value) {
    Object.assign(editing.value, { name: form.name, code: form.code, module: form.module, type: form.type, status: form.status, updateTime: formatNow() })
    appendLog('超级管理员', '权限管理', '编辑权限', form.code)
    showToast('权限信息已更新。')
  } else {
    rows.unshift({ id: Date.now(), name: form.name || '新权限', code: form.code || 'new:perm', module: form.module, type: form.type, status: form.status, createTime: formatNow().slice(0, 10), updateTime: formatNow() })
    appendLog('超级管理员', '权限管理', '新增权限', form.code || 'new:perm')
    showToast('权限已添加到示例列表。')
  }
  editOpen.value = false
}

function remove(row) {
  openDialog({
    title: '删除权限',
    body: `确认删除权限「${row.code}」？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('超级管理员', '权限管理', '删除权限', row.code)
      showToast('已删除该权限。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的权限。')
  openDialog({
    title: '批量删除权限',
    body: `确认删除 ${list.length} 个权限？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('超级管理员', '权限管理', '批量删除权限', `${list.length} 个`)
      showToast(`已删除 ${list.length} 个权限。`)
    }
  })
}
</script>
