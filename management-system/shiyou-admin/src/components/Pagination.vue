<template>
  <div class="pagination">
    <span class="page-info">共 {{ total }} 条 · 第 {{ page }} / {{ totalPages }} 页</span>
    <button class="btn" :disabled="page <= 1" @click="$emit('prev')">上一页</button>
    <button class="btn" :disabled="page >= totalPages" @click="$emit('next')">下一页</button>
  </div>
</template>

<script setup>
defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  total: { type: Number, default: 0 }
})

defineEmits(['prev', 'next'])
</script>
