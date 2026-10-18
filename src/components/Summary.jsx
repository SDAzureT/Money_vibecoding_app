import { formatMonth, formatYen, shiftMonth, todayString } from '../utils.js'

export default function Summary({ records, month, onChangeMonth }) {
  let income = 0
  let expense = 0
  for (const r of records) {
    if (r.type === 'income') income += r.amount
    else expense += r.amount
  }
  const balance = income - expense
  const thisMonth = todayString().slice(0, 7)

  return (
    <section className="card summary">
      <div className="month-nav">
        <button onClick={() => onChangeMonth(shiftMonth(month, -1))} aria-label="上个月">
          ‹
        </button>
        <h2>{formatMonth(month)}</h2>
        <button onClick={() => onChangeMonth(shiftMonth(month, 1))} aria-label="下个月">
          ›
        </button>
        {month !== thisMonth && (
          <button className="today" onClick={() => onChangeMonth(thisMonth)}>
            回到本月
          </button>
        )}
      </div>
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
