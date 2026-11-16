# IPA 发音训练页

最后更新：2026-11-04

`ipa.html` 是主项目中的独立训练页，复用 IPA 元音/辅音练习的训练、自测、星标和音标表功能，同时使用独立的样式、脚本和数据目录。

## 页面入口

- `detail.html`、`fanqie.html`、`filter.html` 的顶部导航包含“IPA发音训练”。
- `app.js` 的 `switchView('ipa')` 跳转到 `ipa.html`。
- `ipa.html` 顶部包含“音位 / PHONETIC LAB”品牌区、四个项目页签、数据来源、设置以及元音/辅音模式切换。
- “开始自测”和“换一题”位于训练标题区右侧。
- 页脚与主站保持一致。
- `resources.html` 提供音韵数据、IPA 音标与音频、参考资料和使用声明等内容区。

## 文件

```text
ipa.html
ipa.css
ipa.js
resources.html
resources.css
data/ipa/
  data.js
  audio-map.js
  assets/lucide.min.js
  IPA列表【元音+辅音】.xlsx
data/ipa_base/
  vowel/audio/*.mp3
  consonant/audio/*.mp3
```

脚本加载顺序：

```text
data/ipa/assets/lucide.min.js
data/ipa/audio-map.js
data/ipa/data.js
ipa.js
```

IPA 页面同时加载主站 `style.css` 和独立 `ipa.css`。HTML 中保留本地/CDN 切换注释；当前默认全部使用本地资源。

## 数据模型

- `window.IPA_AUDIO` 来自 `data/ipa/audio-map.js`，映射 IPA 符号到 `data/ipa_base/` 下的 MP3。
- `window.IPA_DATA` 来自 `data/ipa/data.js`，包含：
  - 元音位置、圆展唇、音高和坐标表
  - 辅音发音部位、发音方法和坐标表
  - `toSimplified(value)`
  - `toTraditional(value)`

训练状态内部统一使用简体标准化标签，音标表标题、行名和无障碍标签通过 `toTraditional` 显示繁体术语。该转换同时避免“后 / 後”不一致导致元音选项被误锁定。

音频目录当前包含：

- 33 个元音 MP3
- 206 个辅音 MP3

找不到映射时不创建 `Audio`，按钮显示禁用态，不发起无效请求。

## 训练交互

### 元音

- 01：发音位置（前 / 央 / 后）。
- 选择“前”或“后”后，02 圆展唇和 03 音调高低均可用，不限制先后顺序。
- 选择“央”时不区分圆展唇；02 显示为中性状态，只判断位置和音调高低。
- 修改发音位置时会清空后续已选值。
- 全部必填坐标完成后自动判题并显示反馈。

### 辅音

- 01：发音部位。
- 02：发音方法；选择发音部位后可选。
- 全部坐标完成后自动判题。

### 自测

- 默认 10 题。
- 答题过程中不显示正确答案。
- 全部完成后统一显示正确率，并可逐题查看记录或重新测试。

## 星标集

- 当前题和结果页均可加入星标。
- 星标按元音/辅音分类筛选。
- 支持移除星标和单音复习。
- 星标按模式与工作表单元格坐标保存，能重新定位到对应 IPA 条目。

## 音标表

- “查看音标表”打开居中弹窗。
- 支持元音表、辅音表切换。
- 有音频的 IPA 可直接播放；无音频条目显示 `volume-x`。
- 弹窗底部可下载 `data/ipa/IPA列表【元音+辅音】.xlsx`。
- 表格展示使用繁体音韵标签，数据字段使用简体标准化值。

## 状态隔离与缓存

IPA 星标：

```text
ipa-trainer-stars-v1
```

IPA 缓存设置：

```text
ipa_cache_enabled_v1   缓存开关，1 = 开启，0 = 关闭
ipa_cache_seen_v1      缓存设置状态标记
```

IPA 音频缓存：

```text
Cache Storage: ipa-audio-cache-v1
```

关闭 IPA 缓存时会尝试删除该 Cache Storage。IPA 页面不会读取或修改主站的 `phonology_bookmarks`、主站缓存开关或 `phonology_data_v1_*` 缓存。

## 部署注意

- `data/ipa/`、`data/ipa_base/` 必须与 `ipa.html` 的相对路径保持一致。
- 更新 `data.js`、`audio-map.js` 或 `ipa.js` 后，应清理浏览器缓存或为资源增加版本参数。
- 音标表与训练题共用同一份 `data/ipa/data.js`，修改坐标或标签时应同时检查训练答案和表格展示。