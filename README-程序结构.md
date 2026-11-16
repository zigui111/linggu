# 程序结构说明

最后更新：2026-11-04

当前 `UI搭建/` 是一套纯静态前端项目：HTML、CSS、JavaScript 与静态数据文件部署在同一目录下，没有构建步骤、常驻后端或数据库。前端通过 `fetch` 读取 `data/` 下的文本、音频与 IPA 数据。

本文档以当前 `UI搭建/` 目录中的实际文件和运行逻辑为准。若更大的 Linggu 仓库仍保留数据加工工具链、辅助脚本和上游 CSV，它们属于本部署目录之外的外部维护资料，不属于网站上传包。

## 一、前端文件组织

```text
UI搭建/
├── index.html          入口跳转页
├── detail.html         音韵详情页
├── fanqie.html         反切搜索页
├── filter.html         韵书浏览器页
├── ipa.html            IPA 发音训练页
├── resources.html      数据来源页
├── app.js              detail / fanqie / filter 三页共享逻辑
├── ipa.js              IPA 训练、自测、星标和音标表逻辑
├── style.css           主站共享样式
├── ipa.css             IPA 训练页独立样式
├── resources.css       数据来源页独立样式
├── imgs/
│   └── github.png
├── data/               静态数据、音频与 IPA 资源
└── README-*.md         项目文档
```

`detail.html`、`fanqie.html`、`filter.html` 共用 `app.js` 和 `style.css`，按页面中存在的 DOM（例如 `#chips-initial`、`#chips-shangqie`）决定加载哪些数据并启用哪些功能。三个页面均使用版本化脚本地址：

```html
<script src="./app.js?v=20261101-2"></script>
```

发布 `app.js` 时应同步更新该版本参数，避免浏览器继续使用旧脚本缓存。

`ipa.html` 不加载 `app.js`，而是按以下顺序加载独立资源：

```text
data/ipa/assets/lucide.min.js
data/ipa/audio-map.js
data/ipa/data.js
ipa.js
```

## 二、app.js 模块划分

### 1. 全局状态 `App`

集中保存运行时状态，包括：

- `charMap`：字头 -> 首个读音详情
- `charReadings`：字头 -> 全部读音/解释
- `fanqieMap`、`ipaMap`
- `hasAudioSet`：第 16 列为 `1` 的有音频字集合
- `detailPrefixCache`、`reconCache`、`reconPrefixMiss`
- `filterIndex`、`filterData`、`filters`
- `bookmarks`
- 筛选与反切搜索的分页、批次和任务游标
- `cacheEnabled`、`lastUpdate`

### 2. 工具与详情解析

- `getHexFromChar` / `getFolderAndFile` / `getDetailPrefix`：汉字转 UTF-8 hex，并生成数据路径
- `escapeHtml` / `charHasAudio`
- `buildDetailFromLine` / `readingKey` / `parseDetailText`：解析 16 列详情 CSV，建立 `Map<char, readings[]>`；同时从第 16 列收集有音频字
- `registerCharReadings` / `getCharReadings` / `getCharDetail`：注册、读取和按需补载单字详情

### 3. 缓存层

- `fetchText`：统一文本读取入口，支持内存缓存和可选 localStorage 缓存
- `clearPersistentDataCache` / `clearDataCaches`
- `syncCacheDate`：读取 `data/lastupdate.txt`，版本变化时清理 `phonology_data_v1_*` 数据缓存；同一版本最多每 5 分钟重新校验一次
- `initCacheControl` / `initSettings`：缓存授权弹层和设置面板

主站 localStorage 键：

```text
phonology_bookmarks                 生字本，字符串数组
phonology_cache_enabled_v1          主站数据缓存开关
phonology_cache_seen_v1             是否已处理缓存授权提示
phonology_data_cache_date_v1        已缓存数据对应的 lastupdate 值
phonology_data_cache_validated_v1   上次校验时间
phonology_data_v1_*                 文本和拟音数据缓存
```

### 4. 启动数据加载

`loadData()` 的当前流程：

1. `syncCacheDate()` 校验数据版本。
2. 韵书浏览器页读取 `data/filterindex.txt`。
3. 反切搜索页读取 `data/fanqieindex.txt`。
4. 并行读取全部 28 个 `data/details/*.txt` 分段。
5. 解析后注册 `charReadings` / `charMap`，并构建 `hasAudioSet`。
6. `loadBookmarks()` 恢复生字本并更新右上角数量。

这样，音韵详情、反切搜索和韵书浏览器在刷新或换页后都能直接取得收藏字详情。

### 5. 生字本

- `initBookmarks`：打开/关闭侧栏和搜索事件
- `loadBookmarks` / `saveBookmarks` / `isBookmarked` / `toggleBookmark`
- `updateBookmarkCount`
- `renderBookmarkList`：异步渲染收藏字；优先读取 `charMap`，缺失时调用 `getCharDetail` 补载

生字本不再依赖“该字恰好已经在当前页面展示过”。即使刷新后直接打开生字本，也会显示已保存的条目；详情暂时不可用时仍保留条目和删除按钮。

### 6. 音韵详情与拟音

- `parseReconstructionText` / `loadReconstructionEntries`
- `buildSchoolIpaList` / `buildReconSectionHtml`
- `buildReadingOverviewHeadingHtml` / `buildReadingHtml`
- `renderDetail` / `bindDetailEvents`

`renderDetail()` 先加载 `mc`（中古音，对应 `data/zgy/`）与 `oc`（上古音，对应 `data/sgy/`），再补载反切上字、下字的 IPA，最后生成详情卡和拟音总览。

### 7. 音频播放

- `playAudioForChar(char, btnElement, explicitPath)`：默认播放 `data/audio/<hex>.mp3`
- `startBatchPlay` / `playBatchNext` / `stopBatchPlay`

