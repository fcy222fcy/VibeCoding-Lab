<script setup>
defineProps({
  todo: { type: Object, required: true }
})

const emit = defineEmits(['toggle', 'delete'])

const priorityText = { high: '高', medium: '中', low: '低' }
</script>

<template>
  <li class="todo-item" :class="{ completed: todo.completed }">
    <div class="priority-badge" :class="`priority-${todo.priority}`">
      {{ priorityText[todo.priority] }}
    </div>
    <input
      type="checkbox"
      class="checkbox"
      :checked="todo.completed"
      @change="emit('toggle', todo.id)"
    />
    <span class="todo-text">{{ todo.text }}</span>
    <button class="delete-btn" @click="emit('delete', todo.id)">&times;</button>
  </li>
</template>
