import { useEffect, useState } from 'react'
import RecordForm from './components/RecordForm.jsx'
import Summary from './components/Summary.jsx'
import RecordList from './components/RecordList.jsx'
import { loadRecords, saveRecords, todayString } from './utils.js'

export default function App() {
  // 启动时从 localStorage 读取一次
  const [records, setRecords] = useState(loadRecords)

  // records 每次变化都自动保存
  useEffect(() => {
    saveRecords(records)
  }, [records])

  function addRecord(record) {
    setRecords([record, ...records])
  }

  function deleteRecord(id) {
    setRecords(records.filter((r) => r.id !== id))
  }

  // "2026-10" 这样的前缀，用来筛选本月记录
  const thisMonth = todayString().slice(0, 7)
  const monthRecords = records.filter((r) => r.date.startsWith(thisMonth))

  return (
    <main className="app">
      <h1>记账本</h1>
      <Summary records={monthRecords} month={thisMonth} />
      <RecordForm onAdd={addRecord} />
      <RecordList records={records} onDelete={deleteRecord} />
    </main>
  )
}
