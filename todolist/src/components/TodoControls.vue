<script setup>
const filter = defineModel('filter')
const sort = defineModel('sort')

const filters = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'completed', label: '已完成' }
]
</script>

<template>
  <div class="todo-controls">
    <div class="todo-filters">
      <button
        v-for="f in filters"
        :key="f.value"
        class="filter-btn"
        :class="{ active: filter === f.value }"
        @click="filter = f.value"
      >
        {{ f.label }}
      </button>
    </div>
    <div class="todo-sort">
      <select v-model="sort" class="sort-select">
        <option value="created">创建时间</option>
        <option value="priority">优先级</option>
      </select>
    </div>
  </div>
</template>
