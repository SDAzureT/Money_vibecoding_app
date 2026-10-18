# 记账 App 规格说明（SPEC）

> 给 AI 的说明：每次开始工作前先读这份文件。只实现"当前版本"里列出的功能，不要自行添加其他功能。

## 目标

一个自己用的记账网页 App（PWA），在电脑和 iPhone 上都能用，数据保存在本机。

## 技术选型

- Vite + React（JavaScript）
- 数据存储：浏览器 localStorage（不用后端、不用数据库、不用登录）
- 后续做成 PWA，可以从 iPhone Safari "添加到主屏幕"

## 数据结构

一笔记录（Record）：

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | 唯一 ID（用 `crypto.randomUUID()` 生成） |
| type | `"expense"` \| `"income"` | 支出 / 收入 |
| amount | integer | 金额，日元，**必须是正整数，不能用小数** |
| category | string | 分类，比如 餐饮、交通、购物、房租、工资 |
| date | string | 日期，格式 `YYYY-MM-DD` |
| note | string | 备注，可以为空 |
| createdAt | string | 创建时间（ISO 格式） |

localStorage 的 key：`money-app:records`，值为 Record 数组的 JSON。

每月预算存在 localStorage 的 `money-app:budget`（正整数；不设置时没有这个 key）。

## 已完成

- [x] v0.1：添加记录、金额校验、记录列表（可删除）、本月汇总、数据持久化
- [x] v0.2：编辑记录（点击列表项）；按月份切换查看
- [x] v0.3：本月支出分类统计（堆叠横条 + 明细列表，比饼图在手机上更好读）
- [x] v0.4：导出 / 导入 JSON 备份（合并导入，ID 相同则覆盖）；导出 CSV（Excel 可打开）
- [x] v0.5：PWA（图标、manifest、离线 Service Worker）；GitHub Actions 自动部署到 GitHub Pages
- [x] v0.6：每月预算（进度条，80% 变橙色，超支变红）

## 以后再说

- 自定义分类
- 收入分类统计、年度汇总
- 多币种、云同步、登录

## 规则

- 金额一律用整数存储和计算，不用浮点数
- 每次只做一个功能，做完说明改了哪些文件
- 不引入不必要的依赖库
