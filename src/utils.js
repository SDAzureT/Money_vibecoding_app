// localStorage 里保存记录用的 key
const STORAGE_KEY = 'money-app:records'

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

// 返回本地日期 YYYY-MM-DD。
// 注意：不能用 toISOString()，它是 UTC 时间，日本早上 9 点前会变成前一天
export function todayString() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 12345 -> "¥12,345"
export function formatYen(amount) {
  return '¥' + amount.toLocaleString('ja-JP')
}
