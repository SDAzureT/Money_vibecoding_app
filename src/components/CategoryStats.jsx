import { CATEGORIES, formatYen } from '../utils.js'

// 每个分类固定一个颜色（按 CATEGORIES 里的顺序），切换月份时颜色不会变
function colorOf(category) {
  const i = CATEGORIES.expense.indexOf(category)
  return `var(--series-${i === -1 ? 8 : i + 1})`
}

// 本月支出按分类汇总：一条堆叠横条 + 下面的明细列表
export default function CategoryStats({ records }) {
  const totals = {}
  for (const r of records) {
    if (r.type !== 'expense') continue
    totals[r.category] = (totals[r.category] ?? 0) + r.amount
  }
  const rows = Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
  const total = rows.reduce((sum, r) => sum + r.amount, 0)

  if (total === 0) return null

  // 百分比四舍五入到整数，显示用
  const percent = (amount) => Math.round((amount / total) * 100)

  return (
    <section className="card stats">
      <h2>支出分类</h2>
      <div className="stack-bar" role="img" aria-label="支出分类占比">
        {rows.map((r) => (
          <div
            key={r.category}
            className="stack-seg"
            style={{ flexGrow: r.amount, background: colorOf(r.category) }}
            title={`${r.category} ${formatYen(r.amount)}（${percent(r.amount)}%）`}
          />
        ))}
      </div>
      <ul className="stats-list">
        {rows.map((r) => (
          <li key={r.category}>
            <span className="swatch" style={{ background: colorOf(r.category) }} />
            <span className="stats-name">{r.category}</span>
            <span className="stats-percent">{percent(r.amount)}%</span>
            <span className="stats-amount">{formatYen(r.amount)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
