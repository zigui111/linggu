# 数据结构说明

最后更新：2026-11-04

本项目没有独立数据库。网站运行所需的字头详情、索引、拟音、音频和 IPA 数据均以静态文件存放在 `data/` 中，由前端通过相对路径读取。

## 一、汉字与文件名的统一规则

文件名使用汉字 UTF-8 字节序列的小写十六进制：

| 汉字 | UTF-8 字节 | 文件名 |
|---|---|---|
| 一 | E4 B8 80 | `e4b880` |
| 㐁 | E3 90 81 | `e39081` |
| 他 | E4 BB 96 | `e4bb96` |

前端对应函数：

- `getHexFromChar(char)`：生成完整 hex。
- `getDetailPrefix(hex)`：取 hex 前 3 位，用于 `data/details/`、`data/zgy/`、`data/sgy/` 分段。
- `getFolderAndFile(hex)`：取 hex 前 4 位作为细分目录，并返回完整文件名。

路径约定：

- 单字详情：`data/details/<前3位hex>.txt` 中的 CSV 行。
- 单字音频：`data/audio/<完整hex>.mp3`。
- 拟音：`data/<zgy|sgy>/<前3位hex>/<完整hex>.txt`。
- 筛选/反切索引：文件名是维度值或反切字的完整 hex。

## 二、data/ 目录总览

```text
data/
├── details/          详情主数据，28 个前 3 位 hex 分段文件
├── audio/            字头音频，1350 个 MP3
├── filter/           音韵维度 -> 字头索引
│   ├── sheng/        声母，38 个文件
│   ├── yun/          韵部，67 个文件
│   ├── deng/         等，4 个文件
│   ├── hu/           呼，2 个文件
│   ├── diao/         声调，4 个文件
│   ├── yunshe/       韵摄，16 个文件
│   └── zu/           组，11 个文件
├── fanqie/           反切字 -> 被切字索引
│   ├── shangqie/     反切上字，471 个文件
│   └── xiaqie/       反切下字，1187 个文件
├── zgy/              中古音拟音，25 个前 3 位 hex 目录
├── sgy/              上古音拟音，26 个前 3 位 hex 目录
├── ipa/              IPA 页面数据、音频映射和图标
├── ipa_base/         IPA 发音音频
├── filterindex.txt   六行筛选项清单
├── fanqieindex.txt   两行反切上下字清单
├── lastupdate.txt    主站数据版本时间戳
└── _hasaudio.txt     历史遗留文件，前端不读取
```

当前实际数量已与页面逻辑核对：

| 项目 | 数量 |
|---|---:|
| details 分段 | 28 |
| details CSV 行 | 25332 |
| 字头音频 | 1350 |
| 元音 IPA 音频 | 33 |
| 辅音 IPA 音频 | 206 |
| 中古音拟音目录 | 25 |
| 上古音拟音目录 | 26 |

## 三、details/ — 字头详情主数据

按字头 UTF-8 hex 前 3 位分段，文件包括 `e39.txt`、`e3a.txt`、`e3b.txt`、`e48.txt` … `e9b.txt`、`f0a.txt`，共 28 个，总计约 2.17 MB。

每行是一条读音/解释记录，UTF-8 CSV，共 16 列：

| 列序 | 字段 | 示例 | 说明 |
|---:|---|---|---|
| 0 | xiesheng | 20643 | 广韵条目编号 |
| 1 | xingxu | 空 | 补充编号，可为空 |
| 2 | fanqie | 他紺 | 反切，不带“切”字 |
| 3 | upper | 他 | 反切上字 |
| 4 | lower | 紺 | 反切下字 |
| 5 | char | 㐁 | 字头，详情 Map 的 key |
| 6 | definition | 無光又舌出皃又吐念切 | 释义 |
| 7 | ipa | thomh | 中古音 IPA |
| 8 | shengmu | 透 | 声母 |
| 9 | hu | 開 | 呼 |
| 10 | deng | 一 | 等 |
| 11 | yunbu | 覃 | 韵部 |
| 12 | shengdiao | 去 | 声调 |
| 13 | zu | 端 | 组 |
| 14 | she | 咸 | 韵摄 |
| 15 | hasAudio | 0 | 0 = 无音频，1 = 有音频 |

示例：

```text
20643,,他紺,他,紺,㐁,無光又舌出皃又吐念切,thomh,透,開,一,覃,去,端,咸,0
20098,317,力稔,力,稔,㐭,上同,ljɨmʔ,來,開,三,侵A,上,來,深,0
5791,253,於悉,於,悉,一,數之始也物之極也同也少也初也,ʔjɨt,影,開,三,真A,入,影,臻,1
```

同一字头可以有多行，表示多个读音或解释。`parseDetailText()` 以第 5 列字头为 key，建立 `Map<char, readings[]>`，并按读音字段组合去重。

`loadData()` 启动时读取全部 28 个详情分段：

1. `parseDetailText()` 解析读音。
2. `registerCharReadings()` 写入 `App.charReadings` 和 `App.charMap`。
3. 第 16 列为 `1` 的字加入 `App.hasAudioSet`。

这样可以同时支持详情查询、表格展示、音频按钮状态和生字本列表。

## 四、audio/ — 字头音频

- 路径：`data/audio/<完整hex>.mp3`。
- 当前 1350 个 MP3。
- 与 details 第 16 列为 `1` 的字头一一对应。
- `playAudioForChar()` 默认只有 `hasAudioSet` 中的字才请求音频。
- 不使用 `audio/char/`、`audio/zgy/`、`audio/sgy/` 等旧路径。
- 中古音、上古音拟音不单独建立音频文件。

## 五、filter/ — 音韵维度索引

