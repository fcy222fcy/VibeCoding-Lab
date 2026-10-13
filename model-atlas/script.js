// Curated milestones. Dates refer to the linked official announcement, not current availability.
const milestones = [
  { date: '2020-05-28', company: 'openai', name: 'GPT-3', type: '语言模型', summary: '少样本学习让大规模语言模型展示出更通用的文本能力。', detail: 'OpenAI 发表 GPT-3 研究，展示模型仅通过提示中的少量示例，就能完成翻译、问答等多种任务。这是大规模预训练语言模型走向通用交互的重要节点。', source: 'https://openai.com/index/language-models-are-few-shot-learners/', sourceLabel: 'OpenAI 官方研究' },
  { date: '2022-11-30', company: 'openai', name: 'ChatGPT', type: '对话体验', summary: '以对话方式向公众开放，语言模型进入日常使用场景。', detail: 'OpenAI 发布 ChatGPT 研究预览。这个产品让用户可以通过自然语言连续提问、追问和修正模型回答，使对话式 AI 成为大众熟悉的交互方式。', source: 'https://openai.com/index/chatgpt/', sourceLabel: 'OpenAI 官方公告' },
  { date: '2023-03-14', company: 'openai', name: 'GPT-4', type: '多模态', summary: '文本与图像输入带来更复杂的理解和问题解决能力。', detail: 'GPT-4 是 OpenAI 当时发布的大型多模态模型，可接收文本和图像输入并生成文本输出。相较此前模型，它在复杂任务上的表现进一步提升。', source: 'https://openai.com/index/gpt-4/', sourceLabel: 'OpenAI 官方公告' },
  { date: '2024-05-06', company: 'deepseek', name: 'DeepSeek-V2', type: '混合专家', summary: '以更高效的混合专家架构，开启 DeepSeek 的 V2 系列。', detail: 'DeepSeek 官方模型仓库记录 V2 于 2024 年 5 月 6 日发布。它采用混合专家（MoE）架构，在模型能力与训练、推理效率之间探索新的平衡。', source: 'https://github.com/deepseek-ai/DeepSeek-V2', sourceLabel: 'DeepSeek 官方模型仓库' },
  { date: '2024-05-13', company: 'openai', name: 'GPT-4o', type: '多模态', summary: '面向文本、视觉和语音交互的更自然体验。', detail: 'GPT-4o 的「o」代表 omni。OpenAI 在发布时强调其跨文本、音频和视觉的能力，并将其作为更自然的人机交互方向。', source: 'https://openai.com/index/gpt-4o-and-more-tools-to-chatgpt-free/', sourceLabel: 'OpenAI 官方公告' },
  { date: '2024-09-12', company: 'openai', name: 'o1-preview', type: '推理模型', summary: '让模型在回答前投入更多计算，推理成为独立的进化方向。', detail: 'OpenAI 发布 o1 系列的预览版本，提出通过让模型花更多时间思考来解决更复杂的科学、编程和数学问题。', source: 'https://openai.com/index/learning-to-reason-with-llms/', sourceLabel: 'OpenAI 官方研究' },
  { date: '2024-12-26', company: 'deepseek', name: 'DeepSeek-V3', type: '开放权重', summary: '以混合专家架构推进模型能力，并公开模型与技术报告。', detail: 'DeepSeek 发布 V3，官方介绍其采用混合专家（MoE）架构，并同步公开模型权重与技术报告，成为开放模型路线上的重要节点。', source: 'https://api-docs.deepseek.com/news/news1226/', sourceLabel: 'DeepSeek 官方公告' },
  { date: '2025-01-20', company: 'deepseek', name: 'DeepSeek-R1', type: '推理模型', summary: '公开推理模型权重与技术报告，推动推理能力普及。', detail: 'DeepSeek 正式发布 R1，并开放模型权重与技术报告。其训练重点之一是通过强化学习提升数学、代码及自然语言推理能力。', source: 'https://api-docs.deepseek.com/zh-cn/news/news250120/', sourceLabel: 'DeepSeek 官方公告' },
  { date: '2025-04-16', company: 'openai', name: 'o3 / o4-mini', type: '工具使用', summary: '推理模型开始更主动地组合搜索、代码等工具。', detail: 'OpenAI 发布 o3 与 o4-mini，强调模型能够在 ChatGPT 中自主选择并组合搜索、Python、视觉分析等工具，以完成更复杂的任务。', source: 'https://openai.com/index/introducing-o3-and-o4-mini/', sourceLabel: 'OpenAI 官方公告' },
  { date: '2025-08-07', company: 'openai', name: 'GPT-5', type: '统一系统', summary: '快速回答与深入思考被整合到一个统一体验中。', detail: 'GPT-5 被介绍为一个统一系统：根据问题复杂度，在快速响应与更深入的推理之间切换。模型发布也进一步强调编码与 Agent 任务。', source: 'https://openai.com/index/introducing-gpt-5/', sourceLabel: 'OpenAI 官方公告' },
  { date: '2025-08-21', company: 'deepseek', name: 'DeepSeek-V3.1', type: '混合推理', summary: '思考与非思考两种模式并存，强化多步工具任务。', detail: 'DeepSeek 将 V3.1 称为迈向 Agent 时代的第一步：同一模型支持思考与非思考模式，后训练提升工具调用和多步任务能力。', source: 'https://www.deepseek.com/en/news/deepseek-v3-1/', sourceLabel: 'DeepSeek 官方公告' },
  { date: '2025-12-01', company: 'deepseek', name: 'DeepSeek-V3.2', type: '工具使用', summary: '把思考过程进一步融入工具调用。', detail: 'DeepSeek 发布 V3.2，重点介绍「Thinking in Tool-Use」：模型在思考模式与非思考模式中都可以使用工具，使推理与行动更紧密地结合。', source: 'https://api-docs.deepseek.com/news/news251201/', sourceLabel: 'DeepSeek 官方公告' },
  { date: '2025-12-11', company: 'openai', name: 'GPT-5.2', type: '专业工作', summary: '围绕长流程任务、代码与专业知识工作继续演进。', detail: 'OpenAI 将 GPT-5.2 定位为适合专业工作与长流程 Agent 任务的模型，强调其在复杂、多步骤任务中的表现。', source: 'https://openai.com/index/introducing-gpt-5-2/', sourceLabel: 'OpenAI 官方公告' },
  { date: '2026-03-05', company: 'openai', name: 'GPT-5.4', type: 'Agent 能力', summary: '更聚焦工具、软件环境和专业工作流中的执行能力。', detail: 'OpenAI 发布 GPT-5.4，介绍其在专业知识工作、编码、工具使用与计算机操作方面的提升，并将这些能力用于更复杂的 Agent 工作流。', source: 'https://openai.com/index/introducing-gpt-5-4/', sourceLabel: 'OpenAI 官方公告' },
  { date: '2026-04-24', company: 'deepseek', name: 'DeepSeek-V4 Preview', type: '开放权重', summary: 'V4 系列预览版发布，推出 Pro 与 Flash 两种路线。', detail: 'DeepSeek 发布并开源 V4 预览版，包括面向更强能力的 Pro 和面向效率的 Flash，并引入百万 token 上下文。', source: 'https://www.deepseek.com/news/v4-preview/', sourceLabel: 'DeepSeek 官方公告' },
  { date: '2026-09-03', company: 'openai', name: 'GPT-6 Astra', type: '前沿模型', summary: 'GPT-6 系列开启，聚焦复杂的端到端任务。', detail: 'OpenAI 发布 GPT-6 Astra，并在官方 API 更新记录中将其定位为面向复杂推理、编码、计算机使用、研究和文档工作的模型。', source: 'https://developers.openai.com/api/docs/changelog', sourceLabel: 'OpenAI API 更新记录' },
  { date: '2026-09-10', company: 'deepseek', name: 'DeepSeek-V4.1 Flash', type: '高效模型', summary: '以新架构强调速度、成本效率与原生视觉理解。', detail: 'DeepSeek 发布 V4.1 Flash，介绍其不对称架构、原生视觉理解和更高效的推理，作为 V4 系列的后续进展。', source: 'https://www.deepseek.com/en/news/deepseek-v4-1-flash/', sourceLabel: 'DeepSeek 官方公告' },
  { date: '2026-09-22', company: 'openai', name: 'GPT-6 Sol / Luna', type: '模型家族', summary: 'GPT-6 扩展为兼顾性能与效率的不同选择。', detail: 'OpenAI 发布 GPT-6 Sol 和 GPT-6 Luna。官方 API 更新记录说明两者分别面向不同的性能与成本需求，均可处理文本和图像输入。', source: 'https://developers.openai.com/api/docs/changelog', sourceLabel: 'OpenAI API 更新记录' },
  { date: '2026-09-29', company: 'openai', name: 'GPT-6.1 Sol', type: '最新节点', summary: 'Sol 系列升级，面向复杂编码、计算机使用和专业工作。', detail: 'OpenAI 于 2026 年 9 月 29 日发布 GPT-6.1 Sol。官方模型资料将其定位为以更低成本接近 Astra 能力的选择，重点覆盖复杂编码、计算机使用与专业任务。', source: 'https://developers.openai.com/api/docs/models/gpt-6.1-sol', sourceLabel: 'OpenAI 官方模型文档' },
  { date: '2023-03-14', company: 'claude', name: 'Claude', type: '对话模型', summary: 'Anthropic 正式推出 Claude，对话与文本处理成为其首批公开能力。', detail: 'Claude 基于 Anthropic 对可靠、可控 AI 系统的研究推出。官方介绍其可通过聊天界面和 API 完成总结、搜索、写作、问答及编程等任务。', source: 'https://www.anthropic.com/news/introducing-claude', sourceLabel: 'Anthropic 官方公告' },
  { date: '2023-07-11', company: 'claude', name: 'Claude 2', type: '长上下文', summary: '更长的输入与输出，面向大篇幅资料理解和写作。', detail: 'Anthropic 发布 Claude 2，并开放 claude.ai 公测。官方介绍其支持最高 100K token 的输入，同时改进了编码、数学和推理表现。', source: 'https://www.anthropic.com/news/claude-2', sourceLabel: 'Anthropic 官方公告' },
  { date: '2024-03-04', company: 'claude', name: 'Claude 3', type: '模型家族', summary: 'Opus、Sonnet、Haiku 三档模型，兼顾能力、速度与成本。', detail: 'Claude 3 家族同时介绍 Opus、Sonnet 和 Haiku，并加入图像理解能力。不同档位让用户按任务复杂度、响应速度与成本选择模型。', source: 'https://www.anthropic.com/news/claude-3-family', sourceLabel: 'Anthropic 官方公告' },
  { date: '2024-06-21', company: 'claude', name: 'Claude 3.5 Sonnet', type: '编码能力', summary: 'Sonnet 档位在智能、速度和成本之间取得新的平衡。', detail: 'Anthropic 将 Claude 3.5 Sonnet 作为 3.5 家族的首个版本发布。官方介绍其在推理与编码任务上提升，同时保持中档模型的速度与价格。', source: 'https://www.anthropic.com/news/claude-3-5-sonnet', sourceLabel: 'Anthropic 官方公告' },
  { date: '2025-02-24', company: 'claude', name: 'Claude 3.7 Sonnet', type: '混合推理', summary: '同一个模型支持快速响应与可见的延长思考。', detail: 'Claude 3.7 Sonnet 引入混合推理模式：用户可获得快速回答，也可让模型进行逐步的延长思考。Anthropic 同日推出 Claude Code 的研究预览。', source: 'https://www.anthropic.com/news/claude-3-7-sonnet', sourceLabel: 'Anthropic 官方公告' },
  { date: '2025-05-22', company: 'claude', name: 'Claude 4', type: 'Agent 能力', summary: 'Opus 4 与 Sonnet 4 强化编程、推理和长流程任务。', detail: 'Anthropic 发布 Claude Opus 4 与 Claude Sonnet 4，重点介绍持续执行复杂任务的能力，并让延长思考与工具使用结合。', source: 'https://www.anthropic.com/news/claude-4', sourceLabel: 'Anthropic 官方公告' },
  { date: '2025-09-29', company: 'claude', name: 'Claude Sonnet 4.5', type: '工具使用', summary: '面向编码、计算机操作和复杂 Agent 任务继续提升。', detail: 'Anthropic 发布 Sonnet 4.5，强调其在软件开发、计算机使用和长时间多步骤任务上的进展，并同步扩展 Claude Code 与开发平台能力。', source: 'https://www.anthropic.com/news/claude-sonnet-4-5', sourceLabel: 'Anthropic 官方公告' },
  { date: '2025-11-24', company: 'claude', name: 'Claude Opus 4.5', type: '前沿模型', summary: '更聚焦复杂编程、Agent 与专业知识工作。', detail: 'Opus 4.5 是 Anthropic 当时推出的高能力模型，官方介绍它在编程、计算机使用，以及研究、文档和表格等工作任务上的提升。', source: 'https://www.anthropic.com/news/claude-opus-4-5', sourceLabel: 'Anthropic 官方公告' },
  { date: '2026-02-05', company: 'claude', name: 'Claude Opus 4.6', type: '长流程任务', summary: '更擅长大型代码库中的规划、调试和长时间执行。', detail: 'Anthropic 发布 Opus 4.6，介绍其更稳定的长流程 Agent 能力、更强的代码审查与调试表现，以及 Opus 系列首次提供的百万 token 上下文测试版。', source: 'https://www.anthropic.com/news/claude-opus-4-6', sourceLabel: 'Anthropic 官方公告' },
  { date: '2026-06-30', company: 'claude', name: 'Claude Sonnet 5', type: 'Agent 模型', summary: '以 Sonnet 的速度和成本处理更自主的工具任务。', detail: 'Anthropic 将 Sonnet 5 定位为更具 Agent 能力的 Sonnet 模型，强调它能规划、调用浏览器和终端等工具，并完成多步骤工作。', source: 'https://www.anthropic.com/news/claude-sonnet-5', sourceLabel: 'Anthropic 官方公告' },
  { date: '2026-09-01', company: 'claude', name: 'Claude Fable 5.1 / Mythos 5.1', type: '前沿研究', summary: '同源模型面向不同访问与安全保障级别。', detail: 'Anthropic 介绍 Fable 5.1 与 Mythos 5.1：两者是同一模型，但使用不同的安全保障。Fable 5.1 面向一般使用，Mythos 5.1 通过受信任访问计划提供。', source: 'https://www.anthropic.com/claude-fable-and-mythos-5-1', sourceLabel: 'Anthropic 官方公告' },
  { date: '2026-09-22', company: 'claude', name: 'Claude Opus 5.5', type: '复杂任务', summary: 'Claude 5.5 家族的首个版本，面向复杂专业工作。', detail: 'Anthropic 发布 Opus 5.5，称其在多数工作任务上达到 Fable 5.1 的水平，同时比 Opus 5 更经济，适合需要审慎判断的复杂任务。', source: 'https://www.anthropic.com/claude-opus-5-5', sourceLabel: 'Anthropic 官方公告' },
  { date: '2026-09-28', company: 'claude', name: 'Claude Sonnet 5.5', type: '高效模型', summary: '比 Sonnet 5 更快，适合日常任务、修复缺陷与文档制作。', detail: 'Anthropic 将 Sonnet 5.5 作为 Opus 5.5 的高效搭档推出，强调其速度、成本和编码表现，并覆盖文档、幻灯片与表格制作等工作。', source: 'https://www.anthropic.com/claude-sonnet-5-5', sourceLabel: 'Anthropic 官方公告' },
  { date: '2026-10-07', company: 'claude', name: 'Claude Haiku 5.5', type: '轻量模型', summary: 'Claude 5.5 家族的快速小模型，面向高频任务。', detail: 'Anthropic 发布 Haiku 5.5，定位为速度快、成本低的小模型，适合总结、分类、数据库查询和实时支持等高频任务，也能作为其他模型的子 Agent。', source: 'https://www.anthropic.com/claude-haiku-5-5', sourceLabel: 'Anthropic 官方公告' }
].sort((a, b) => a.date.localeCompare(b.date));

