// localStorage 里保存记录用的 key
const STORAGE_KEY = 'money-app:records'

const BUDGET_KEY = 'money-app:budget'

export const CATEGORIES = {
  expense: ['餐饮', '交通', '购物', '日用', '娱乐', '房租', '其他'],
  income: ['工资', '打工', '奖学金', '其他'],
}

// 读取所有记录。数据损坏时返回空数组，不让页面崩溃
export function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

// 每月预算（日元整数）；没设置时为 null
export function loadBudget() {
  try {
    const value = JSON.parse(localStorage.getItem(BUDGET_KEY))
    return Number.isInteger(value) && value > 0 ? value : null
  } catch {
    return null
  }
}

export function saveBudget(budget) {
  if (budget === null) localStorage.removeItem(BUDGET_KEY)
  else localStorage.setItem(BUDGET_KEY, JSON.stringify(budget))
}

// 返回本地日期 YYYY-MM-DD。
// 注意：不能用 toISOString()，它是 UTC 时间，日本早上 9 点前会变成前一天
export function todayString() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// "2026-10" 加减月份：shiftMonth("2026-01", -1) -> "2025-12"
export function shiftMonth(month, delta) {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// "2026-10" -> "2026 年 10 月"
export function formatMonth(month) {
  const [y, m] = month.split('-')
  return `${y} 年 ${Number(m)} 月`
}

// 检查导入的数据是不是合法的记录，防止坏数据弄坏 App
export function isValidRecord(r) {
  return (
    r &&
    typeof r.id === 'string' &&
    (r.type === 'expense' || r.type === 'income') &&
    Number.isInteger(r.amount) &&
    r.amount > 0 &&
    typeof r.category === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
    typeof r.createdAt === 'string' &&
    (r.note === undefined || typeof r.note === 'string')
  )
}

// 12345 -> "¥12,345"
export function formatYen(amount) {
  return '¥' + amount.toLocaleString('ja-JP')
}
