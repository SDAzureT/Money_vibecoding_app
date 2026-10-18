// 生成 App 图标（PNG），不依赖任何第三方库。
// 用法：node scripts/generate-icons.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const BG = [37, 99, 235] // 蓝色背景
const FG = [255, 255, 255] // 白色 ¥ 符号

// 点 (px, py) 到线段 (ax, ay)-(bx, by) 的距离
function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

// ¥ 由 5 条线段组成，坐标是 0~1 的比例
const STROKES = [
  [0.32, 0.24, 0.5, 0.5], // 左上斜线
  [0.68, 0.24, 0.5, 0.5], // 右上斜线
  [0.5, 0.5, 0.5, 0.78], // 竖线
  [0.34, 0.54, 0.66, 0.54], // 上横线
  [0.34, 0.66, 0.66, 0.66], // 下横线
]
const STROKE_WIDTH = 0.075

function render(size) {
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0 // 每行开头的 filter 字节
    for (let x = 0; x < size; x++) {
      // 用 4x4 超采样做抗锯齿
      let hits = 0
      for (let sy = 0; sy < 4; sy++) {
        for (let sx = 0; sx < 4; sx++) {
          const u = (x + (sx + 0.5) / 4) / size
          const v = (y + (sy + 0.5) / 4) / size
          const d = Math.min(...STROKES.map((s) => distToSegment(u, v, ...s)))
          if (d < STROKE_WIDTH / 2) hits++
        }
      }
      const a = hits / 16
      const i = y * (size * 4 + 1) + 1 + x * 4
      for (let c = 0; c < 3; c++) raw[i + c] = Math.round(BG[c] * (1 - a) + FG[c] * a)
      raw[i + 3] = 255
    }
  }
  return encodePng(size, raw)
}

// ---- 最小的 PNG 编码器 ----
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePng(size, raw) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync('public/icons', { recursive: true })
for (const [name, size] of [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  writeFileSync(`public/icons/${name}`, render(size))
  console.log(`public/icons/${name}`)
}
