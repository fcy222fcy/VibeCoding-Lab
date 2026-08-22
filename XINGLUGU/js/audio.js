/* ═══════════════════════════════════════════════════════════════
   audio.js —— XINGLUGU 8-bit 音效引擎
   用 Web Audio API 实时合成复古音效与循环 BGM，无任何音频文件。
   ═══════════════════════════════════════════════════════════════ */
'use strict';

const XLAudio = (() => {
  let ctx = null;
  let master = null;
  let enabled = true;
  let bgmTimer = null;
  let nextNoteTime = 0;
  let step = 0;

  const STORAGE_KEY = 'xinglugu_sound';

  /* ---------- 初始化（需在用户手势中调用） ---------- */
  function init() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    // 从 localStorage 恢复偏好
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) enabled = saved === '1';
    } catch (e) { /* ignore */ }
  }

  function setEnabled(v) {
    enabled = !!v;
    try { localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0'); } catch (e) { /* ignore */ }
    if (!enabled) stopBGM();
    return enabled;
  }

  function isEnabled() { return enabled; }

  /* ---------- 基础音符 ---------- */
  function tone(freq, dur, type = 'square', vol = 0.18, when = 0, slideTo = null) {
    if (!ctx || !master || !enabled) return;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  /* ---------- 交互音效 ---------- */
  const sfx = {
    click()   { tone(660, 0.06, 'square', 0.12); },
    start()   { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.16, 'square', 0.15, i * 0.09)); },
    harvest() { tone(880, 0.07, 'square', 0.16); tone(1318.5, 0.14, 'square', 0.16, 0.07); },
    toggle()  { tone(enabled ? 520 : 380, 0.09, 'square', 0.12); },
    dialog()  { tone(1100, 0.03, 'square', 0.05); },
    coin()    { tone(987.8, 0.05, 'square', 0.1); tone(1318.5, 0.09, 'square', 0.1, 0.05); },
    oink()    { tone(210, 0.14, 'sawtooth', 0.09, 0, 110); tone(105, 0.2, 'sawtooth', 0.08, 0.1, 70); },
  };

  /* ---------- BGM：8-bit 乡村小调（C 大调循环） ---------- */
  const BPM = 138;
  const STEP = 60 / BPM / 2;   // 八分音符
  // 旋律：[频率或 0(休止), 步数]
  const MELODY = [
    [523.25, 1], [659.25, 1], [783.99, 1], [659.25, 1],
    [880.00, 1], [783.99, 1], [659.25, 1], [523.25, 1],
    [587.33, 1], [698.46, 1], [880.00, 1], [698.46, 1],
    [1046.5, 1], [880.00, 1], [783.99, 2],
    [523.25, 1], [659.25, 1], [783.99, 1], [659.25, 1],
    [880.00, 1], [1046.5, 1], [880.00, 1], [783.99, 1],
    [698.46, 2], [659.25, 1], [698.46, 1],
    [783.99, 4],
  ];
  // 低音：[频率或 0, 步数]
  const BASS = [
    [130.81, 4], [130.81, 4], [174.61, 4], [174.61, 4],
    [196.00, 4], [174.61, 4], [130.81, 8],
  ];

  function scheduleStep(s) {
    const melIdx = s % MELODY.length;
    const bassIdx = Math.floor(s / 2) % BASS.length;
    const [mf, ms] = MELODY[melIdx];
    const [bf, bs] = BASS[bassIdx];
    const when = nextNoteTime - ctx.currentTime;
    if (mf) tone(mf, ms * STEP * 0.9, 'square', 0.05, when);
    if (bf) tone(bf, bs * STEP * 0.9, 'triangle', 0.09, when);
    nextNoteTime += ms * STEP;
    step += 1;
  }

  function startBGM() {
    if (!ctx || bgmTimer || !enabled) return;
    step = 0;
    nextNoteTime = ctx.currentTime + 0.06;
    bgmTimer = setInterval(() => {
      if (!enabled) return;
      while (nextNoteTime < ctx.currentTime + 0.18) {
        scheduleStep(step);
      }
    }, 90);
  }

  function stopBGM() {
    if (bgmTimer) {
      clearInterval(bgmTimer);
      bgmTimer = null;
    }
  }

  return { init, setEnabled, isEnabled, sfx, startBGM, stopBGM };
})();