const timeline = document.querySelector('#timeline-content');
const timelineLayout = document.querySelector('#timeline-layout');
const yearLinks = document.querySelector('#year-links');
const searchInput = document.querySelector('#search-input');
const popover = document.querySelector('#model-popover');
const popoverContent = document.querySelector('#popover-content');
let companyFilter = 'all';
let activeLabel = null;
let zoom = 1;

const companyName = { openai: 'OpenAI', claude: 'Claude', deepseek: 'DeepSeek' };
const formatDate = (date) => `${Number(date.slice(5, 7))}月${Number(date.slice(8, 10))}日`;
const columnWidth = 240;
const trackHeight = 500;
const minZoom = .6;
const maxZoom = 2;

const axisY = 275;
const branchY = { openai: 105, claude: 185, deepseek: 365 };

function branchPath(points, end, y) {
  if (!points.length) return '';
  const first = points[0].x;
  const start = Math.max(18, first - 100);
  const finish = Math.min(end, points[points.length - 1].x + 112);
  return `M ${start} ${axisY} C ${start + 42} ${axisY} ${first - 58} ${y} ${first} ${y} H ${finish}`;
}

function branchDiagram(items) {
  const width = Math.max(items.length * columnWidth, columnWidth);
  const points = items.map((item, index) => ({ company: item.company, x: index * columnWidth + columnWidth / 2 }));
  const branches = Object.entries(branchY).map(([company, y]) => {
    const nodes = points.filter((point) => point.company === company);
    const tickEnd = company === 'deepseek' ? y + 18 : y - 18;
    const ticks = nodes.map(({ x }) => `<path d="M ${x} ${y} V ${tickEnd}" class="branch-tick ${company}"/><circle cx="${x}" cy="${y}" r="6" class="branch-node ${company}"/>`).join('');
    return `<path d="${branchPath(nodes, width, y)}" class="branch-path ${company}"/>${ticks}`;
  }).join('');
  return `<svg class="branch-diagram" viewBox="0 0 ${width} 500" preserveAspectRatio="none" aria-hidden="true"><path d="M 0 ${axisY} H ${width}" class="time-path"/>${branches}</svg>`;
}

