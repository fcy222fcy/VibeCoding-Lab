# AI 演进图谱 / AI Evolution Atlas

一个纯前端的 AI 发展导览，从模型篇开始，后续可继续加入 Agent、工具和产品形态。当前模型时间轴用红色表示共同时间，黄色、紫色、绿色分支分别记录 OpenAI、Claude、DeepSeek。桌面端可按住画布拖动，触屏可滑动；画布右上角支持缩放与全屏，点击模型名称可查看详情和官方来源。资料核对至 2026 年 10 月 13 日，最新收录 GPT-6.1 Sol、Claude Haiku 5.5 与 DeepSeek-V4.1 Flash。

## 本地预览

直接打开 `index.html`，或在项目根目录运行 `python -m http.server 8000`，访问 `http://localhost:8000`。无构建步骤、无 API Key、无运行时依赖。

## 部署到 GitHub Pages

当前项目位于 `VibeCoding-Lab` 仓库的 `model-atlas` 子目录，沿用现有路径以保证旧链接可用。仓库根目录的 `.github/workflows/deploy.yml` 会在推送 `main` 后将这里的 `index.html`、`styles.css`、`tree.css`、`script.js` 和 `favicon.svg` 复制到站点的 `/model-atlas/` 路径。仓库的 Pages 来源沿用现有的 `gh-pages` 分支，不需要单独配置本目录的工作流，也不需要在网页中放入 GitHub Token。

## 画布操作

- 拖动：在画布上按住鼠标左键拖动，触屏设备可直接滑动；焦点在画布时也可用方向键滚动。
- 缩放：右上角 `−` / `+` 按钮以 20% 步进缩放（范围 60%–200%），中间按钮一键回到 100%；键盘 `+` / `-` 等效。缩放保持当前视野中心，放大后仍可继续拖动。
- 全屏：右上角方形按钮进入全屏，再点一次或用 `Esc` 退出。进入、退出全屏都会保留当前视野，不会跳回起点。
- 筛选与搜索：切换公司筛选或输入关键词时保留当前缩放比例。

## 更新内容

时间线数据维护在 `script.js` 的 `milestones` 数组。新增记录时填写 `date`、`company`、`name`、`type`、`summary`、`detail` 和官方 `source` 链接。发布日与介绍内容以原始公告为准。

本项目是独立整理的导览，并非 OpenAI、Anthropic 或 DeepSeek 官方网站。发布历史不代表当前产品可用性。
