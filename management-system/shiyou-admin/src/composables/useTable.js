import { ref, computed, watch, reactive } from 'vue'

// =========================================================================
// 列表页通用状态管理（筛选 / 分页 / 勾选）
// 用法：
//   const table = useTable(rows, {
//     pageSize: 5,
//     matchFn: (row) => 命中条件  // 内部可读取页面上的筛选 ref，自动响应
//   })
// 模板中：v-for="row in table.pagedRows"，分页/全选用 table.goPage / table 相关属性
//
// 兼容三种数据入参：
//   1) ref / computed   —— 自动取 .value
//   2) reactive 数组    —— 直接使用（页面常用 reactive(mockData) 写法）
//   3) 普通数组          —— 直接使用
//
// 返回 reactive 对象：Vue 会对其内部 ref 属性自动解包，
// 因此模板中 table.pagedRows / table.page 等可直接作为值使用。
// =========================================================================
export function useTable(rowsInput, { pageSize = 5, matchFn = null } = {}) {
  const page = ref(1)
  const selectedIds = ref(new Set())

  // 归一化入参：ref/computed 取 .value，其余（reactive 数组/普通数组）直接用
  const rowsSource = computed(() =>
    rowsInput && rowsInput.__v_isRef ? rowsInput.value : rowsInput
  )

  const filtered = computed(() =>
    matchFn ? rowsSource.value.filter((row) => matchFn(row)) : rowsSource.value
  )

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filtered.value.length / pageSize))
  )

  const pagedRows = computed(() => {
    const start = (page.value - 1) * pageSize
    return filtered.value.slice(start, start + pageSize)
  })

  watch(filtered, () => {
    if (page.value > totalPages.value) page.value = totalPages.value
  })

  function goPage(step) {
    page.value = Math.min(Math.max(1, page.value + step), totalPages.value)
  }

  function resetPage() {
    page.value = 1
  }

  // ---- 勾选 ----
  function isSelected(id) {
    return selectedIds.value.has(id)
  }

  function toggleSelect(id, checked) {
    const next = new Set(selectedIds.value)
    if (checked) next.add(id)
    else next.delete(id)
    selectedIds.value = next
  }

  const allSelectedOnPage = computed(
    () =>
      pagedRows.value.length > 0 &&
      pagedRows.value.every((row) => selectedIds.value.has(row.id))
  )

  const someSelectedOnPage = computed(() => pagedRows.value.some((row) => selectedIds.value.has(row.id)))

  function selectAllOnPage(checked) {
    const next = new Set(selectedIds.value)
    pagedRows.value.forEach((row) => {
      if (checked) next.add(row.id)
      else next.delete(row.id)
    })
    selectedIds.value = next
  }

  function selectedRows() {
    return rowsSource.value.filter((row) => selectedIds.value.has(row.id))
  }

  function clearSelection() {
    selectedIds.value = new Set()
  }

  return reactive({
    page,
    totalPages,
    filtered,
    pagedRows,
    goPage,
    resetPage,
    isSelected,
    toggleSelect,
    allSelectedOnPage,
    someSelectedOnPage,
    selectAllOnPage,
    selectedRows,
    clearSelection
  })
}
