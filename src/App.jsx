import { useEffect, useState } from 'react'
import RecordForm from './components/RecordForm.jsx'
import Summary from './components/Summary.jsx'
import RecordList from './components/RecordList.jsx'
import CategoryStats from './components/CategoryStats.jsx'
import Backup from './components/Backup.jsx'
import { loadBudget, loadRecords, saveBudget, saveRecords, todayString } from './utils.js'

export default function App() {
  // 启动时从 localStorage 读取一次
  const [records, setRecords] = useState(loadRecords)
  // 当前查看的月份，"2026-10" 格式
  const [month, setMonth] = useState(() => todayString().slice(0, 7))
  // 正在编辑的记录；null 表示在新建
  const [editing, setEditing] = useState(null)
  // 每月预算，null 表示没设置
  const [budget, setBudget] = useState(loadBudget)

  // records / budget 每次变化都自动保存
  useEffect(() => {
    saveRecords(records)
  }, [records])

  useEffect(() => {
    saveBudget(budget)
  }, [budget])

  function saveRecord(record) {
    if (records.some((r) => r.id === record.id)) {
      setRecords(records.map((r) => (r.id === record.id ? record : r)))
    } else {
      setRecords([record, ...records])
    }
    setEditing(null)
  }

  function deleteRecord(id) {
    setRecords(records.filter((r) => r.id !== id))
    if (editing?.id === id) setEditing(null)
  }

  // 合并导入的记录：ID 相同的用备份里的版本覆盖
  // 备份里有预算时一起恢复
  function importRecords(imported, importedBudget) {
    const byId = new Map(records.map((r) => [r.id, r]))
    for (const r of imported) byId.set(r.id, { ...r, note: r.note ?? '' })
    setRecords([...byId.values()])
    setEditing(null)
    if (importedBudget !== undefined) setBudget(importedBudget)
  }

  function startEdit(record) {
    setEditing(record)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const monthRecords = records.filter((r) => r.date.startsWith(month))

  return (
    <main className="app">
      <h1>记账本</h1>
      <Summary
        records={monthRecords}
        month={month}
        onChangeMonth={setMonth}
        budget={budget}
        onChangeBudget={setBudget}
      />
      {/* key 变化时表单会重新创建，从而填入要编辑的记录 */}
      <RecordForm
        key={editing?.id ?? 'new'}
        initial={editing}
        onSave={saveRecord}
        onCancel={() => setEditing(null)}
      />
      <CategoryStats records={monthRecords} />
      <RecordList
        records={monthRecords}
        editingId={editing?.id}
        onEdit={startEdit}
        onDelete={deleteRecord}
      />
      <Backup records={records} budget={budget} onImport={importRecords} />
    </main>
  )
}
