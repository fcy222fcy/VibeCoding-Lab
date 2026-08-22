<template>
  <div>
    <PageHeader title="用户管理" description="查询用户、封禁 / 解封用户、调整信誉分。管理员不可代用户注销账号。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增用户</BaseButton>
      </template>
    </PageHeader>

    <div class="filter-bar">
      <input v-model="keyword" placeholder="昵称 / 手机号" @keyup.enter="table.resetPage()" />
      <select v-model="statusFilter">
        <option>全部状态</option>
        <option>正常</option>
        <option>封禁</option>
        <option>已注销</option>
      </select>
      <select v-model="schoolFilter">
        <option>全部学校</option>
        <option>东湖大学</option>
        <option>大学城职业学院</option>
      </select>
      <BaseButton variant="primary" @click="table.resetPage()">查询</BaseButton>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 46px">
            <input type="checkbox" :checked="table.allSelectedOnPage" @change="table.selectAllOnPage($event.target.checked)" />
          </th>
          <th>用户 ID</th>
          <th>昵称</th>
          <th>手机号</th>
          <th>学校</th>
          <th>评价数</th>
          <th>信誉分</th>
          <th>注册时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>
            <input type="checkbox" :checked="table.isSelected(row.id)" @change="table.toggleSelect(row.id, $event.target.checked)" />
          </td>
          <td>{{ row.userId }}</td>
          <td>{{ row.nickname }}</td>
          <td>{{ row.phone }}</td>
          <td>{{ row.school }}</td>
          <td>{{ row.reviewCount }}</td>
          <td>{{ row.credit }}</td>
          <td>{{ row.registerTime }}</td>
          <td><StatusTag :text="row.status" /></td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="view(row)">查看</span>
              <span v-if="row.status === '正常'" class="op-link danger" @click="toggleBan(row)">封禁</span>
              <span v-if="row.status === '封禁'" class="op-link" @click="toggleBan(row)">解封</span>
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

    <AppModal v-model:open="detailOpen" :title="`用户详情 · ${current?.nickname ?? ''}`" confirm-text="知道了">
      <div v-if="current" class="preview-box">
        <div class="field-line"><label>用户 ID</label><span>{{ current.userId }}</span></div>
        <div class="field-line"><label>昵称</label><span>{{ current.nickname }}</span></div>
        <div class="field-line"><label>手机号</label><span>{{ current.phone }}</span></div>
        <div class="field-line"><label>学校</label><span>{{ current.school }}</span></div>
        <div class="field-line"><label>评价数</label><span>{{ current.reviewCount }}</span></div>
        <div class="field-line"><label>信誉分</label><span>{{ current.credit }}</span></div>
        <div class="field-line"><label>注册时间</label><span>{{ current.registerTime }}</span></div>
        <div class="field-line"><label>状态</label><span><StatusTag :text="current.status" /></span></div>
      </div>
    </AppModal>

    <AppModal v-model:open="addOpen" title="新增用户" confirm-text="保存" @confirm="doAdd">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>昵称</label><input v-model="form.nickname" /></div>
        <div class="form-item"><label>手机号</label><input v-model="form.phone" /></div>
        <div class="form-item"><label>学校</label><select v-model="form.school"><option>东湖大学</option><option>大学城职业学院</option></select></div>
        <div class="form-item"><label>初始状态</label><select v-model="form.status"><option>正常</option><option>封禁</option></select></div>
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
import { users } from '@/data/mock'

const rows = reactive(users)
const keyword = ref('')
const statusFilter = ref('全部状态')
const schoolFilter = ref('全部学校')

const table = useTable(rows, {
  pageSize: 3,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const matchKw = !kw || `${row.nickname} ${row.phone}`.toLowerCase().includes(kw)
    const matchStatus = statusFilter.value === '全部状态' || row.status === statusFilter.value
    const matchSchool = schoolFilter.value === '全部学校' || row.school === schoolFilter.value
    return matchKw && matchStatus && matchSchool
  }
})

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const current = ref(null)
const detailOpen = ref(false)
const addOpen = ref(false)
const form = reactive({ nickname: '', phone: '', school: '东湖大学', status: '正常' })

function view(row) {
  current.value = row
  detailOpen.value = true
}

// 封禁 / 解封用户（演示交互）
function toggleBan(row) {
  const banning = row.status === '正常'
  row.status = banning ? '封禁' : '正常'
  appendLog('超级管理员', '用户管理', banning ? '封禁用户' : '解封用户', row.nickname)
  showToast(`${banning ? '已封禁' : '已解封'}用户「${row.nickname}」。`)
}

function remove(row) {
  openDialog({
    title: '删除用户',
    body: `确认删除用户「${row.nickname}」？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('超级管理员', '用户管理', '删除用户', row.nickname)
      showToast('已删除该用户。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的用户。')
  openDialog({
    title: '批量删除用户',
    body: `确认删除 ${list.length} 个用户？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('超级管理员', '用户管理', '批量删除用户', `${list.length} 个`)
      showToast(`已删除 ${list.length} 个用户。`)
    }
  })
}

function openAdd() {
  Object.assign(form, { nickname: '', phone: '', school: '东湖大学', status: '正常' })
  addOpen.value = true
}

function doAdd() {
  rows.unshift({
    id: Date.now(),
    userId: 20000 + rows.length + 1,
    nickname: form.nickname || '新用户',
    phone: form.phone || '138****0000',
    school: form.school,
    reviewCount: 0,
    credit: 100,
    registerTime: formatNow(),
    status: form.status
  })
  appendLog('超级管理员', '用户管理', '新增用户', form.nickname || '新用户')
  showToast('用户已添加到示例列表。')
  addOpen.value = false
}
</script>
