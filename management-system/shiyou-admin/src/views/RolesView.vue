<template>
  <div>
    <PageHeader title="角色管理" description="维护后台角色；支持搜索、状态筛选、角色类型筛选、批量删除、分页和弹窗授权。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增角色</BaseButton>
      </template>
    </PageHeader>

    <div class="filter-bar role-filter-bar">
      <input v-model="keyword" placeholder="搜索角色名称 / 编码" @keyup.enter="table.resetPage()" />
      <select v-model="typeFilter">
        <option>全部角色</option>
        <option>超级管理员</option>
        <option>内容管理员</option>
        <option>系统管理员</option>
        <option>用户和店铺信息管理员</option>
        <option>榜单运营</option>
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
            <input
              type="checkbox"
              :disabled="!table.pagedRows.some((r) => !r.builtin)"
              :checked="table.allSelectedOnPage"
              @change="table.selectAllOnPage($event.target.checked)"
            />
          </th>
          <th>角色名称</th>
          <th>角色编码</th>
          <th>定位</th>
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
          <td>{{ row.name }}</td>
          <td>{{ row.code }}</td>
          <td>{{ row.desc }}</td>
          <td><StatusTag :text="row.status" /></td>
          <td>{{ row.createTime }}</td>
          <td>{{ row.updateTime }}</td>
          <td>
            <div v-if="row.builtin" class="op-list">
              <span class="op-link" @click="showPermission(row)">查看权限</span>
            </div>
            <div v-else class="op-list">
              <span class="op-link" @click="openEdit(row)">编辑</span>
              <span class="op-link" @click="openAuthorize(row)">授权</span>
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

    <!-- 新增 / 编辑角色 -->
    <AppModal v-model:open="editOpen" :title="editing ? '编辑角色' : '新增角色'" confirm-text="保存" @confirm="doSave">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>角色名称</label><input v-model="form.name" /></div>
        <div class="form-item"><label>角色编码</label><input v-model="form.code" /></div>
        <div class="form-item" style="grid-column: 1 / -1"><label>定位</label><input v-model="form.desc" /></div>
        <div class="form-item"><label>状态</label><select v-model="form.status"><option>启用</option><option>停用</option></select></div>
      </div>
    </AppModal>

    <!-- 授权弹窗：菜单权限 + 接口/按钮权限 -->
    <AppModal v-model:open="authOpen" :title="`授权 · ${authRole?.name ?? ''}`" confirm-text="保存授权" @confirm="doAuthorize">
      <div class="form-section">
        <div class="form-section-title">菜单权限</div>
        <div class="auth-check-grid">
          <label v-for="m in menuOptions" :key="m">
            <input type="checkbox" :value="m" v-model="authMenus" /> {{ m }}
          </label>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">接口 / 按钮权限</div>
        <div class="auth-check-grid">
          <label v-for="p in permissionOptions" :key="p">
            <input type="checkbox" :value="p" v-model="authPermissions" /> {{ p }}
          </label>
        </div>
      </div>
    </AppModal>

    <!-- 查看权限 -->
    <AppModal v-model:open="permOpen" :title="`角色权限 · ${permRole?.name ?? ''}`" confirm-text="知道了">
      <div class="form-section">
        <div class="form-section-title">菜单权限</div>
        <div class="op-list" style="flex-wrap: wrap; gap: 8px">
          <StatusTag v-for="m in permMenus" :key="m" :text="m" tone="blue" />
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">接口 / 按钮权限</div>
        <div class="op-list" style="flex-wrap: wrap; gap: 8px">
          <StatusTag v-for="p in permPermissions" :key="p" :text="p" tone="green" />
        </div>
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
import { roles, rolePermissionPresets, menuOptions, permissionOptions } from '@/data/mock'

const rows = reactive(roles)
const keyword = ref('')
const typeFilter = ref('全部角色')
const statusFilter = ref('全部状态')

const table = useTable(rows, {
  pageSize: 5,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const matchKw = !kw || `${row.name} ${row.code}`.toLowerCase().includes(kw)
    const matchType = typeFilter.value === '全部角色' || row.name === typeFilter.value
    const matchStatus = statusFilter.value === '全部状态' || row.status === statusFilter.value
    return matchKw && matchType && matchStatus
  }
})

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const editOpen = ref(false)
const editing = ref(null)
const form = reactive({ name: '', code: '', desc: '', status: '启用' })

const authOpen = ref(false)
const authRole = ref(null)
const authMenus = ref([])
const authPermissions = ref([])

const permOpen = ref(false)
const permRole = ref(null)
const permMenus = ref([])
const permPermissions = ref([])

function resetFilters() {
  keyword.value = ''
  typeFilter.value = '全部角色'
  statusFilter.value = '全部状态'
  table.resetPage()
  showToast('角色筛选条件已重置。')
}

function openAdd() {
  editing.value = null
  Object.assign(form, { name: '', code: '', desc: '', status: '启用' })
  editOpen.value = true
}

function openEdit(row) {
  editing.value = row
  Object.assign(form, { name: row.name, code: row.code, desc: row.desc, status: row.status })
  editOpen.value = true
}

function doSave() {
  if (editing.value) {
    Object.assign(editing.value, { name: form.name, code: form.code, desc: form.desc, status: form.status, updateTime: formatNow() })
    appendLog('超级管理员', '权限管理', '编辑角色', form.name)
    showToast('角色信息已更新。')
  } else {
    rows.unshift({ id: Date.now(), name: form.name || '新角色', code: form.code || 'new_role', desc: form.desc || '-', status: form.status, createTime: formatNow().slice(0, 10), updateTime: formatNow(), builtin: false })
    appendLog('超级管理员', '权限管理', '新增角色', form.name || '新角色')
    showToast('角色已添加到示例列表。')
  }
  editOpen.value = false
}

// 打开授权弹窗：按角色预设勾选初始项
function openAuthorize(row) {
  authRole.value = row
  const preset = rolePermissionPresets[row.name] || { menus: [], permissions: [] }
  authMenus.value = [...preset.menus]
  authPermissions.value = [...preset.permissions]
  authOpen.value = true
}

function doAuthorize() {
  appendLog('超级管理员', '权限管理', '保存角色授权', authRole.value.name)
  showToast(`已保存「${authRole.value.name}」的授权。`)
  authOpen.value = false
}

// 查看角色权限（内置角色仅可查看）
function showPermission(row) {
  permRole.value = row
  const preset = rolePermissionPresets[row.name] || { menus: [], permissions: [] }
  permMenus.value = preset.menus
  permPermissions.value = preset.permissions
  permOpen.value = true
}

function remove(row) {
  openDialog({
    title: '删除角色',
    body: `确认删除角色「${row.name}」？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('超级管理员', '权限管理', '删除角色', row.name)
      showToast('已删除该角色。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的角色。')
  openDialog({
    title: '批量删除角色',
    body: `确认删除 ${list.length} 个角色？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('超级管理员', '权限管理', '批量删除角色', `${list.length} 个`)
      showToast(`已删除 ${list.length} 个角色。`)
    }
  })
}
</script>