function render() {
  closePopover();
  const term = searchInput.value.trim().toLocaleLowerCase();
  const visible = milestones.filter((item) => (companyFilter === 'all' || item.company === companyFilter) && `${item.name} ${item.type} ${item.summary} ${item.detail} ${companyName[item.company]}`.toLocaleLowerCase().includes(term));
  const years = [...new Set(visible.map((item) => item.date.slice(0, 4)))];

  document.querySelector('#visible-count').textContent = visible.length.toString().padStart(2, '0');
  document.querySelector('#count-all').textContent = milestones.length;
  document.querySelector('#count-openai').textContent = milestones.filter((item) => item.company === 'openai').length;
  document.querySelector('#count-deepseek').textContent = milestones.filter((item) => item.company === 'deepseek').length;
  document.querySelector('#count-claude').textContent = milestones.filter((item) => item.company === 'claude').length;

  yearLinks.innerHTML = years.map((year) => `<button type="button" data-year="${year}">${year}</button>`).join('');
  if (!visible.length) {
    timeline.innerHTML = '<div class="empty-state"><strong>没有找到匹配的节点</strong><p>试试其他模型名称或关键词。</p></div>';
    return;
  }

  const trackWidth = Math.max(visible.length * columnWidth, columnWidth);
  timeline.innerHTML = `<div class="timeline-stage" data-base-width="${trackWidth}" style="width:${trackWidth * zoom}px;height:${trackHeight * zoom}px"><div class="timeline-track" style="transform:scale(${zoom})">${branchDiagram(visible)}${visible.map((item, position) => {
    const year = item.date.slice(0, 4);
    const firstInYear = position === 0 || visible[position - 1].date.slice(0, 4) !== year;
    const label = `<button type="button" class="model-label ${item.company}" data-index="${milestones.indexOf(item)}" aria-label="查看 ${item.name} 详情" aria-controls="model-popover" aria-expanded="false"><strong>${item.name}</strong><span>${item.type}</span></button>`;
    return `<div class="event-column" ${firstInYear ? `id="year-${year}"` : ''}><div class="model-slot openai">${item.company === 'openai' ? label : ''}</div><div class="model-slot claude">${item.company === 'claude' ? label : ''}</div><div class="year-mark">${firstInYear ? year : ''}</div><div class="date-mark">${formatDate(item.date)}</div><div class="model-slot deepseek">${item.company === 'deepseek' ? label : ''}</div></div>`;
  }).join('')}</div></div>`;
  fitCanvasHeight();
  positionStage();
  syncViewAnchor();
}

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    companyFilter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  });
});