共 7 个子目录，每个维度值一个文件。文件名是维度值汉字的完整 UTF-8 hex。

| 目录 | 字段 | 文件数 | 页面入口 |
|---|---|---:|---|
| `sheng/` | shengmu | 38 | 声母 |
| `yun/` | yunbu | 67 | 韵部 |
| `deng/` | deng | 4 | 等 |
| `hu/` | hu | 2 | 呼 |
| `diao/` | shengdiao | 4 | 声调 |
| `yunshe/` | she | 16 | 韵摄 |
| `zu/` | zu | 11 | 当前未在页面暴露 |

文件内容是该维度值对应的字头集合：

- 多字时按空白分隔。
- 单字内容也按字符拆分。
- `parseCharListText()` 负责解析。

示例 `filter/sheng/e4bf9f.txt`：

```text
俟涘漦竢騃𢓪𥏳𥾩
```

页面选择多个维度时，前端分别加载字头集合，再取交集并逐字校验详情字段。

## 六、fanqie/ — 反切索引

```text
fanqie/shangqie/<上字hex>.txt   以该字为反切上字的被切字
fanqie/xiaqie/<下字hex>.txt     以该字为反切下字的被切字
```

当前数量：

- `shangqie/`：471 个文件。
- `xiaqie/`：1187 个文件。

示例 `fanqie/shangqie/e39ab7.txt`：

```text
䍲掜誽
```

`loadFanqieCandidates()` 在上字、下字均选择时取两边被切字集合的交集；只选择一边时返回该边全部候选。

## 七、zgy/ 与 sgy/ — 学派拟音

- `data/zgy/`：中古音拟音。
- `data/sgy/`：上古音拟音。
- 目录名取字头 hex 前 3 位。
- 文件名取字头完整 hex。
- 每行格式：`学派,拟音`。
- `parseReconstructionText()` 按“学派 + 拟音”去重。

`data/zgy/e4b/e4b880.txt` 示例：

```text
高本漢,ʔi̯ĕt
王力,Øĭĕt
李方桂,·jiĕt
張世祿,ʔjet
```

`data/sgy/e4b/e4b880.txt` 示例：

```text
高本漢,ʔi̯ĕt
王力,0ǐet
李方桂,·jit
董同龢,ʔjet
周法高,ʔjiet
```

已知没有拟音的前缀会记录到 `App.reconPrefixMiss`，同前缀后续不再重复请求。

## 八、ipa/ 与 ipa_base/ — IPA 训练资源

### data/ipa/data.js

暴露 `window.IPA_DATA`，包含：

- `vowels.positions`、`lipShapes`、`heights`
- `vowels.body`、`vowels.entries`
- `consonants.places`、`manners`、`body`、`entries`
- `toSimplified(value)`
- `toTraditional(value)`

内部训练字段统一使用简体标准化值；表格展示通过 `toTraditional()` 转换为繁体术语。该设计避免“后 / 後”等标签差异导致状态判断不一致。

### data/ipa/audio-map.js

暴露 `window.IPA_AUDIO`：

```text
vowels:      IPA 符号 -> data/ipa_base/vowel/audio/...mp3
consonants:  IPA 符号 -> data/ipa_base/consonant/audio/...mp3
```

当前音频：

- `vowel/audio/`：33 个 MP3。
- `consonant/audio/`：206 个 MP3。

映射缺失时 `ipa.js` 不创建 `Audio`，按钮保持禁用，不产生 404 请求。

### IPA 表格

`data/ipa/IPA列表【元音+辅音】.xlsx` 是音标表弹窗底部提供的本地下载文件。页面中的表格由 `data.js` 的坐标数据生成，不直接读取 XLSX。

## 九、索引文件

### filterindex.txt

共 6 行，对应韵书浏览器的六组筛选项：

1. 声母
2. 韵部
3. 等
4. 呼
5. 声调
6. 韵摄

`parseIndexLine()` 使用 `[\u3400-\u9fff][A-Za-z]?` 提取值，允许“侵A”等带字母后缀的韵部。

### fanqieindex.txt

共 2 行：

1. 反切上字全集。
2. 反切下字全集。

`ensureFanqieIndex()` 用它生成 chips，并校验 URL 或用户选择的反切字是否有效。

### lastupdate.txt

12 位数据版本时间戳，当前值：

```text
202608152148
```

`syncCacheDate()` 使用 `cache: no-store` 读取该文件。若版本变化，会清理 `phonology_data_v1_*` 持久缓存；相同版本最多每 5 分钟重新校验一次。

## 十、浏览器本地存储

### 主站

```text
phonology_bookmarks                 生字本，JSON 字符串数组
phonology_cache_enabled_v1          主站数据缓存开关
phonology_cache_seen_v1             是否已处理缓存授权提示
phonology_data_cache_date_v1        已缓存数据对应的 lastupdate
phonology_data_cache_validated_v1   上次版本校验时间
phonology_data_v1_*                 文本和拟音缓存
```

### IPA 页面

```text
ipa-trainer-stars-v1                IPA 星标
ipa_cache_enabled_v1                IPA 缓存开关
ipa_cache_seen_v1                   IPA 设置状态标记
```

IPA 音频缓存使用 Cache Storage：

```text
ipa-audio-cache-v1
```

IPA 状态与主站生字本、主站缓存完全隔离。

## 十一、历史文件

`data/_hasaudio.txt` 是历史遗留清单，当前前端不读取，也不再依赖它生成播放按钮。音频状态以 details 第 16 列为准。

## 十二、外部上游资料

廣韻 CSV/XLS、全字表、拟音导出、Access 数据库和数据加工工具不在 `UI搭建/` 静态部署目录内。若继续维护这些源文件或工具，应单独记录版本与加工流程；网站运行只依赖当前 `data/` 目录。