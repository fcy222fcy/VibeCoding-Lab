<template>
  <div>
    <PageHeader title="标签 / 菜品类别管理" description="维护预设标签和菜品类别，前台用户不可自定义标签。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增标签</BaseButton>
      </template>
    </PageHeader>

    <!-- 分类页签：点击即按分类筛选 -->
    <div class="tabs">
      <button v-for="cat in categories" :key="cat" class="tab" :class="{ active: categoryFilter === cat }" @click="switchCategory(cat)">
        {{ cat }}
      </button>
    </div>

    <div class="filter-bar">
      <input v-model="keyword" placeholder="搜索标签名称" @keyup.enter="table.resetPage()" />
      <select v-model="categoryFilter">
        <option>全部分类</option>
        <option>口味</option>
        <option>性价比</option>
        <option>堂食体验</option>
        <option>菜品类别</option>
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
          <th>名称</th>
          <th>分类</th>
          <th>是否榜单维度</th>
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
          <td>{{ row.category }}</td>
          <td><StatusTag :text="row.isRanking ? '是' : '否'" :tone="row.isRanking ? 'blue' : 'orange'" /></td>
          <td>{{ row.sort }}</td>
          <td><StatusTag :text="row.status" /></td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="openEdit(row)">编辑</span>
              <span v-if="row.status === '启用'" class="op-link danger" @click="offline(row)">下线</span>
              <span v-else class="op-link" @click="online(row)">上线</span>
              <span class="op-link danger" @click="remove(row)">删除</span>
            </div>
          </td>
        </tr>
        <tr v-if="!table.pagedRows.length">
          <td colspan="7" style="text-align: center; color: #9ca3af">暂无匹配数据</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />

    <AppModal v-model:open="editOpen" :title="editing ? '编辑标签' : '新增标签'" confirm-text="保存" @confirm="doSave">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>标签名称</label><input v-model="form.name" /></div>
        <div class="form-item"><label>分类</label><select v-model="form.category"><option>口味</option><option>性价比</option><option>堂食体验</option><option>菜品类别</option></select></div>
        <div class="form-item"><label>排序</label><input v-model="form.sort" type="number" /></div>
        <div class="form-item"><label>状态</label><select v-model="form.status"><option>启用</option><option>停用</option></select></div>
        <div class="form-item" style="grid-column: 1 / -1"><label>是否榜单维度</label><select v-model="form.isRanking"><option :value="true">是</option><option :value="false">否</option></select></div>
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
import { tags } from '@/data/mock'

const categories = ['全部', '口味标签', '性价比', '堂食体验', '菜品类别']

const rows = reactive(tags)
const keyword = ref('')
const categoryFilter = ref('全部分类')
const statusFilter = ref('全部状态')

const table = useTable(rows, {
  pageSize: 3,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const matchKw = !kw || row.name.toLowerCase().includes(kw)
    const matchCat = categoryFilter.value === '全部分类' || row.category === categoryFilter.value
    const matchStatus = statusFilter.value === '全部状态' || row.status === statusFilter.value
    return matchKw && matchCat && matchStatus
  }
})

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const editOpen = ref(false)
const editing = ref(null)
const form = reactive({ name: '', category: '口味', sort: 1, status: '启用', isRanking: true })

function switchCategory(cat) {
  // 页签与下拉同步：口味标签 → 口味，其余按名称匹配分类
  categoryFilter.value = cat === '口味标签' ? '口味' : cat === '全部' ? '全部分类' : cat
  table.resetPage()
}

function resetFilters() {
  keyword.value = ''
  categoryFilter.value = '全部分类'
  statusFilter.value = '全部状态'
  table.resetPage()
  showToast('标签筛选条件已重置。')
}

function openAdd() {
  editing.value = null
  Object.assign(form, { name: '', category: '口味', sort: 1, status: '启用', isRanking: true })
  editOpen.value = true
}

function openEdit(row) {
  editing.value = row
  Object.assign(form, { name: row.name, category: row.category, sort: row.sort, status: row.status, isRanking: row.isRanking })
  editOpen.value = true
}

function doSave() {
  if (editing.value) {
    Object.assign(editing.value, { ...form })
    appendLog('超级管理员', '标签管理', '编辑标签', form.name)
    showToast('标签信息已更新。')
  } else {
    rows.unshift({ id: Date.now(), ...form, isRanking: !!form.isRanking })
    appendLog('超级管理员', '标签管理', '新增标签', form.name || '新标签')
    showToast('标签已添加到示例列表。')
  }
  editOpen.value = false
}

function offline(row) {
  row.status = '停用'
  appendLog('超级管理员', '标签管理', '下线标签', row.name)
  showToast(`已下线「${row.name}」。`)
}

function online(row) {
  row.status = '启用'
  appendLog('超级管理员', '标签管理', '上线标签', row.name)
  showToast(`已上线「${row.name}」。`)
}

function remove(row) {
  openDialog({
    title: '删除标签',
    body: `确认删除标签「${row.name}」？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('超级管理员', '标签管理', '删除标签', row.name)
      showToast('已删除该标签。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的标签。')
  openDialog({
    title: '批量删除标签',
    body: `确认删除 ${list.length} 个标签？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('超级管理员', '标签管理', '批量删除标签', `${list.length} 个`)
      showToast(`已删除 ${list.length} 个标签。`)
    }
  })
}
</script>
