<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const text = ref('')
const priority = ref('medium')
const pressed = ref(false)

function submit() {
  const trimmed = text.value.trim()
  if (!trimmed) return
  emit('add', { text: trimmed, priority: priority.value })
  text.value = ''
  pressed.value = true
  setTimeout(() => (pressed.value = false), 200)
}
</script>

<template>
  <div class="todo-input-section">
    <div class="input-wrapper">
      <input
        v-model="text"
        type="text"
        placeholder="输入新任务..."
        class="todo-input"
        @keyup.enter="submit"
      />
      <select v-model="priority" class="priority-select">
        <option value="medium">中优先级</option>
        <option value="high">高优先级</option>
        <option value="low">低优先级</option>
      </select>
    </div>
    <button class="add-btn" :class="{ 'add-pressed': pressed }" @click="submit">
      <span class="btn-text">添加任务</span>
      <span class="btn-emoji">✨</span>
    </button>
  </div>
</template>
