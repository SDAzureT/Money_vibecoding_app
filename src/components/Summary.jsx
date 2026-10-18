import { formatYen } from '../utils.js'

export default function Summary({ records, month }) {
  let income = 0
  let expense = 0
  for (const r of records) {
    if (r.type === 'income') income += r.amount
    else expense += r.amount
  }
  const balance = income - expense

  return (
    <section className="card summary">
      <h2>{month.replace('-', ' 年 ')} 月</h2>
      <div className="summary-row">
        <div>
          <span>收入</span>
          <strong className="income">{formatYen(income)}</strong>
        </div>
        <div>
          <span>支出</span>
          <strong className="expense">{formatYen(expense)}</strong>
        </div>
        <div>
          <span>结余</span>
          <strong className={balance < 0 ? 'expense' : ''}>
            {balance < 0 ? '-' + formatYen(-balance) : formatYen(balance)}
          </strong>
        </div>
      </div>
    </section>
  )
}
