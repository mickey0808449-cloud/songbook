# 歌單網頁 — 給 Codex 的交辦說明

Jen 上歌唱課用的個人歌單網頁。純靜態單一檔案，部署在 GitHub Pages。

- Repo：`mickey0808449-cloud/songbook`（branch `main`）
- 網址：https://mickey0808449-cloud.github.io/songbook/
- 整個 App 就是 `index.html`（HTML + CSS + JS 寫在同一檔），沒有 build、沒有 npm。

## 開發規則（重要）

1. **維持單一檔案**：不要拆檔、不要加打包工具、不要加框架。外部函式庫只用 CDN `<script>`。
2. **不要覆蓋使用者資料**：歌曲資料存在使用者瀏覽器的 localStorage。改 `SEED` 時一定要把 `DATA_VER` +1，由 `mergeSeed()` 只補「空白欄位」與改名，不可整批覆寫。
3. **不要放入任何歌詞內容**（版權）。歌詞由 Jen 自己貼，網頁只提供搜尋連結（`searchLinks()`）。
4. 介面文字一律繁體中文。
5. 改完先用瀏覽器本機開 `index.html` 測試，再 commit / push；Pages 約 1 分鐘生效。

## 資料結構

### localStorage keys
| key | 內容 |
|---|---|
| `songbook.v1` | 歌曲陣列（JSON） |
| `songbook.v1.ver` | 目前資料版本，對應 `DATA_VER` |
| `songbook.ui` | 顯示設定（主題 / 字體 / 寬度） |

網頁有「匯出 / 匯入 JSON」做備份還原。

### 每首歌的欄位
`title, artist, lang (ja|zh|en…), genre, bpm (數字或 null), key, status, note, lyrics`

`status`：`done` 練過的歌、`practicing` 練習中、`base` 基礎（不用練）、`todo` 待練。

### SEED（預設歌單）
每列格式：`[title, artist, lang, genre, bpm, status, note, oldTitle]`
- `oldTitle`：舊名（錯字修正用），`mergeSeed()` 會把使用者資料中的舊名改成新名。
- 改 SEED → `DATA_VER` +1（目前是 4）。

### 載入流程
`load()` → 讀 localStorage → 舊格式用 `combineOld()` 轉換 → 若存的版本 < `DATA_VER` 就跑 `mergeSeed()` → `save()`。

## 歌詞格式（`parseLyrics()` / `lyricBlocks()`）

- 一個空行分隔一個「段落區塊」；兩個空行 = 段落分隔（主歌/副歌之間）。
- 區塊第一行是原文，後面每行由 `lineLang()` 自動判斷：含假名 → 日文、漢字 → 中文翻譯、拉丁字母 → 英文翻譯。
- 顯示是單欄複合式（原文 → 中文 → 英文），可用開關分別隱藏：原文 / 假名注音 / 羅馬拼音（預設關）/ 中文 / 英文。

## 日文處理（`getKuro()` / `furi()` / `roma()`）

- kuroshiro 1.2.0 + kuroshiro-analyzer-kuromoji 1.1.0（jsDelivr）。
- 字典：`DICT_URL = https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/`。
- **不要移除 `DictXHR` shim**：kuromoji 會把 `https://` 拼成 `https:/` 導致 404，shim 在初始化時暫時替換 `XMLHttpRequest` 修正網址，並在資料已被解壓時用 CompressionStream 重新 gzip。
- 假名：ruby 輸出經 `rubyToSpans()` 轉成 `.rb/.rt`；羅馬拼音用 Hepburn、有空格。

## PDF（`exportPDF()` / `pdfLibs()`）

html2canvas 1.4.1 + jsPDF 2.5.1（cdnjs）。離螢幕產生 A4 頁面（794×1123 px），以歌詞區塊為單位分頁，字體跟隨使用者設定 `var(--font)`。

## 分組 / 篩選

- 分組（`groupKey()`）：語言 / 風格 / 節奏 / 歌手 / 不分組。
- 篩選狀態：`F = {lang:Set, tempo:Set, genre:Set, artist:""}`，可複選。
- 節奏分級（`tempo()`）：慢 <90、中 90–120、快 >120、未填。

## BPM 點拍工具

編輯畫面「跟著拍子點」：取最近最多 9 次點擊平均，間隔超過 2.5 秒重新計算；×½、×2 修正半速/倍速。

## 顯示設定（`applyUI()`）

`:root` 上的 data 屬性 + CSS 變數：
- `data-theme`：跟系統 / light / dark
- `data-font`：sans（黑體）/ serif（宋體）/ kai（楷體）/ system
- `data-width`：標準 / wide / full

字型：Noto Sans/Serif TC & JP、LXGW WenKai TC、Klee One。

## 待辦

- SEED 中「太陽與地球」BPM 應改為 66（目前 132 是倍速），改完 `DATA_VER` → 5。注意 mergeSeed 只補空值，已存的 132 需使用者自己改，或另寫一次性修正。
- 其餘未填 BPM 的歌由 Jen 用點拍工具補。
