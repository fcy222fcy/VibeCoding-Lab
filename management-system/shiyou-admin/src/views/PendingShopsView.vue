<template>
  <div>
    <PageHeader title="待确认店铺" description="处理用户创建的店铺，可确认为正式店铺、合并、要求补充或驳回。">
      <template #actions>
        <BaseButton variant="danger" @click="batchDelete">批量删除</BaseButton>
      </template>
    </PageHeader>

    <div class="filter-bar">
      <input v-model="keyword" placeholder="店铺名称" @keyup.enter="table.resetPage()" />
      <select v-model="rangeFilter">
        <option>全部范围</option>
        <option>校内</option>
        <option>校外</option>
      </select>
      <select v-model="schoolFilter">
        <option>全部学校</option>
        <option>东湖大学</option>
        <option>大学城职业学院</option>
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
          <th>品类</th>
          <th>范围</th>
          <th>所属学校</th>
          <th>位置说明</th>
          <th>创建人</th>
          <th>关联评价</th>
          <th>相似提示</th>
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
          <td>{{ row.category }}</td>
          <td>{{ row.range }}</td>
          <td>{{ row.school }}</td>
          <td>{{ row.location }}</td>
          <td>{{ row.creator }}</td>
          <td>{{ row.relatedReviews }}</td>
          <td>{{ row.similar }}</td>
          <td><StatusTag :text="row.status" /></td>
          <td>{{ row.time }}</td>
          <td>
            <div class="op-list">
              <span class="op-link" @click="confirmShop(row)">确认</span>
              <span class="op-link" @click="merge(row)">合并</span>
              <span class="op-link" @click="supplement(row)">补充</span>
              <span class="op-link danger" @click="reject(row)">驳回</span>
              <span class="op-link danger" @click="remove(row)">删除</span>
            </div>
          </td>
        </tr>
        <tr v-if="!table.pagedRows.length">
          <td colspan="12" style="text-align: center; color: #9ca3af">暂无匹配数据</td>
        </tr>
      </tbody>
    </table>

    <Pagination :page="table.page" :total-pages="table.totalPages" :total="table.filtered.length" @prev="table.goPage(-1)" @next="table.goPage(1)" />

    <!-- 确认 / 合并 / 补充 弹窗 -->
    <AppModal v-model:open="actionOpen" :title="actionTitle" :confirm-text="actionConfirmText" @confirm="doAction">
      <div v-if="current" class="preview-box">
        <div class="field-line"><label>店铺名称</label><span>{{ current.name }}</span></div>
        <div class="field-line"><label>品类</label><span>{{ current.category }}</span></div>
        <div class="field-line"><label>范围 / 学校</label><span>{{ current.range }} · {{ current.school }}</span></div>
        <div class="field-line"><label>位置说明</label><span>{{ current.location }}</span></div>
        <div class="field-line"><label>相似提示</label><span>{{ current.similar }}</span></div>
        <div v-if="actionType === 'supplement'" class="field-line"><label>补充说明</label><input v-model="supplementNote" placeholder="要求用户补充的信息" /></div>
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
import { pendingShops } from '@/data/mock'

const rows = reactive(pendingShops)
const keyword = ref('')
const rangeFilter = ref('全部范围')
const schoolFilter = ref('全部学校')

const table = useTable(rows, {
  pageSize: 3,
  matchFn: (row) => {
    const kw = keyword.value.trim().toLowerCase()
    const matchKw = !kw || row.name.toLowerCase().includes(kw)
    const matchRange = rangeFilter.value === '全部范围' || row.range === rangeFilter.value
    const matchSchool = schoolFilter.value === '全部学校' || row.school === schoolFilter.value
    return matchKw && matchRange && matchSchool
  }
})

const { showToast } = useToast()
const { dlg, openDialog } = useDialog()

const current = ref(null)
const actionOpen = ref(false)
const actionType = ref('confirm') // confirm / merge / supplement
const supplementNote = ref('')

const actionTitle = ref('')
const actionConfirmText = ref('确认')

function resetFilters() {
  keyword.value = ''
  rangeFilter.value = '全部范围'
  schoolFilter.value = '全部学校'
  table.resetPage()
  showToast('待确认店铺筛选条件已重置。')
}

function confirmShop(row) {
  current.value = row
  actionType.value = 'confirm'
  actionTitle.value = '确认为正式店铺'
  actionConfirmText.value = '确认'
  actionOpen.value = true
}

function merge(row) {
  current.value = row
  actionType.value = 'merge'
  actionTitle.value = '合并店铺'
  actionConfirmText.value = '合并'
  actionOpen.value = true
}

function supplement(row) {
  current.value = row
  actionType.value = 'supplement'
  actionTitle.value = '要求补充信息'
  actionConfirmText.value = '发送'
  supplementNote.value = ''
  actionOpen.value = true
}

function doAction() {
  if (actionType.value === 'confirm') {
    current.value.status = '已确认'
    appendLog('店铺管理员', '店铺管理', '确认待确认店铺', current.value.name)
    showToast(`「${current.value.name}」已确认为正式店铺。`)
  } else if (actionType.value === 'merge') {
    current.value.status = '已合并'
    appendLog('店铺管理员', '店铺管理', '合并待确认店铺', current.value.name)
    showToast(`「${current.value.name}」已合并至正式店铺。`)
  } else {
    current.value.status = '待补充'
    appendLog('店铺管理员', '店铺管理', '要求补充店铺信息', `${current.value.name}${supplementNote.value ? '：' + supplementNote.value : ''}`)
    showToast('已向创建人发送补充信息要求。')
  }
  actionOpen.value = false
}

function reject(row) {
  openDialog({
    title: '驳回店铺',
    body: `确认驳回「${row.name}」的店铺申请？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认驳回',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('店铺管理员', '店铺管理', '驳回待确认店铺', row.name)
      showToast('已驳回该店铺申请。')
    }
  })
}

function remove(row) {
  openDialog({
    title: '删除记录',
    body: `确认删除「${row.name}」的待确认记录？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      const idx = rows.findIndex((r) => r.id === row.id)
      if (idx > -1) rows.splice(idx, 1)
      appendLog('店铺管理员', '店铺管理', '删除待确认店铺', row.name)
      showToast('已删除该记录。')
    }
  })
}

function batchDelete() {
  const list = table.selectedRows()
  if (!list.length) return showToast('请先勾选需要删除的记录。')
  openDialog({
    title: '批量删除',
    body: `确认删除 ${list.length} 条待确认店铺记录？此处为静态原型示例，不会真正提交后端。`,
    confirmText: '确认删除',
    onConfirm: () => {
      list.forEach((row) => {
        const idx = rows.findIndex((r) => r.id === row.id)
        if (idx > -1) rows.splice(idx, 1)
      })
      table.clearSelection()
      appendLog('店铺管理员', '店铺管理', '批量删除待确认店铺', `${list.length} 条`)
      showToast(`已删除 ${list.length} 条记录。`)
    }
  })
}
</script>
