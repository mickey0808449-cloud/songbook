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

`status`：`done` 已練、`practicing` 練習中、`base` 基礎、`todo` 待練。

首頁以頂部橫向按鈕切換上述四個分區，預設顯示「已練」，一次只顯示一個分區。「匯出目前清單 PDF」只匯出目前分區中符合搜尋與篩選的歌曲。

### SEED（預設歌單）
每列格式：`[title, artist, lang, genre, bpm, status, note, oldTitle]`
- `oldTitle`：舊名（錯字修正用），`mergeSeed()` 會把使用者資料中的舊名改成新名。
- 改 SEED → `DATA_VER` +1（目前是 5）。

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

- 已將 SEED「太陽與地球」BPM 改為 66、`DATA_VER` 改為 5；已有的 65、132 等數值保留。
- 未確認的 BPM、Key 清單與逐曲原因見 `research/核對說明.md`。BPM 必須核對版本與半速／倍速，原有值有疑點只提示，不逕行覆寫。

## 查核資料與安全補齊

- `research/bpm-key-audit.json`：65 首逐曲來源、候選值與核准補充值；不含歌詞。
- `research/songs-reviewed.json`：以 Jen 提供的 2026-11-17 匯出檔為基準的完整補充檔；整份匯入會取代目前歌單，優先使用網站「補齊歌曲資料」。
- 網站 `RESEARCH` 內嵌參考資料，維持 `index.html` 單檔可用。執行 `node research/update-metadata.cjs` 重建查核文件、補充 JSON 與內嵌資料。
- 「補齊歌曲資料」先列預覽，再由使用者按「補齊空白資料」套用。以歌名＋歌手配對，只補已核准的空白 BPM／Key；同名同歌手有重複時跳過，不新增或刪除歌曲。
- 寫入前以 `songbook.v1.metadata-backup` 留存更新前完整歌單，可下載 JSON；儲存失敗不得改動記憶體歌單。不要自動套用參考值覆蓋既有資料。
- 每首歌可展開「資料核對」查看來源與分歧；參考 Key 不代表 Jen 個人適合的演唱調。
- 驗證：`node tests/metadata.cjs`；瀏覽器測試檔可用 `node tests/browser-fixture.cjs <輸出HTML路徑>` 產生，請使用隔離測試設定檔，勿操作真實瀏覽器資料。
