# 模型纪事 / Model Atlas

一个纯前端的 AI 模型发展时间线。红色是共同时间线，黄色、紫色、绿色分支分别记录 OpenAI、Claude、DeepSeek。桌面端可按住画布拖动，触屏可横向滑动，点击模型名称查看详情和官方来源。资料核对至 2026 年 10 月 13 日，最新收录 GPT-6.1 Sol、Claude Haiku 5.5 与 DeepSeek-V4.1 Flash。

## 本地预览

直接打开 `index.html`，或在项目根目录运行 `python -m http.server 8000`，访问 `http://localhost:8000`。无构建步骤、无 API Key、无运行时依赖。

## 部署到 GitHub Pages

当前项目是 `VibeCoding-Lab` 仓库的 `model-atlas` 子目录。仓库根目录的 `.github/workflows/deploy.yml` 会在推送 `main` 后将这里的 `index.html`、`styles.css`、`tree.css`、`script.js` 和 `favicon.svg` 复制到站点的 `/model-atlas/` 路径。仓库的 Pages 来源沿用现有的 `gh-pages` 分支，不需要单独配置本目录的工作流，也不需要在网页中放入 GitHub Token。

## 更新内容

时间线数据维护在 `script.js` 的 `milestones` 数组。新增记录时填写 `date`、`company`、`name`、`type`、`summary`、`detail` 和官方 `source` 链接。发布日与介绍内容以原始公告为准。

本项目是独立整理的导览，并非 OpenAI、Anthropic 或 DeepSeek 官方网站。发布历史不代表当前产品可用性。
