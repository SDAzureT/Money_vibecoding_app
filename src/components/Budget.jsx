import { useState } from 'react'
import { formatYen } from '../utils.js'

// 每月预算：显示已用 / 剩余，以及进度条。budget 为 null 时只显示"设置预算"按钮
export default function Budget({ budget, spent, onChange }) {
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  function startEdit() {
    setInput(budget ? String(budget) : '')
    setError('')
    setEditing(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (input.trim() === '') {
      onChange(null) // 清空 = 取消预算
      setEditing(false)
      return
    }
    if (!/^\d+$/.test(input) || Number(input) <= 0) {
      setError('预算必须是大于 0 的整数')
      return
    }
    onChange(Number(input))
    setEditing(false)
  }

  if (editing) {
    return (
      <form className="budget-form" onSubmit={handleSubmit}>
        <input
          inputMode="numeric"
          placeholder="每月预算（留空 = 不设置）"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" className="submit">保存</button>
        <button type="button" className="cancel" onClick={() => setEditing(false)}>
          取消
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    )
  }

  if (!budget) {
    return (
      <button className="budget-set" onClick={startEdit}>
        + 设置每月预算
      </button>
    )
  }

  const remaining = budget - spent
  const ratio = Math.min(spent / budget, 1)
  const level = spent > budget ? 'over' : ratio >= 0.8 ? 'warn' : 'ok'

  return (
    <div className="budget">
      <div className="budget-head">
        <span>
          预算 {formatYen(budget)}
          <button className="budget-edit" onClick={startEdit}>修改</button>
        </span>
        <span className={`budget-status ${level}`}>
          {level === 'over' ? `⚠ 超支 ${formatYen(-remaining)}` : `剩余 ${formatYen(remaining)}`}
        </span>
      </div>
      <div
        className="meter"
        role="meter"
        aria-label="预算使用率"
        aria-valuemin={0}
        aria-valuemax={budget}
        aria-valuenow={spent}
      >
        <div className={`meter-fill ${level}`} style={{ width: `${ratio * 100}%` }} />
      </div>
      <p className="budget-note">已用 {Math.round((spent / budget) * 100)}%</p>
    </div>
  )
}
