const filters = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'completed', label: '已完成' }
]

export default function TodoControls({ filter, sort, onFilterChange, onSortChange }) {
  return (
    <div className="todo-controls">
      <div className="todo-filters">
        {filters.map((f) => (
          <button
            key={f.value}
            className={`filter-btn${filter === f.value ? ' active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="todo-sort">
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="created">创建时间</option>
          <option value="priority">优先级</option>
        </select>
      </div>
    </div>
  )
}
