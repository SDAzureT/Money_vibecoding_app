import { useState } from 'react'
import { CATEGORIES, todayString } from '../utils.js'

export default function RecordForm({ onAdd }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES.expense[0])
  const [date, setDate] = useState(todayString)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  // 切换收入/支出时，分类也要换成对应的列表
  function changeType(newType) {
    setType(newType)
    setCategory(CATEGORIES[newType][0])
  }

  function handleSubmit(e) {
    e.preventDefault()

    // 只允许正整数：不能有小数点、负号、空格
    if (!/^\d+$/.test(amount) || Number(amount) <= 0) {
      setError('金额必须是大于 0 的整数')
      return
    }

    onAdd({
      id: crypto.randomUUID(),
      type,
      amount: Number(amount),
      category,
      date,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    })

    // 清空金额和备注，保留类型、分类、日期，方便连续记账
    setAmount('')
    setNote('')
    setError('')
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="type-switch">
        <button
          type="button"
          className={type === 'expense' ? 'active expense' : ''}
          onClick={() => changeType('expense')}
        >
          支出
        </button>
        <button
          type="button"
          className={type === 'income' ? 'active income' : ''}
          onClick={() => changeType('income')}
        >
          收入
        </button>
      </div>

      <label>
        金额（日元）
        <input
          inputMode="numeric"
          placeholder="例如 1200"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      <label>
        分类
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES[type].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>

      <label>
        日期
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>

      <label>
        备注
        <input placeholder="可不填" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="submit">记一笔</button>
    </form>
  )
}
