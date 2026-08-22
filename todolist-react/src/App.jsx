import { useState, useMemo, useEffect } from 'react'
import TodoInput from './components/TodoInput.jsx'
import TodoControls from './components/TodoControls.jsx'
import TodoItem from './components/TodoItem.jsx'
import TodoFooter from './components/TodoFooter.jsx'

const STORAGE_KEY = 'todos'

export default function App() {
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })
  const [currentFilter, setCurrentFilter] = useState('all')
  const [currentSort, setCurrentSort] = useState('created')
  const [showCompletion, setShowCompletion] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const filteredAndSortedTodos = useMemo(() => {
    let list = todos
    if (currentFilter === 'active') {
      list = list.filter((t) => !t.completed)
    } else if (currentFilter === 'completed') {
      list = list.filter((t) => t.completed)
    }

    const sorted = [...list]
    if (currentSort === 'created') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (currentSort === 'priority') {
      const order = { high: 0, medium: 1, low: 2 }
      sorted.sort((a, b) => order[a.priority] - order[b.priority])
    }
    return sorted
  }, [todos, currentFilter, currentSort])

  const activeCount = todos.filter((t) => !t.completed).length
  const completedCount = todos.filter((t) => t.completed).length
  const isEmpty = filteredAndSortedTodos.length === 0

  function addTodo({ text, priority }) {
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        completed: false,
        priority,
        createdAt: new Date().toISOString()
      }
    ])
  }

  function toggleComplete(id) {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return
    const completed = !todo.completed
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    )
    if (completed) triggerCompletion()
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  function clearAll() {
    if (todos.length === 0) return
    if (window.confirm('确定要清除所有任务吗？')) {
      setTodos([])
    }
  }

  function triggerCompletion() {
    setShowCompletion(true)
    setTimeout(() => setShowCompletion(false), 1000)
  }

  return (
    <>
      <div className="comic-bg-elements">
        <div className="comic-dot"></div>
        <div className="comic-dot"></div>
        <div className="comic-dot"></div>
        <div className="comic-dot"></div>
        <div className="comic-dot"></div>
      </div>

      <div className="todo-container">
        <h1 className="todo-title">
          <span className="comic-title">TodoList</span>
          <small className="comic-subtitle">任务管理应用</small>
          <div className="comic-exclaim">!</div>
        </h1>

        <TodoInput onAdd={addTodo} />

        <TodoControls
          filter={currentFilter}
          sort={currentSort}
          onFilterChange={setCurrentFilter}
          onSortChange={setCurrentSort}
        />

        <ul className="todo-list">
          {filteredAndSortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleComplete}
              onDelete={deleteTodo}
            />
          ))}
        </ul>

        <div className={`empty-state${isEmpty ? ' show' : ''}`}>
          <div className="empty-emoji">🎉</div>
          <h3>还没有任务</h3>
          <p>添加你的第一个任务吧！</p>
        </div>

        <TodoFooter
          activeCount={activeCount}
          completedCount={completedCount}
          total={todos.length}
          onClearCompleted={clearCompleted}
          onClearAll={clearAll}
        />
      </div>

      <div className={`completion-animation${showCompletion ? ' show' : ''}`}></div>
    </>
  )
}