searchInput.addEventListener('input', render);
yearLinks.addEventListener('click', (event) => {
  const button = event.target.closest('[data-year]');
  if (!button) return;
  const target = document.querySelector(`#year-${button.dataset.year}`);
  if (target) timeline.scrollTo({ left: target.offsetLeft * zoom, behavior: 'smooth' });
});
document.querySelector('#scroll-prev').addEventListener('click', () => timeline.scrollBy({ left: -timeline.clientWidth * .75, behavior: 'smooth' }));
document.querySelector('#scroll-next').addEventListener('click', () => timeline.scrollBy({ left: timeline.clientWidth * .75, behavior: 'smooth' }));
timeline.addEventListener('keydown', (event) => {
  if (event.target !== timeline) return;
  if (['+', '='].includes(event.key)) { event.preventDefault(); setZoom(zoom + .2); return; }
  if (event.key === '-') { event.preventDefault(); setZoom(zoom - .2); return; }
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
  event.preventDefault();
  const movement = { ArrowLeft: [-260, 0], ArrowRight: [260, 0], ArrowUp: [0, -160], ArrowDown: [0, 160] }[event.key];
  timeline.scrollBy({ left: movement[0], top: movement[1], behavior: 'smooth' });
});

function canvasCenter() {
  const stage = timeline.querySelector('.timeline-stage');
  const left = stage ? parseFloat(stage.style.marginLeft) || 0 : 0;
  const top = stage ? parseFloat(stage.style.marginTop) || 0 : 0;
  return { x: (timeline.scrollLeft + timeline.clientWidth / 2 - left) / zoom, y: (timeline.scrollTop + timeline.clientHeight / 2 - top) / zoom };
}

