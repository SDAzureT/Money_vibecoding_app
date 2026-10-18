import { formatYen } from '../utils.js'

export default function RecordList({ records, editingId, onEdit, onDelete }) {
  if (records.length === 0) {
    return <p className="empty">这个月还没有记录</p>
  }

  // 按日期从新到旧；同一天的按创建时间从新到旧
  const sorted = [...records].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  )

  function handleDelete(r) {
    if (confirm(`确定删除这笔记录吗？\n${r.date} ${r.category} ${formatYen(r.amount)}`)) {
      onDelete(r.id)
    }
  }

  return (
    <ul className="card list">
      {sorted.map((r) => (
        <li key={r.id} className={r.id === editingId ? 'selected' : ''}>
          <button className="list-main" onClick={() => onEdit(r)} title="点击编辑">
            <span className="category">{r.category}</span>
            <span className="meta">
              {r.date}
              {r.note && ` · ${r.note}`}
            </span>
          </button>
          <strong className={r.type}>
            {r.type === 'income' ? '+' : '-'}
            {formatYen(r.amount)}
          </strong>
          <button className="delete" onClick={() => handleDelete(r)} aria-label="删除">
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
