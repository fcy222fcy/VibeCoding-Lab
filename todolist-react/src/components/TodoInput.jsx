import { useState } from 'react'

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [pressed, setPressed] = useState(false)

  function submit() {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd({ text: trimmed, priority })
    setText('')
    setPressed(true)
    setTimeout(() => setPressed(false), 200)
  }

  return (
    <div className="todo-input-section">
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="输入新任务..."
          className="todo-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
        <select
          className="priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="medium">中优先级</option>
          <option value="high">高优先级</option>
          <option value="low">低优先级</option>
        </select>
      </div>
      <button
        className={`add-btn${pressed ? ' add-pressed' : ''}`}
        onClick={submit}
      >
        <span className="btn-text">添加任务</span>
        <span className="btn-emoji">✨</span>
      </button>
    </div>
  )
}