未传入显式路径时，只有 `hasAudioSet` 中的字才发起音频请求；批量播放自动跳过无音频行。

### 8. 韵书浏览器

- `renderFilterChips` / `filterGroupByQuery` / `applyFilterSearch`
- `buildRawResults`：多个筛选维度的字头集合取交集
- `takeNextRawChar` / `fillFilterRows` / `renderNewFilterRows`
- `appendFilterSentinel` / `loadMoreFilterRows` / `finishFilterRows`
- `initBrowserActions` / `exportCSV` / `copyTable`

筛选结果分批加载，多音字行可展开，表格触底后继续加载。

### 9. 反切搜索

- `ensureFanqieIndex` / `loadFanqieCharList` / `loadFanqieCandidates`
- `startFanqieSearch` / `applyFanqieUrlQuery`
- `fillFanqieRows` / `renderNewFanqieRows`
- `appendFanqieSentinel` / `loadMoreFanqieRows` / `finishFanqieRows`

上字、下字均选择时对两组被切字取交集；只选择一边时使用该边的全部结果。

### 10. 导航与详情入口

- `initNavigation` / `switchView`
- `initSearch` / `doSearch`
- `openCharDetail`

目标视图不存在时，`switchView` 会跳转到对应 HTML 页面。

## 三、ipa.js 模块划分

- `data` / `audioManifest`：读取 `window.IPA_DATA` 与 `window.IPA_AUDIO`
- `fieldConfig` / `configureMode`：元音、辅音两套题型字段
- `startQuestion` / `handleOptionClick` / `resolveAnswer`：随机抽题和判题
- `startSelfTest` / `goToNextTestQuestion` / `exitSelfTest`：10 题自测
- `loadStars` / `toggleCurrentStar` / `renderStarredContent` / `practiceStar`：独立星标集
- `renderVowelTable` / `renderConsonantTable` / `openTableDialog`：音标表
- `getAudioPath` / `playTableAudio`：通过音频映射查找并播放 MP3
- `initIpaCacheControl` / `initIpaSettings`：IPA 缓存设置

`data/ipa/data.js` 暴露 `toSimplified` 与 `toTraditional`。训练题内部统一使用简体标签，音标表展示时转换回繁体标签，避免“后 / 後”等名称不一致导致选项被锁定。

IPA localStorage 与 Cache Storage：

```text
ipa-trainer-stars-v1   IPA 星标
ipa_cache_enabled_v1   IPA 缓存开关
ipa_cache_seen_v1      IPA 缓存设置状态标记
ipa-audio-cache-v1     IPA 音频 Cache Storage
```

## 四、关键运行流程

### 主站启动

```text
DOMContentLoaded
├─ initCacheControl()
├─ initSettings()
├─ await loadData()
│  ├─ syncCacheDate()
│  ├─ 按页面加载 filterindex.txt / fanqieindex.txt
│  ├─ 并行加载 28 个 details 分段
│  ├─ registerCharReadings() -> charMap / charReadings
│  ├─ parseDetailText() -> hasAudioSet
│  └─ loadBookmarks()
├─ initNavigation() / initSearch() / initBookmarks()
├─ initBrowserActions() / initFilterSearch() / initFilterGroupToggles()
└─ applyFanqieUrlQuery()
```

### 生字本打开

```text
点击“生字本”
├─ 切换 #bookmark-panel
├─ renderBookmarkList()
│  ├─ 按字或 UTF-8 hex 过滤
│  ├─ 优先读取 App.charMap
│  ├─ 缺失详情时 getCharDetail() 补载
│  └─ 绑定详情跳转和删除事件
└─ updateBookmarkCount()
```

### IPA 训练启动

```text
ipa.html DOMContentLoaded
└─ ipa.js init()
   ├─ lucide.createIcons()
   ├─ loadStars()
   ├─ initIpaCacheControl() / initIpaSettings()
   ├─ configureMode()
   ├─ bindEvents()
   └─ startQuestion()
```

## 五、性能与请求控制

- 启动时一次性解析 28 个详情分段，确保音频集合、字详情映射和生字本可用。
- 筛选和反切结果仍按批次渲染，避免一次生成全部表格行。
- 无音频字不请求 MP3；IPA 音频映射缺失时不创建 `Audio`。
- 主站数据缓存可由用户关闭，关闭时清理 `phonology_data_v1_*`。
- IPA 音频缓存关闭时清理 `ipa-audio-cache-v1`。
- 无拟音数据的前缀写入 `reconPrefixMiss`，减少重复请求。
- IntersectionObserver 配合滚动兜底实现触底加载。

## 六、外部数据加工工具链

以下内容不属于 `UI搭建/` 网站上传包；如在外部 Linggu 工程中继续维护，应单独核对：

- C#/.NET 数据切分、合并工具
- `GetHex.py`、`lookup.js`、`curl.sh` 等辅助脚本
- 廣韻 CSV/XLS、拟音导出文件、Access 数据库等上游源文件

这些工具的路径、输入格式和输出版本不在当前静态目录中，不应作为现网前端运行依赖。

## 七、部署与运行

- 将 `UI搭建/` 整体部署到静态服务器，确保 `data/`、`imgs/` 与 HTML 同级可访问。
- 不建议直接用 `file://` 打开；浏览器通常会限制 `fetch` 读取本地数据。
- 无数据库、无后端服务；数据更新时替换 `data/` 并更新 `data/lastupdate.txt`。
- 更新 `app.js` 时同步更新 `detail.html`、`fanqie.html`、`filter.html` 中的 `app.js?v=...`。
- 生字本、缓存设置与 IPA 星标保存在浏览器 localStorage，不上传服务端。