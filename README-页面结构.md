# 页面结构说明

最后更新：2026-11-04

本项目为纯静态前端，无框架、无构建步骤。部署到静态服务器后，浏览器加载 HTML、CSS、JavaScript 和 `data/` 下的静态资源即可运行；不建议直接通过 `file://` 打开，因为浏览器可能阻止本地 `fetch`。

## 文件总览

```text
UI搭建/
├── index.html      入口跳转页
├── detail.html     音韵详情页（默认首页）
├── fanqie.html     反切搜索页
├── filter.html     韵书浏览器页
├── ipa.html        IPA 发音训练页
├── resources.html  数据来源页
├── app.js          detail / fanqie / filter 共享逻辑
├── ipa.js          IPA 训练逻辑
├── style.css       主站共享样式
├── ipa.css         IPA 页面独立样式
├── resources.css   数据来源页独立样式
├── imgs/           页面静态图片
└── data/           详情、索引、音频和 IPA 数据
```

`detail.html`、`fanqie.html`、`filter.html` 共用 `app.js` 和 `style.css`。三个页面的共享脚本均使用版本参数：

```html
<script src="./app.js?v=20261101-2"></script>
```

更新脚本时应同步修改版本参数，避免旧缓存造成不同页面行为不一致。

`ipa.html` 使用独立的 `ipa.css`、`ipa.js` 和 `data/ipa/` 资源，不加载 `app.js`。`resources.html` 使用 `style.css` 与 `resources.css`，也不加载 `app.js`。

## index.html

最小跳转页：`window.onload` 后跳转到 `./detail.html`。

## 三个主站页面的公共区块

`detail.html` / `fanqie.html` / `filter.html` 包含：

| 区块 | 关键元素 | 说明 |
|---|---|---|
| 顶部导航 | `.app-header`、`.nav-tab[data-view]` | 音韵详情 / 反切搜索 / 韵书浏览器 / IPA发音训练 |
| 加载遮罩 | `#loading-overlay` | 启动加载数据时显示 |
| 缓存授权弹层 | `#cache-prompt` | 首次访问询问是否启用主站 localStorage 数据缓存 |
| 生字本侧栏 | `#bookmark-panel`、`#bookmark-list` | 保存并展示收藏字，可按字或 UTF-8 hex 搜索 |
| 设置侧栏 | `#settings-panel`、`#cache-toggle` | 主站数据缓存开关 |
| 数据来源入口 | `a[href="./resources.html"]` | 打开集中数据来源页 |
| 页脚 | `.app-footer` | 版权、数据来源、GitHub 与备案信息 |

生字本数量由 `#bookmark-count` 显示。打开侧栏时 `renderBookmarkList()` 会读取已保存字；如果某字详情尚未进入内存，则自动补载，因此刷新页面后列表不会为空。

## detail.html — 音韵详情页

- 视图容器：`#view-detail`
- 检索区：`#search-input` + `#btn-search`
- 支持 URL 参数：`detail.html?q=字`
- 空态：`#detail-empty`
- 动态详情容器：`#detail-content`

`renderDetail()` 生成：

- 字头、反切、释义
- 一字多音时的折叠读音块
- 《廣韻》信息總覽
- 声/韵/等/呼/调/摄标签；点击后跳转韵书浏览器并带入对应筛选
- 反切拼读卡：上字 + 下字 = 被切字，各带 IPA 与独立音频按钮
- 盲猜模式开关
- 中古音 `zgy` / 上古音 `sgy` 拟音总览
- 收藏按钮 `#btn-bookmark`

## fanqie.html — 反切搜索页

- 视图容器：`#view-fanqie`
- 反切上字：`#filter-shangqie` / `#chips-shangqie`
- 反切下字：`#filter-xiaqie` / `#chips-xiaqie`
- 两个选择区各有组内搜索；应用与重置按钮为 `#btn-filter-apply` / `#btn-filter-reset`
- 结果区：`#result-count`、`#data-table`、`#table-body`

URL 参数：

```text
?shang=他,托&xia=紺
?q=他紺       旧格式兼容，只接受单个两字反切
```

搜索时，上字与下字均有选择则对被切字集合取交集；只选择一边时使用该边全部结果。结果分批加载并支持触底继续加载。

## filter.html — 韵书浏览器页

- 视图容器：`#view-browser`
- 组内搜索：`#filter-search`
- 六个筛选组：

| 组 | 芯片容器 | 对应字段 |
|---|---|---|
| 声母 | `#chips-initial` | shengmu |
| 韵部 | `#chips-final` | yunbu |
| 等 | `#chips-deng` | deng |
| 呼 | `#chips-hu` | hu |
| 声调 | `#chips-tone` | shengdiao |
| 韵摄 | `#chips-she` | she |

- 结果区：`#result-count`、`#data-table`、`#table-body`
- 批量操作：`#btn-batch-play`、`#btn-export-csv`、`#btn-copy-table`
- 多音字行可展开
- 触底后增量加载

## ipa.html — IPA 发音训练页

- 第一排包含品牌、全局导航和元音/辅音模式切换：`.topbar`、`.topbar-center`、`.top-actions`、`.mode-switch`
- “开始自测”和“换一题”位于训练标题区右侧
- `#workspace` 是当前题目区
- `#self-test-toggle` 进入 10 题自测
- `#open-tables` 打开音标表
- `#open-starred` 打开独立星标集
- 顶部右侧提供数据来源和设置；设置中可切换 IPA 缓存

元音题：

1. 01 选择发音位置。
2. 选择“前”或“后”后，02 圆展唇与 03 音调高低均可选择，不限制先后顺序。
3. 选择“央”时不区分圆展唇，直接选择音调高低。

辅音题按发音部位、发音方法选择。

音标表弹窗：

- 元音表和辅音表可切换
- 标签展示使用繁体音韵术语；数据内部使用简体标准化字段
- 无发音条目显示 `volume-x`
- 可播放表内 IPA 音频
- 底部提供 `IPA列表【元音+辅音】.xlsx` 下载

## resources.html — 数据来源页

- 使用 `style.css` 和 `resources.css`
- `#resources-content` 内包含四个来源卡片：音韵数据、IPA 音标与音频、参考资料、使用声明
- 顶部提供四个项目入口和“返回工具”
- 页脚保持与主站一致

## URL 参数汇总

| 页面 | 参数 | 示例 |
|---|---|---|
| detail.html | `q` | `?q=㐁` |
| fanqie.html | `shang`、`xia` | `?shang=他&xia=紺` |
| fanqie.html | `q`（兼容） | `?q=他紺` |

## 跨页交互

- 详情页音韵标签跳转 `filter.html` 并自动带入筛选。
- 反切上下字、结果表格行和生字本条目可打开对应字详情。
- `detail.html`、`fanqie.html`、`filter.html` 共用 `phonology_bookmarks` 生字本和主站缓存设置。
- IPA 星标使用独立的 `ipa-trainer-stars-v1`，不修改主站生字本。
- 主站脚本版本参数与实际 `app.js` 应保持一致。