const priorityText = { high: '高', medium: '中', low: '低' }

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <div className={`priority-badge priority-${todo.priority}`}>
        {priorityText[todo.priority]}
      </div>
      <input
        type="checkbox"
        className="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className="todo-text">{todo.text}</span>
      <button className="delete-btn" onClick={() => onDelete(todo.id)}>
        &times;
      </button>
    </li>
  )
}
