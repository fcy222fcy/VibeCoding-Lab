<template>
  <div>
    <PageHeader title="学校管理" description="维护学校基础信息，用于校内 / 校外店铺范围控制和首页展示。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
        <BaseButton variant="primary" @click="openAdd">新增学校</BaseButton>
      </template>
    </PageHeader>

    <table>
      <thead>
        <tr>
          <th style="width: 46px">
            <input type="checkbox" :checked="table.allSelectedOnPage" @change="table.selectAllOnPage($event.target.checked)" />
          </th>
          <th>学校名称</th>
          <th>校区</th>
          <th>经纬度</th>
          <th>状态</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.pagedRows" :key="row.id">
          <td>
            <input type="checkbox" :checked="table.isSelected(row.id)" @change="table.toggleSelect(row.id, $event.target.checked)" />
          </td>
          <td>{{ row.name }}</td>
          <td>{{ row.campus }}</td>
          <td>{{ row.location }}</td>
          <td><StatusTag :text="row.status" /></td>
          <td>{{ row.createTime }}</td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="openEdit(row)">编辑</span>
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

    <AppModal v-model:open="editOpen" :title="editing ? '编辑学校' : '新增学校'" confirm-text="保存" @confirm="doSave">
      <div class="form-grid modal-form-grid">
        <div class="form-item"><label>学校名称</label><input v-model="form.name" /></div>
        <div class="form-item"><label>校区</label><input v-model="form.campus" /></div>
        <div class="form-item"><label>经纬度</label><input v-model="form.location" placeholder="如：30.123 / 114.456" /></div>
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
import { schools } from '@/data/mock'

const rows = reactive(schools)
const table = useTable(rows, { pageSize: 3 })

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const editOpen = ref(false)
const editing = ref(null)
const form = reactive({ name: '', campus: '', location: '', status: '启用' })

function openAdd() {
  editing.value = null
  Object.assign(form, { name: '', campus: '', location: '', status: '启用' })
  editOpen.value = true
}

function openEdit(row) {
  editing.value = row
  Object.assign(form, { name: row.name, campus: row.campus, location: row.location, status: row.status })
  editOpen.value = true
}

function doSave() {
  if (editing.value) {
    Object.assign(editing.value, { ...form })
    appendLog('超级管理员', '学校管理', '编辑学校', form.name)
    showToast('学校信息已更新。')
  } else {
    rows.unshift({ id: Date.now(), name: form.name || '新学校', campus: form.campus || '-', location: form.location || '-', status: form.status, createTime: formatNow() })
    appendLog('超级管理员', '学校管理', '新增学校', form.name || '新学校')
    showToast('学校已添加到示例列表。')
  }
  editOpen.value = false
}

function remove(row) {
  openDialog({
    title: '删除学校',
    body: `确认删除「${row.name}」？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('超级管理员', '学校管理', '删除学校', row.name)
      showToast('已删除该学校。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的学校。')
  openDialog({
    title: '批量删除学校',
    body: `确认删除 ${list.length} 所学校？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('超级管理员', '学校管理', '批量删除学校', `${list.length} 所`)
      showToast(`已删除 ${list.length} 所学校。`)
    }
  })
}
</script>
