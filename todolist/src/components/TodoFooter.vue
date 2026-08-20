<script setup>
defineProps({
  activeCount: { type: Number, required: true },
  completedCount: { type: Number, required: true },
  total: { type: Number, required: true }
})

defineEmits(['clear-completed', 'clear-all'])
</script>

<template>
  <div class="todo-footer">
    <span class="todo-count">{{ activeCount }} 个任务</span>
    <div class="footer-actions">
      <button
        class="clear-btn"
        :disabled="completedCount === 0"
        @click="$emit('clear-completed')"
      >
        <span class="btn-text">清除已完成</span>
        <span class="btn-emoji">🗑️</span>
      </button>
      <button
        class="clear-btn secondary"
        :disabled="total === 0"
        @click="$emit('clear-all')"
      >
        <span class="btn-text">清除全部</span>
      </button>
    </div>
  </div>
</template>