function restoreCanvasCenter(center) {
  const stage = timeline.querySelector('.timeline-stage');
  const left = stage ? parseFloat(stage.style.marginLeft) || 0 : 0;
  const top = stage ? parseFloat(stage.style.marginTop) || 0 : 0;
  timeline.scrollLeft = center.x * zoom + left - timeline.clientWidth / 2;
  timeline.scrollTop = center.y * zoom + top - timeline.clientHeight / 2;
}

function positionStage() {
  const stage = timeline.querySelector('.timeline-stage');
  if (!stage) return;
  stage.style.marginLeft = `${Math.max(0, (timeline.clientWidth - stage.offsetWidth) / 2)}px`;
  stage.style.marginTop = `${Math.max(0, (timeline.clientHeight - stage.offsetHeight) / 2)}px`;
}

// 横向滚动条会占掉容器高度，若不同步补偿，100% 缩放时会被挤出一条多余的纵向滚动条。
function fitCanvasHeight() {
  const scrollbar = timeline.offsetHeight - timeline.clientHeight;
  if (scrollbar > 0) timeline.style.setProperty('--canvas-height', `${trackHeight + scrollbar}px`);
}

// 视野锚点：用轨道坐标记住"用户正在看哪里"，进入/退出全屏后复原，避免视角跳动。
let viewAnchor = null;

