<script setup>
import { ref, computed, watch } from 'vue'
import TodoInput from './components/TodoInput.vue'
import TodoControls from './components/TodoControls.vue'
import TodoItem from './components/TodoItem.vue'
import TodoFooter from './components/TodoFooter.vue'

const STORAGE_KEY = 'todos'

const todos = ref(JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])
const currentFilter = ref('all')
const currentSort = ref('created')
const showCompletion = ref(false)

watch(
  todos,
  (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)),
  { deep: true }
)

const filteredAndSortedTodos = computed(() => {
  let list = todos.value
  if (currentFilter.value === 'active') {
    list = list.filter((t) => !t.completed)
  } else if (currentFilter.value === 'completed') {
    list = list.filter((t) => t.completed)
  }

  const sorted = [...list]
  if (currentSort.value === 'created') {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (currentSort.value === 'priority') {
    const order = { high: 0, medium: 1, low: 2 }
    sorted.sort((a, b) => order[a.priority] - order[b.priority])
  }
  return sorted
})

const activeCount = computed(() => todos.value.filter((t) => !t.completed).length)
const completedCount = computed(() => todos.value.filter((t) => t.completed).length)
const isEmpty = computed(() => filteredAndSortedTodos.value.length === 0)

function addTodo({ text, priority }) {
  todos.value.push({
    id: Date.now(),
    text,
    completed: false,
    priority,
    createdAt: new Date().toISOString()
  })
}

function toggleComplete(id) {
  const todo = todos.value.find((t) => t.id === id)
  if (!todo) return
  todo.completed = !todo.completed
  if (todo.completed) triggerCompletion()
}

function deleteTodo(id) {
  todos.value = todos.value.filter((t) => t.id !== id)
}

function clearCompleted() {
  todos.value = todos.value.filter((t) => !t.completed)
}

function clearAll() {
  if (todos.value.length === 0) return
  if (confirm('确定要清除所有任务吗？')) {
    todos.value = []
  }
}

function triggerCompletion() {
  showCompletion.value = true
  setTimeout(() => (showCompletion.value = false), 1000)
}
</script>

<template>
  <div class="comic-bg-elements">
    <div class="comic-dot"></div>
    <div class="comic-dot"></div>
    <div class="comic-dot"></div>
    <div class="comic-dot"></div>
    <div class="comic-dot"></div>
  </div>

  <div class="todo-container">
    <h1 class="todo-title">
      <span class="comic-title">TodoList</span>
      <small class="comic-subtitle">任务管理应用</small>
      <div class="comic-exclaim">!</div>
    </h1>

    <TodoInput @add="addTodo" />

    <TodoControls v-model:filter="currentFilter" v-model:sort="currentSort" />

    <ul class="todo-list">
      <TodoItem
        v-for="todo in filteredAndSortedTodos"
        :key="todo.id"
        :todo="todo"
        @toggle="toggleComplete"
        @delete="deleteTodo"
      />
    </ul>

    <div class="empty-state" :class="{ show: isEmpty }">
      <div class="empty-emoji">🎉</div>
      <h3>还没有任务</h3>
      <p>添加你的第一个任务吧！</p>
    </div>

    <TodoFooter
      :active-count="activeCount"
      :completed-count="completedCount"
      :total="todos.length"
      @clear-completed="clearCompleted"
      @clear-all="clearAll"
    />
  </div>

  <div class="completion-animation" :class="{ show: showCompletion }"></div>
</template>
