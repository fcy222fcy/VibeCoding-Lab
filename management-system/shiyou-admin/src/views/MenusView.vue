<template>
  <div>
    <PageHeader title="菜单管理" description="维护后台左侧菜单、前端路由和菜单显示权限；支持批量删除、创建时间、更新时间和分页展示。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增菜单</BaseButton>
      </template>
    </PageHeader>

    <div class="filter-bar">
      <input v-model="keyword" placeholder="搜索菜单名称 / 菜单编码 / 路由路径" @keyup.enter="table.resetPage()" />
      <select v-model="parentFilter">
        <option>全部父级</option>
        <option>根菜单</option>
        <option>内容审核</option>
        <option>榜单管理</option>
        <option>权限管理</option>
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
          <th>菜单名称</th>
          <th>菜单编码</th>
          <th>父级菜单</th>
          <th>路由路径</th>
          <th>排序</th>
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
          <td>{{ row.parent }}</td>
          <td>{{ row.path }}</td>
          <td>{{ row.sort }}</td>
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
          <td colspan="10" style="text-align: center; color: #9ca3af">暂无匹配数据</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />

    <AppModal v-model:open="editOpen" :title="editing ? '编辑菜单' : '新增菜单'" confirm-text="保存" @confirm="doSave">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>菜单名称</label><input v-model="form.name" /></div>
        <div class="form-item"><label>菜单编码</label><input v-model="form.code" /></div>
        <div class="form-item"><label>父级菜单</label><select v-model="form.parent"><option>根菜单</option><option>内容审核</option><option>榜单管理</option><option>权限管理</option></select></div>
        <div class="form-item"><label>路由路径</label><input v-model="form.path" /></div>
        <div class="form-item"><label>排序</label><input v-model="form.sort" type="number" /></div>
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
import { menus } from '@/data/mock'

const rows = reactive(menus)
const keyword = ref('')
const parentFilter = ref('全部父级')
const statusFilter = ref('全部状态')

const table = useTable(rows, {
  pageSize: 5,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const matchKw = !kw || `${row.name} ${row.code} ${row.path}`.toLowerCase().includes(kw)
    const matchParent = parentFilter.value === '全部父级' || row.parent === parentFilter.value
    const matchStatus = statusFilter.value === '全部状态' || row.status === statusFilter.value
    return matchKw && matchParent && matchStatus
  }
})

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const editOpen = ref(false)
const editing = ref(null)
const form = reactive({ name: '', code: '', parent: '根菜单', path: '', sort: 10, status: '启用' })

function resetFilters() {
  keyword.value = ''
  parentFilter.value = '全部父级'
  statusFilter.value = '全部状态'
  table.resetPage()
  showToast('菜单筛选条件已重置。')
}

function openAdd() {
  editing.value = null
  Object.assign(form, { name: '', code: '', parent: '根菜单', path: '', sort: 10, status: '启用' })
  editOpen.value = true
}

function openEdit(row) {
  editing.value = row
  Object.assign(form, { name: row.name, code: row.code, parent: row.parent, path: row.path, sort: row.sort, status: row.status })
  editOpen.value = true
}

function doSave() {
  if (editing.value) {
    Object.assign(editing.value, { name: form.name, code: form.code, parent: form.parent, path: form.path, sort: Number(form.sort) || 0, status: form.status, updateTime: formatNow() })
    appendLog('超级管理员', '权限管理', '编辑菜单', form.name)
    showToast('菜单信息已更新。')
  } else {
    rows.unshift({ id: Date.now(), name: form.name || '新菜单', code: form.code || 'new_menu', parent: form.parent, path: form.path || '/new', sort: Number(form.sort) || 99, status: form.status, createTime: formatNow().slice(0, 10), updateTime: formatNow() })
    appendLog('超级管理员', '权限管理', '新增菜单', form.name || '新菜单')
    showToast('菜单已添加到示例列表。')
  }
  editOpen.value = false
}

function remove(row) {
  openDialog({
    title: '删除菜单',
    body: `确认删除菜单「${row.name}」？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('超级管理员', '权限管理', '删除菜单', row.name)
      showToast('已删除该菜单。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的菜单。')
  openDialog({
    title: '批量删除菜单',
    body: `确认删除 ${list.length} 个菜单？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('超级管理员', '权限管理', '批量删除菜单', `${list.length} 个`)
      showToast(`已删除 ${list.length} 个菜单。`)
    }
  })
}
</script>