function syncViewAnchor() {
  if (!timeline.querySelector('.timeline-stage')) return;
  viewAnchor = canvasCenter();
}

function keepViewAnchor() {
  positionStage();
  if (viewAnchor) restoreCanvasCenter(viewAnchor);
}

function updateZoomControls() {
  document.querySelector('#zoom-reset').textContent = `${Math.round(zoom * 100)}%`;
  document.querySelector('#zoom-out').disabled = zoom <= minZoom;
  document.querySelector('#zoom-in').disabled = zoom >= maxZoom;
}

function setZoom(value) {
  const nextZoom = Math.min(maxZoom, Math.max(minZoom, Math.round(value * 10) / 10));
  if (nextZoom === zoom) return;
  const center = canvasCenter();
  zoom = nextZoom;
  closePopover();
  const stage = timeline.querySelector('.timeline-stage');
  if (stage) {
    stage.style.width = `${Number(stage.dataset.baseWidth) * zoom}px`;
    stage.style.height = `${trackHeight * zoom}px`;
    stage.firstElementChild.style.transform = `scale(${zoom})`;
    positionStage();
    restoreCanvasCenter(center);
    viewAnchor = center;
  }
  updateZoomControls();
}

document.querySelector('#zoom-out').addEventListener('click', () => setZoom(zoom - .2));
document.querySelector('#zoom-in').addEventListener('click', () => setZoom(zoom + .2));
document.querySelector('#zoom-reset').addEventListener('click', () => setZoom(1));
updateZoomControls();

