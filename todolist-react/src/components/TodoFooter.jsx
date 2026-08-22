export default function TodoFooter({
  activeCount,
  completedCount,
  total,
  onClearCompleted,
  onClearAll
}) {
  return (
    <div className="todo-footer">
      <span className="todo-count">{activeCount} 个任务</span>
      <div className="footer-actions">
        <button
          className="clear-btn"
          disabled={completedCount === 0}
          onClick={onClearCompleted}
        >
          <span className="btn-text">清除已完成</span>
          <span className="btn-emoji">🗑️</span>
        </button>
        <button
          className="clear-btn secondary"
          disabled={total === 0}
          onClick={onClearAll}
        >
          <span className="btn-text">清除全部</span>
        </button>
      </div>
    </div>
  )
}
