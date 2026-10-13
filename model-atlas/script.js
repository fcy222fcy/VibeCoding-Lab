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
  { date: '2026-03-05', company: 'openai', name: 'GPT-5.4', type: 'Agent 能力', summary: '更聚焦工具、软件环境和专业工作流中的执行能力。', detail: 'OpenAI 发布 GPT-5.4，介绍其在专业知识工作、编码、工具使用与计算机操作方面的提升，并将这些能力用于更复杂的 Agent 工作流。', source: 'https://openai.com/index/introducing-gpt-5-4/', sourceLabel: 'OpenAI 官方公告' }
];

const timeline = document.querySelector('#timeline-content');
const yearLinks = document.querySelector('#year-links');
const searchInput = document.querySelector('#search-input');
const dialog = document.querySelector('#detail-dialog');
const dialogContent = document.querySelector('#dialog-content');
let companyFilter = 'all';

const companyName = { openai: 'OpenAI', deepseek: 'DeepSeek' };
const formatDate = (date) => `${Number(date.slice(5, 7))}月${Number(date.slice(8, 10))}日`;

function render() {
  const term = searchInput.value.trim().toLocaleLowerCase();
  const visible = milestones.filter((item) => (companyFilter === 'all' || item.company === companyFilter) && `${item.name} ${item.type} ${item.summary} ${item.detail} ${companyName[item.company]}`.toLocaleLowerCase().includes(term));
  const years = [...new Set(visible.map((item) => item.date.slice(0, 4)))].reverse();

  document.querySelector('#visible-count').textContent = visible.length.toString().padStart(2, '0');
  document.querySelector('#count-all').textContent = milestones.length;
  document.querySelector('#count-openai').textContent = milestones.filter((item) => item.company === 'openai').length;
  document.querySelector('#count-deepseek').textContent = milestones.filter((item) => item.company === 'deepseek').length;

  yearLinks.innerHTML = years.map((year) => `<a href="#year-${year}">${year}<span aria-hidden="true">↗</span></a>`).join('');
  if (!visible.length) {
    timeline.innerHTML = '<div class="empty-state"><strong>没有找到匹配的节点</strong><p>试试其他模型名称或关键词。</p></div>';
    return;
  }

  timeline.innerHTML = years.map((year) => {
    const cards = visible.filter((item) => item.date.startsWith(year)).reverse().map((item) => {
      const index = milestones.indexOf(item);
      return `<article class="milestone ${item.company}">
        <div class="milestone-date"><span>${formatDate(item.date)}</span><i></i></div>
        <button type="button" class="milestone-card" data-index="${index}" aria-label="查看 ${item.name} 详情">
          <span class="card-top"><span class="company-tag"><i></i>${companyName[item.company]}</span><span class="card-type">${item.type}</span></span>
          <span class="card-main"><strong>${item.name}</strong><span>${item.summary}</span></span>
          <span class="card-bottom"><span>查看里程碑详情</span><span class="card-arrow" aria-hidden="true">↗</span></span>
        </button>
      </article>`;
    }).join('');
    return `<div class="year-group" id="year-${year}"><div class="year-heading"><span>${year}</span><small>THE YEAR OF CHANGE</small></div>${cards}</div>`;
  }).join('');
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
timeline.addEventListener('click', (event) => {
  const card = event.target.closest('[data-index]');
  if (!card) return;
  const item = milestones[Number(card.dataset.index)];
  dialogContent.innerHTML = `<div class="dialog-eyebrow"><span class="dialog-company ${item.company}">${companyName[item.company]}</span><span>${item.date}</span></div><h2 id="dialog-title">${item.name}</h2><div class="dialog-rule"></div><span class="dialog-type">${item.type}</span><p class="dialog-lead">${item.summary}</p><p class="dialog-detail">${item.detail}</p><a class="source-link" href="${item.source}" target="_blank" rel="noopener noreferrer">阅读${item.sourceLabel}<span aria-hidden="true">↗</span></a><p class="dialog-note">来源为发布时的官方资料，当前模型可用性请以官方产品页面为准。</p>`;
  dialog.showModal();
});
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

render();