const fullscreenToggle = document.querySelector('#fullscreen-toggle');
function isCanvasFullscreen() {
  return document.fullscreenElement === timelineLayout || timelineLayout.classList.contains('is-fullscreen');
}
// 原生全屏走浏览器 top layer，只有全屏元素及其后代会被绘制；兜底全屏靠 z-index:50 也会盖住挂在 body 下的弹层。
// 两种情况详情卡片都看不见，所以全屏期间把弹层挪进画布，退出时再挪回 body。
// 画布及其祖先没有 transform / filter / will-change，position:fixed 的坐标基准不受影响。
function relocatePopover() {
  const host = isCanvasFullscreen() ? timelineLayout : document.body;
  if (popover.parentElement !== host) host.appendChild(popover);
}
function updateFullscreenButton() {
  const expanded = isCanvasFullscreen();
  // 展开后只换图标容易让人找不到"怎么退出去"，所以退出态直接给文字按钮。
  fullscreenToggle.textContent = expanded ? '退出全屏' : '⛶';
  fullscreenToggle.classList.toggle('is-exit', expanded);
  fullscreenToggle.setAttribute('aria-label', expanded ? '退出全屏时间轴' : '全屏查看时间轴');
  fullscreenToggle.setAttribute('aria-pressed', String(expanded));
  fullscreenToggle.title = expanded ? '退出全屏' : '全屏查看';
}
fullscreenToggle.addEventListener('click', async () => {
  viewAnchor = canvasCenter();
  closePopover();
  if (timelineLayout.classList.contains('is-fullscreen')) {
    timelineLayout.classList.remove('is-fullscreen');
    document.body.classList.remove('timeline-expanded');
  } else if (document.fullscreenElement === timelineLayout) {
    await document.exitFullscreen();
  } else if (timelineLayout.requestFullscreen) {
    try {
      await timelineLayout.requestFullscreen();
    } catch {
      timelineLayout.classList.add('is-fullscreen');
      document.body.classList.add('timeline-expanded');
    }
  } else {
    timelineLayout.classList.add('is-fullscreen');
    document.body.classList.add('timeline-expanded');
  }
  keepViewAnchor();
  relocatePopover();
  updateFullscreenButton();
});
// 用 Esc 或浏览器自带按钮退出全屏时不会走上面的分支，同样需要把视角锚回去。
document.addEventListener('fullscreenchange', () => { keepViewAnchor(); relocatePopover(); updateFullscreenButton(); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && timelineLayout.classList.contains('is-fullscreen')) {
    timelineLayout.classList.remove('is-fullscreen');
    document.body.classList.remove('timeline-expanded');
    keepViewAnchor();
    relocatePopover();
    updateFullscreenButton();
  }
});

