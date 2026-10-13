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
  { date: '2026-09-29', company: 'openai', name: 'GPT-6.1 Sol', type: '最新节点', summary: 'Sol 系列升级，面向复杂编码、计算机使用和专业工作。', detail: 'OpenAI 于 2026 年 9 月 29 日发布 GPT-6.1 Sol。官方模型资料将其定位为以更低成本接近 Astra 能力的选择，重点覆盖复杂编码、计算机使用与专业任务。', source: 'https://developers.openai.com/api/docs/models/gpt-6.1-sol', sourceLabel: 'OpenAI 官方模型文档' }
];

const timeline = document.querySelector('#timeline-content');
const yearLinks = document.querySelector('#year-links');
const searchInput = document.querySelector('#search-input');
const popover = document.querySelector('#model-popover');
const popoverContent = document.querySelector('#popover-content');
let companyFilter = 'all';
let activeLabel = null;

const companyName = { openai: 'OpenAI', deepseek: 'DeepSeek' };
const formatDate = (date) => `${Number(date.slice(5, 7))}月${Number(date.slice(8, 10))}日`;
const columnWidth = 240;

function branchPath(points, end, branchY) {
  if (!points.length) return '';
  const first = points[0].x;
  const start = Math.max(18, first - 100);
  const finish = Math.min(end, points[points.length - 1].x + 112);
  return `M ${start} 205 C ${start + 42} 205 ${first - 58} ${branchY} ${first} ${branchY} H ${finish}`;
}

function branchDiagram(items) {
  const width = Math.max(items.length * columnWidth, columnWidth);
  const points = items.map((item, index) => ({ company: item.company, x: index * columnWidth + columnWidth / 2 }));
  const openai = points.filter((point) => point.company === 'openai');
  const deepseek = points.filter((point) => point.company === 'deepseek');
  const upperNodes = openai.map(({ x }) => `<path d="M ${x} 130 V 112" class="branch-tick openai"/><circle cx="${x}" cy="130" r="6" class="branch-node openai"/>`).join('');
  const lowerNodes = deepseek.map(({ x }) => `<path d="M ${x} 280 V 298" class="branch-tick deepseek"/><circle cx="${x}" cy="280" r="6" class="branch-node deepseek"/>`).join('');
  return `<svg class="branch-diagram" viewBox="0 0 ${width} 420" preserveAspectRatio="none" aria-hidden="true"><path d="M 0 205 H ${width}" class="time-path"/><path d="${branchPath(openai, width, 130)}" class="branch-path openai"/><path d="${branchPath(deepseek, width, 280)}" class="branch-path deepseek"/>${upperNodes}${lowerNodes}</svg>`;
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

  yearLinks.innerHTML = years.map((year) => `<button type="button" data-year="${year}">${year}</button>`).join('');
  if (!visible.length) {
    timeline.innerHTML = '<div class="empty-state"><strong>没有找到匹配的节点</strong><p>试试其他模型名称或关键词。</p></div>';
    return;
  }

  timeline.innerHTML = `<div class="timeline-track">${branchDiagram(visible)}${visible.map((item, position) => {
    const year = item.date.slice(0, 4);
    const firstInYear = position === 0 || visible[position - 1].date.slice(0, 4) !== year;
    const label = `<button type="button" class="model-label ${item.company}" data-index="${milestones.indexOf(item)}" aria-label="查看 ${item.name} 详情" aria-controls="model-popover" aria-expanded="false"><strong>${item.name}</strong><span>${item.type}</span></button>`;
    return `<div class="event-column" ${firstInYear ? `id="year-${year}"` : ''}><div class="model-slot openai">${item.company === 'openai' ? label : ''}</div><div class="year-mark">${firstInYear ? year : ''}</div><div class="date-mark">${formatDate(item.date)}</div><div class="model-slot deepseek">${item.company === 'deepseek' ? label : ''}</div></div>`;
  }).join('')}</div>`;
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
  if (target) timeline.scrollTo({ left: target.offsetLeft - timeline.firstElementChild.offsetLeft, behavior: 'smooth' });
});
document.querySelector('#scroll-prev').addEventListener('click', () => timeline.scrollBy({ left: -timeline.clientWidth * .75, behavior: 'smooth' }));
document.querySelector('#scroll-next').addEventListener('click', () => timeline.scrollBy({ left: timeline.clientWidth * .75, behavior: 'smooth' }));
timeline.addEventListener('keydown', (event) => {
  if (event.target !== timeline || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  timeline.scrollBy({ left: event.key === 'ArrowRight' ? 260 : -260, behavior: 'smooth' });
});

let dragState = null;
let ignoreClickUntil = 0;
timeline.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' || event.button !== 0) return;
  dragState = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: timeline.scrollLeft, moved: false };
});
timeline.addEventListener('pointermove', (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const distance = event.clientX - dragState.startX;
  if (!dragState.moved && Math.abs(distance) < 5) return;
  if (!dragState.moved) {
    dragState.moved = true;
    closePopover();
    timeline.classList.add('is-dragging');
    timeline.setPointerCapture(event.pointerId);
  }
  event.preventDefault();
  timeline.scrollLeft = dragState.scrollLeft - distance;
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
timeline.addEventListener('scroll', () => closePopover());
window.addEventListener('scroll', () => closePopover(), { passive: true });
window.addEventListener('resize', positionPopover);

render();
