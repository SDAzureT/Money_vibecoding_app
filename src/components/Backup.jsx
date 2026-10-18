import { useRef, useState } from 'react'
import { isValidRecord, todayString } from '../utils.js'

// 让浏览器把一段文字下载成文件
function download(filename, content, mimeType) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// CSV 里含逗号、引号、换行的字段要用引号包起来
function csvField(value) {
  const s = String(value ?? '')
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
}

export default function Backup({ records, budget, onImport }) {
  const fileInput = useRef(null)
  const [message, setMessage] = useState('')

  function exportJson() {
    download(
      `money-app-backup-${todayString()}.json`,
      JSON.stringify({ app: 'money-app', version: 1, records, budget }, null, 2),
      'application/json',
    )
    setMessage(`已导出 ${records.length} 条记录`)
  }

  function exportCsv() {
    const header = ['日期', '类型', '分类', '金额', '备注']
    const lines = [...records]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) =>
        [r.date, r.type === 'income' ? '收入' : '支出', r.category, r.amount, r.note]
          .map(csvField)
          .join(','),
      )
    // 开头的 ﻿（BOM）让 Excel 正确识别中文
    download(
      `money-app-${todayString()}.csv`,
      '﻿' + [header.join(','), ...lines].join('\n'),
      'text/csv',
    )
    setMessage(`已导出 ${records.length} 条记录（CSV）`)
  }

  async function handleFile(e) {
    const file = e.target.files[0]
    e.target.value = '' // 允许再次选择同一个文件
    if (!file) return

    try {
      const data = JSON.parse(await file.text())
      const imported = Array.isArray(data) ? data : data.records
      if (!Array.isArray(imported)) throw new Error('格式不对')

      const valid = imported.filter(isValidRecord)
      const skipped = imported.length - valid.length
      if (valid.length === 0) throw new Error('没有找到有效的记录')

      if (!confirm(`将导入 ${valid.length} 条记录。\nID 相同的记录会被备份里的版本覆盖，其他现有记录保留。继续吗？`)) {
        return
      }
      // 预算只接受正整数或 null；没有或不合法时不改动当前预算
      const b = data.budget
      const importedBudget = b === null || (Number.isInteger(b) && b > 0) ? b : undefined
      onImport(valid, importedBudget)
      setMessage(`导入了 ${valid.length} 条记录` + (skipped ? `，跳过 ${skipped} 条无效数据` : ''))
    } catch (err) {
      setMessage(`导入失败：${err.message}`)
    }
  }

  return (
    <section className="card backup">
      <h2>备份</h2>
      <p className="hint">数据只保存在这个浏览器里，清除浏览器数据就会丢失。建议定期导出备份。</p>
      <div className="backup-actions">
        <button onClick={exportJson}>导出备份（JSON）</button>
        <button onClick={() => fileInput.current.click()}>导入备份</button>
        <button onClick={exportCsv}>导出 Excel（CSV）</button>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        onChange={handleFile}
        hidden
      />
      {message && <p className="hint">{message}</p>}
    </section>
  )
}