let dragState = null;
let ignoreClickUntil = 0;
timeline.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' || event.button !== 0) return;
  dragState = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, scrollLeft: timeline.scrollLeft, scrollTop: timeline.scrollTop, moved: false };
});
timeline.addEventListener('pointermove', (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const distance = event.clientX - dragState.startX;
  const verticalDistance = event.clientY - dragState.startY;
  if (!dragState.moved && Math.hypot(distance, verticalDistance) < 5) return;
  if (!dragState.moved) {
    dragState.moved = true;
    closePopover();
    timeline.classList.add('is-dragging');
    timeline.setPointerCapture(event.pointerId);
  }
  event.preventDefault();
  timeline.scrollLeft = dragState.scrollLeft - distance;
  timeline.scrollTop = dragState.scrollTop - verticalDistance;
});
timeline.addEventListener('pointerleave', () => {
  if (dragState && !dragState.moved) dragState = null;
});
function finishDrag(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  if (dragState.moved) ignoreClickUntil = Date.now() + 250;
  timeline.classList.remove('is-dragging');
  dragState = null;
}
timeline.addEventListener('pointerup', finishDrag);
timeline.addEventListener('pointercancel', finishDrag);

function closePopover(restoreFocus = false) {
  const previousLabel = activeLabel;
  if (previousLabel) previousLabel.setAttribute('aria-expanded', 'false');
  activeLabel = null;
  popover.hidden = true;
  if (restoreFocus && previousLabel?.isConnected) previousLabel.focus();
}

function positionPopover() {
  if (!activeLabel) return;
  const anchor = activeLabel.getBoundingClientRect();
  const margin = 12;
  const width = popover.offsetWidth;
  const height = popover.offsetHeight;
  const left = Math.min(Math.max(anchor.left + anchor.width / 2 - width / 2, margin), window.innerWidth - width - margin);
  const below = anchor.bottom + 14;
  const above = anchor.top - height - 14;
  const placeBelow = below + height <= window.innerHeight - margin || above < margin;
  popover.dataset.placement = placeBelow ? 'below' : 'above';
  popover.style.left = `${left}px`;
  popover.style.top = `${Math.max(margin, Math.min(placeBelow ? below : above, window.innerHeight - height - margin))}px`;
  popover.style.setProperty('--arrow-x', `${Math.min(Math.max(anchor.left + anchor.width / 2 - left, 22), width - 22)}px`);
}

function openPopover(label) {
  if (activeLabel === label) {
    closePopover();
    return;
  }
  closePopover();
  const item = milestones[Number(label.dataset.index)];
  popoverContent.innerHTML = `<div class="popover-meta"><span class="popover-company ${item.company}">${companyName[item.company]}</span><time datetime="${item.date}">${item.date}</time></div><h3 id="popover-title">${item.name}</h3><span class="popover-type">${item.type}</span><p class="popover-summary">${item.summary}</p><p class="popover-detail">${item.detail}</p><a class="popover-source" href="${item.source}" target="_blank" rel="noopener noreferrer">查看${item.sourceLabel}<span aria-hidden="true">↗</span></a>`;
  activeLabel = label;
  label.setAttribute('aria-expanded', 'true');
  popover.dataset.company = item.company;
  popover.hidden = false;
  positionPopover();
}

timeline.addEventListener('click', (event) => {
  if (Date.now() < ignoreClickUntil) return;
  const label = event.target.closest('[data-index]');
  if (label) openPopover(label);
});
popover.querySelector('.popover-close').addEventListener('click', () => closePopover(true));
document.addEventListener('click', (event) => {
  if (!popover.hidden && !popover.contains(event.target) && !event.target.closest('[data-index]')) closePopover();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !popover.hidden) closePopover(true);
});
timeline.addEventListener('scroll', () => { closePopover(); syncViewAnchor(); });
window.addEventListener('scroll', () => closePopover(), { passive: true });
window.addEventListener('resize', () => { keepViewAnchor(); positionPopover(); });

render();
