/* ═══════════════════════════════════════════════════════════════
   scene.js —— XINGLUGU 像素农场场景引擎 v2
   纯 Canvas 绘制，无外部资源。逻辑世界 960×540（16:9），
   以 cover 方式映射到实际画布，像素风格由 image-rendering 保证。
   v2 新增：4 方向自由移动 + 碰撞检测 + 种植/收获状态机
   ═══════════════════════════════════════════════════════════════ */
'use strict';

const WORLD_W = 960;
const WORLD_H = 540;

/* ---------- 星露谷大地色系调色板 ---------- */
const PAL = {
  skyTop:     '#5f9fd6',
  skyMid:     '#7ec8e3',
  skyLow:     '#92d3ea',
  skyBase:    '#aae2f0',
  sun:        '#ffdf6b',
  sunCore:    '#fff3b0',
  cloud:      '#ffffff',
  cloudShade: '#d9ecf5',
  mountFar:   '#6f9e5f',
  mountNear:  '#54834a',
  grass:      '#5ea24a',
  grassDark:  '#3f7a32',
  grassSpot:  '#4a8a3c',
  soil:       '#8a5a32',
  soilDark:   '#6e4522',
  soilLight:  '#9a6a3a',
  path:       '#b08a54',
  pathDark:   '#96713f',
  wood:       '#a0673c',
  woodDark:   '#7a4b26',
  woodLight:  '#c98a4b',
  roof:       '#b04a3a',
  roofDark:   '#8a3528',
  chimney:    '#8a5a32',
  window:     '#ffe9a8',
  door:       '#5f3d20',
  treeLeaf:   '#3f7a32',
  treeLeafL:  '#5e9e4e',
  treeLeafD:  '#2f5c26',
  trunk:      '#7a4b26',
  fence:      '#8a5a32',
  farmerHat:  '#ffcb00',
  farmerHair: '#6e4522',
  farmerSkin: '#f0c896',
  farmerShirt:'#3a6ea5',
  farmerPants:'#4a3520',
  farmerBoots:'#2b2018',
  chicken:    '#f5f0e6',
  chickenRed: '#d9534f',
  chickenBeak:'#e8a13c',
  pigBody:    '#f2a0b0',
  pigLight:   '#f7b8c4',
  pigDark:    '#d97a8c',
  pigNose:    '#c96a7c',
  pigHoof:    '#b85f70',
  firefly:    '#ffe9a8',
  gold:       '#ffcb00',
  seed:       '#e8a13c',
  textShade:  'rgba(43,32,24,.55)',
};

/* ---------- 农夫 12×20 精灵帧（字符图元） ----------
   H=草帽 h=头发 s=皮肤 S=衬衫(蓝) p=裤 b=靴 . 透明 */
const FARMER_FRAMES = {
  // 面向下（正面）
  stand: [
    '..HHHHHH..',
    '.HHHHHHHH.',
    'HHHHHHHHHH',
    'HHHHHHHHHH',
    '..HHHHHH..',
    '..ssssss..',
    '.ssssssss.',
    '.ssssssss.',
    '.s.ssss.s.',
    '..ssssss..',
    '...SSSS...',
    '..SSSSSS..',
    '.SSSSSSSS.',
    '.SSsSSsSS.',
    '...pppp...',
    '..pppppp..',
    '...pppp...',
    '...bbbb...',
    '...bbbb...',
    '..........',
  ],
  // 面向下行走 1（腿张开）
  walk1: [
    '..HHHHHH..',
    '.HHHHHHHH.',
    'HHHHHHHHHH',
    'HHHHHHHHHH',
    '..HHHHHH..',
    '..ssssss..',
    '.ssssssss.',
    '.ssssssss.',
    '.s.ssss.s.',
    '..ssssss..',
    '...SSSS...',
    '..SSSSSS..',
    '.SSSSSSSS.',
    '.SSsSSsSS.',
    '...pppp...',
    '..pp..pp..',
    '..bb..bb..',
    '..bb..bb..',
    '..........',
    '..........',
  ],
  // 面向下行走 2（腿合拢）
  walk2: [
    '..HHHHHH..',
    '.HHHHHHHH.',
    'HHHHHHHHHH',
    'HHHHHHHHHH',
    '..HHHHHH..',
    '..ssssss..',
    '.ssssssss.',
    '.ssssssss.',
    '.s.ssss.s.',
    '..ssssss..',
    '...SSSS...',
    '..SSSSSS..',
    '.SSSSSSSS.',
    '.SSsSSsSS.',
    '...pppp...',
    '..pppppp..',
    '...bbbb...',
    '...bbbb...',
    '..........',
    '..........',
  ],
  // 面向上（后脑勺）
  up: [
    '..HHHHHH..',
    '.HHHHHHHH.',
    'HHHHHHHHHH',
    'HHHHHHHHHH',
    '..HHHHHH..',
    '..hhhhhh..',
    '.hhhhhhhh.',
    '.hhhhhhhh.',
    '.hh.hh.hh.',
    '..hhhhhh..',
    '...SSSS...',
    '..SSSSSS..',
    '.SSSSSSSS.',
    '.SSSSSSSS.',
    '...pppp...',
    '..pppppp..',
    '...pppp...',
    '...bbbb...',
    '...bbbb...',
    '..........',
  ],
  // 面向上行走 1（腿张开）
  upwalk1: [
    '..HHHHHH..',
    '.HHHHHHHH.',
    'HHHHHHHHHH',
    'HHHHHHHHHH',
    '..HHHHHH..',
    '..hhhhhh..',
    '.hhhhhhhh.',
    '.hhhhhhhh.',
    '.hh.hh.hh.',
    '..hhhhhh..',
    '...SSSS...',
    '..SSSSSS..',
    '.SSSSSSSS.',
    '.SSSSSSSS.',
    '...pppp...',
    '..pp..pp..',
    '..bb..bb..',
    '..bb..bb..',
    '..........',
    '..........',
  ],
  // 面向上行走 2（腿合拢）
  upwalk2: [
    '..HHHHHH..',
    '.HHHHHHHH.',
    'HHHHHHHHHH',
    'HHHHHHHHHH',
    '..HHHHHH..',
    '..hhhhhh..',
    '.hhhhhhhh.',
    '.hhhhhhhh.',
    '.hh.hh.hh.',
    '..hhhhhh..',
    '...SSSS...',
    '..SSSSSS..',
    '.SSSSSSSS.',
    '.SSSSSSSS.',
    '...pppp...',
    '..pppppp..',
    '...bbbb...',
    '...bbbb...',
    '..........',
    '..........',
  ],
  // 弯腰干活（收获 / 播种共用）
  dig: [
    '..........',
    '..........',
    '..HHHHHH..',
    '.HHHHHHHH.',
    'HHHHHHHHHH',
    'HHHHHHHHHH',
    '..HHHHHH..',
    '..ssssss..',
    '.ssssssss.',
    '.ssssssss.',
    '..ssssss..',
    '...SSSS...',
    '..SSSSSS..',
    '.SSsSSsSS.',
    '...pppp...',
    '..pppppp..',
    '...bbbb...',
    '...bbbb...',
    '..........',
    '..........',
  ],
};

/* 鸡 8×8 精灵帧 */
const CHICKEN_FRAMES = {
  stand: [
    '..rrr...',
    '..www...',
    '.wwwww..',
    '.wwwww..',
    '.wowww..',
    '.wwwww..',
    '..w.w...',
    '..b.b...',
  ],
  peck: [
    '...rr...',
    '...ww...',
    '..wwww..',
    '..wwww..',
    '..wwow..',
    '..wwww..',
    '..w..w..',
    '..b..b..',
  ],
};

/* 小猪 12×11 精灵帧（俯视，p=身 n=鼻 b=蹄 q=卷尾） */
const PIG_FRAMES = {
  // 站立
  stand: [
    '..pppppp..',
    '.pppppppp.',
    'pppppppppp',
    'pppppppppp',
    'pppnpppppp',
    'pppppppppp',
    'pppppppppp',
    'pppppppppp',
    '.pppppppp.',
    '..b..b..b.',
    '..b..b..b.',
  ],
  // 走路（腿张开）
  walk1: [
    '..pppppp..',
    '.pppppppp.',
    'pppppppppp',
    'pppppppppp',
    'pppnpppppp',
    'pppppppppp',
    'pppppppppp',
    'pppppppppp',
    '.pppppppp.',
    '..bb..bb..',
    '..bb..bb..',
  ],
  // 走路（腿合拢）
  walk2: [
    '..pppppp..',
    '.pppppppp.',
    'pppppppppp',
    'pppppppppp',
    'pppnpppppp',
    'pppppppppp',
    'pppppppppp',
    'pppppppppp',
    '...pppp...',
    '...bbbb...',
    '...bbbb...',
  ],
  // 拱地（低头嗅）
  grub: [
    '..........',
    '..pppppp..',
    '.pppppppp.',
    'pppppppppp',
    'pppppppppp',
    'pppnpppppp',
    'pppppppppp',
    'pppppppppp',
    '...pppp...',
    '...bbbb...',
    '...bbbb...',
  ],
};

/* ---------- 工具函数 ---------- */
function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

/* 绘制字符图元精灵（颜色映射） */
function drawSprite(ctx, rows, x, y, scale, colors, flipX) {
  const h = rows.length * scale;
  const w = rows[0].length * scale;
  const cx = Math.round(x);
  const cy = Math.round(y);
  ctx.save();
  if (flipX) {
    ctx.translate(cx + w, cy);
    ctx.scale(-1, 1);
    ctx.translate(-cx, -cy);
  }
  for (let r = 0; r < rows.length; r++) {
    const line = rows[r];
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '.') continue;
      const color = colors[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(cx + c * scale, cy + r * scale, scale, scale);
    }
  }
  ctx.restore();
}

/* 像素圆（用离散块近似） */
function drawPixelCircle(ctx, cx, cy, radius, color) {
  ctx.fillStyle = color;
  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      if (x * x + y * y <= radius * radius + radius * 0.5) {
        ctx.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
      }
    }
  }
}

/* ---------- 菜单背景（傍晚农场远景） ---------- */
function renderMenuBackground(ctx, w, h, t) {
  const scale = Math.max(w / WORLD_W, h / WORLD_H);
  const ox = (w - WORLD_W * scale) / 2;
  const oy = (h - WORLD_H * scale) / 2;
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);

  // 傍晚天空色带
  const bands = ['#141834', '#232a4d', '#33294f', '#463055', '#5a3a52', '#6e4249'];
  const bandH = WORLD_H / bands.length;
  bands.forEach((c, i) => px(ctx, 0, i * bandH, WORLD_W, bandH + 1, c));

  // 星星
  const seedStars = 36;
  for (let i = 0; i < seedStars; i++) {
    const sx = (i * 137.508) % WORLD_W;
    const sy = ((i * 97.31) % (WORLD_H * 0.42));
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.8 + i * 1.7));
    if (tw > 0.55) {
      ctx.globalAlpha = tw;
      px(ctx, sx, sy, 2, 2, i % 3 === 0 ? '#bcd6ff' : '#ffffff');
      ctx.globalAlpha = 1;
    }
  }

  // 月亮
  drawPixelCircle(ctx, WORLD_W - 120, 92, 22, '#f8ecd0');
  drawPixelCircle(ctx, WORLD_W - 110, 86, 16, '#141834');

  // 远山剪影
  px(ctx, 0, 300, WORLD_W, 240, '#1d2438');
  hill(ctx, 60, 300, 300, 120, '#242c46');
  hill(ctx, 420, 320, 260, 110, '#202741');
  hill(ctx, 720, 300, 320, 130, '#242c46');

  // 草地剪影 + 树剪影
  px(ctx, 0, 400, WORLD_W, 140, '#16201f');
  silhouetteTree(ctx, 120, 380, 2);
  silhouetteTree(ctx, 800, 392, 2.2);
  silhouetteTree(ctx, 900, 400, 1.6);

  // 小木屋剪影（点窗光）
  px(ctx, 430, 330, 130, 90, '#10161c');
  px(ctx, 448, 310, 94, 26, '#10161c');   // 屋顶
  px(ctx, 452, 358, 22, 20, '#ffd977');   // 窗光
  px(ctx, 516, 358, 22, 20, '#ffd977');
  px(ctx, 470, 384, 52, 36, '#0c1014');   // 门

  // 萤火虫
  const flies = 14;
  for (let i = 0; i < flies; i++) {
    const fx = ((i * 173.4 + t * (8 + (i % 5) * 2)) % (WORLD_W + 40)) - 20;
    const fy = 300 + ((i * 61.7 + Math.sin(t * 0.9 + i) * 14) % 170);
    const glow = 0.35 + 0.45 * Math.sin(t * 2.2 + i * 2.3);
    ctx.globalAlpha = Math.max(0.15, glow);
    px(ctx, fx, fy, 3, 3, i % 2 ? '#ffe9a8' : '#fff6d8');
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function hill(ctx, x, baseY, width, height, color) {
  const steps = Math.max(4, Math.round(width / 14));
  ctx.fillStyle = color;
  for (let i = 0; i <= steps; i++) {
    const hx = x + (i / steps) * width;
    const ratio = Math.sin((i / steps) * Math.PI);
    const hy = baseY - ratio * height;
    ctx.fillRect(Math.round(hx), Math.round(hy), Math.ceil(width / steps) + 1, Math.round(baseY - hy));
  }
}

function silhouetteTree(ctx, x, baseY, s) {
  ctx.fillStyle = '#10161c';
  ctx.fillRect(x, baseY - 30 * s, 8 * s, 30 * s);
  drawPixelCircle(ctx, x + 4 * s, baseY - 40 * s, 22 * s, '#10161c');
  drawPixelCircle(ctx, x - 14 * s, baseY - 26 * s, 15 * s, '#10161c');
  drawPixelCircle(ctx, x + 20 * s, baseY - 26 * s, 15 * s, '#10161c');
}

/* ═══════════════════════════════════════════════════════════════
   FarmScene —— 游戏主场景 v2
   ═══════════════════════════════════════════════════════════════ */
class FarmScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = 0;
    this.running = false;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.last = performance.now();

    // 相机映射
    this.scale = 1;
    this.ox = 0;
    this.oy = 0;

    // 云
    this.clouds = [
      { x: 140, y: 86,  s: 1.1, v: 7 },
      { x: 520, y: 120, s: 0.85, v: 5 },
      { x: 760, y: 66,  s: 1.3, v: 9 },
    ];

    // 农田：4 列 × 3 行
    this.farmCols = 4;
    this.farmRows = 3;
    this.farmX = 560;
    this.farmY = 350;
    this.cellW = 58;
    this.cellH = 42;
    this.cells = [];
    for (let r = 0; r < this.farmRows; r++) {
      for (let c = 0; c < this.farmCols; c++) {
        this.cells.push({
          r, c,
          x: this.farmX + c * this.cellW,
          y: this.farmY + r * this.cellH,
          planted: false,      // 是否已播种
          stage: 0,            // 0..4 生长阶段
          growTime: 0,
          phase: Math.random() * 4,
          frozen: false,       // 调试钩子：强制成熟
        });
      }
    }

    // 农夫（玩家控制，自由移动）
    this.farmer = {
      x: 300, y: 470,
      face: 'down',           // down | up | side
      flip: false,
      frame: 'stand',
      animT: 0,
      action: 'idle',         // idle | dig | plant
      actionT: 0,
    };

    // 障碍物（碰撞盒，世界坐标 [x, y, w, h]）
    this.obstacles = [
      { x: 348, y: 318, w: 124, h: 74,   name: '房子' },   // 屋身
      { x: 72,  y: 300, w: 48,  h: 62,   name: '树' },     // 树 1
      { x: 676, y: 292, w: 48,  h: 62,   name: '树' },     // 树 2
      { x: 828, y: 306, w: 48,  h: 62,   name: '树' },     // 树 3
      { x: 416, y: 376, w: 16,  h: 108,  name: '围栏' },   // 左侧围栏
      { x: 640, y: 496, w: 68,  h: 20,   name: '围栏' },   // 底部围栏
    ];

    // 鸡
    this.chickens = [
      { x: 210, y: 468, dir: 1, peckT: 0, frame: 'stand', run: 0 },
      { x: 330, y: 478, dir: -1, peckT: 0, frame: 'stand', run: 0 },
    ];

    // 小猪（粉红，散步 + 拱地 + 被吓跑）
    this.pigs = [
      { x: 130, y: 452, dir: 1, animT: 0, frame: 'stand', run: 0, grubT: 0, grubLeft: 0, oinkCd: 0, hx: 130, hy: 452 },
      { x: 860, y: 448, dir: -1, animT: 0, frame: 'stand', run: 0, grubT: 0, grubLeft: 0, oinkCd: 0, hx: 860, hy: 448 },
      { x: 300, y: 508, dir: 1, animT: 0, frame: 'stand', run: 0, grubT: 0, grubLeft: 0, oinkCd: 0, hx: 300, hy: 508 },
    ];

    // 萤火虫（白天隐藏，保留用于氛围）
    this.fireflies = [];

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  /* 逻辑世界 → 画布映射（cover） */
  onResize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const dpr = this.dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.scale = Math.max(w / WORLD_W, h / WORLD_H);
    this.ox = (w - WORLD_W * this.scale) / 2;
    this.oy = (h - WORLD_H * this.scale) / 2;
  }

  /* 画布像素 → 世界坐标 */
  toWorld(cx, cy) {
    const rect = this.canvas.getBoundingClientRect();
    const pxX = cx - rect.left;
    const pxY = cy - rect.top;
    return {
      x: (pxX - this.ox) / this.scale,
      y: (pxY - this.oy) / this.scale,
    };
  }

  start() {
    this.running = true;
    this.last = performance.now();
  }

  stop() {
    this.running = false;
  }

  /* ---------- 移动（带碰撞，v2 新增） ---------- */
  move(dx, dy, dt) {
    const f = this.farmer;
    if (f.action === 'dig' || f.action === 'plant') return; // 干活时不能移动
    const speed = 130 * dt;
    const footHalf = 10;    // 脚部碰撞盒半宽
    const footOff = 60;     // sprite 高度（脚部 y = f.y + 60）

    // 更新朝向
    if (Math.abs(dx) > Math.abs(dy)) {
      f.face = 'side';
      f.flip = dx < 0;
    } else if (dy !== 0) {
      f.face = dy < 0 ? 'up' : 'down';
    }

    // X 轴移动
    if (dx !== 0) {
      const nx = f.x + dx * speed;
      const footY = f.y + footOff;
      if (this.canStand(nx + footHalf, footY) && this.canStand(nx - footHalf, footY)) {
        f.x = nx;
      }
    }
    // Y 轴移动
    if (dy !== 0) {
      const ny = f.y + dy * speed;
      const footY = ny + footOff;
      if (this.canStand(f.x + footHalf, footY) && this.canStand(f.x - footHalf, footY)) {
        f.y = ny;
      }
    }

    // 边界（基于脚部）
    f.x = Math.max(36, Math.min(WORLD_W - 36, f.x));
    f.y = Math.max(232, Math.min(WORLD_H - 64, f.y));

    // 移动动画
    if (dx !== 0 || dy !== 0) {
      f.animT += dt;
      const walkFrame = (Math.floor(f.animT * 4) % 2 === 0) ? '1' : '2';
      f.frame = (f.face === 'up' ? 'upwalk' : 'walk') + walkFrame;
    } else {
      f.frame = (f.face === 'up') ? 'up' : 'stand';
    }
  }

  /* 碰撞检测：(x, y) 是否可站立 —— x 是脚部中心水平位置，y 是脚部 y */
  canStand(x, y) {
    if (x < 30 || x > WORLD_W - 30 || y < 300 || y > WORLD_H - 18) return false;
    for (const ob of this.obstacles) {
      if (x >= ob.x - 4 && x <= ob.x + ob.w + 4 &&
          y >= ob.y - 2 && y <= ob.y + ob.h + 6) {
        return false;
      }
    }
    return true;
  }

  /* 靠近的农田格（交互用） */
  nearCell(maxDist) {
    const f = this.farmer;
    let best = null;
    let bestD = maxDist || 50;
    for (const cell of this.cells) {
      const cx = cell.x + this.cellW / 2;
      const cy = cell.y + this.cellH / 2;
      const d = Math.hypot(cx - f.x, cy - f.y);
      if (d < bestD) { bestD = d; best = cell; }
    }
    return best;
  }

  /* 播种 */
  plant(cell) {
    if (!cell || cell.planted) return false;
    cell.planted = true;
    cell.stage = 0;
    cell.growTime = 0;
    cell.frozen = false;
    return true;
  }

  /* 收获指定格，返回金币数；重置 */
  harvestCell(cell) {
    if (!cell || !cell.planted || cell.stage < 4) return 0;
    const gold = 10 + (cell.r + cell.c) % 3 * 5; // 10 / 15 / 20
    cell.planted = false;      // 回到翻耕空地
    cell.frozen = false;
    return gold;
  }

  /* 农夫做一个动作（弯腰干活） */
  doAction(type, dur) {
    const f = this.farmer;
    f.action = type;
    f.actionT = dur || 0.7;
    f.frame = 'dig';
  }

  update(dt) {
    this.time += dt;

    // 云
    for (const c of this.clouds) {
      c.x += c.v * dt;
      if (c.x > WORLD_W + 140) c.x = -140;
    }

    // 作物生长（约 16 秒一个完整周期）
    for (const cell of this.cells) {
      if (!cell.planted || cell.frozen) continue;
      cell.growTime += dt;
      const cycle = 16;
      const p = ((cell.growTime + cell.phase) % cycle) / cycle;
      if (p < 0.2) cell.stage = 0;
      else if (p < 0.4) cell.stage = 1;
      else if (p < 0.62) cell.stage = 2;
      else if (p < 0.82) cell.stage = 3;
      else cell.stage = 4;
    }

    // 农夫动作计时
    const f = this.farmer;
    if (f.action !== 'idle') {
      f.actionT -= dt;
      if (f.actionT <= 0) {
        f.action = 'idle';
        f.frame = (f.face === 'up') ? 'up' : 'stand';
      }
    }

    // 鸡（玩家靠近会跑开）
    for (const ch of this.chickens) {
      const d = Math.hypot(ch.x - f.x, ch.y - f.y);
      if (d < 60) {
        ch.run = 1;
        ch.dir = (ch.x > f.x) ? 1 : -1;
      } else {
        ch.run = Math.max(0, ch.run - dt * 0.5);
      }
      if (ch.run > 0) {
        ch.x += ch.dir * 70 * dt;
      } else {
        ch.peckT += dt;
        if (ch.peckT > 1.8) {
          ch.frame = ch.frame === 'stand' ? 'peck' : 'stand';
          ch.peckT = 0;
        }
        if (Math.random() < dt * 0.3) ch.dir *= -1;
        ch.x += ch.dir * 6 * dt;
      }
      ch.x = Math.max(150, Math.min(400, ch.x));
    }

    // 小猪：散步 / 拱地 / 玩家靠近跑开
    for (const p of this.pigs) {
      p.animT += dt;
      p.grubT += dt;
      if (p.oinkCd > 0) p.oinkCd -= dt;

      const d = Math.hypot(p.x - f.x, p.y - f.y);
      if (d < 62) {
        p.run = 1;
        p.dir = (p.x > f.x) ? 1 : -1;
      } else {
        p.run = Math.max(0, p.run - dt * 0.5);
      }

      if (p.run > 0) {
        p.x += p.dir * 66 * dt;
        p.y += Math.sin(p.animT * 8) * 8 * dt;
        p.frame = (Math.floor(p.animT * 5) % 2 === 0) ? 'walk1' : 'walk2';
      } else if (p.grubT > 4) {
        // 偶尔拱地（持续 1.2 秒）
        if (p.frame !== 'grub') {
          p.frame = 'grub';
          p.grubT = 0;
          p.grubLeft = 1.2;
        } else {
          p.grubLeft -= dt;
          if (p.grubLeft <= 0) { p.frame = 'stand'; p.grubT = 0; }
        }
      } else {
        // 悠闲散步（围绕 home 点）
        const ang = Math.sin(p.animT * 0.5 + p.hx) * 0.9;
        p.x += Math.cos(ang) * 12 * dt;
        p.y += Math.sin(ang * 1.3) * 8 * dt;
        p.frame = (Math.floor(p.animT * 4) % 2 === 0) ? 'walk1' : 'walk2';
        if (Math.random() < dt * 0.5) p.frame = 'stand';
      }

      // 约束范围 + 避开农田
      p.x = Math.max(70, Math.min(920, p.x));
      p.y = Math.max(396, Math.min(512, p.y));
      if (p.x > 545 && p.x < 850 && p.y > 340 && p.y < 482) {
        p.x = (p.hx < 500) ? Math.min(p.x, 544) : Math.max(p.x, 851);
      }
    }

    // 萤火虫
    if (this.fireflies.length === 0) {
      for (let i = 0; i < 10; i++) {
        this.fireflies.push({
          x: Math.random() * WORLD_W,
          y: 300 + Math.random() * 200,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.5) * 8,
          ph: Math.random() * 6.28,
        });
      }
    }
    for (const fl of this.fireflies) {
      fl.ph += dt * 1.6;
      fl.x += (fl.vx + Math.sin(fl.ph) * 10) * dt;
      fl.y += (fl.vy + Math.cos(fl.ph * 0.7) * 8) * dt;
      if (fl.x < -10) fl.x = WORLD_W + 10;
      if (fl.x > WORLD_W + 10) fl.x = -10;
      if (fl.y < 290) fl.y = 290;
      if (fl.y > 520) fl.y = 520;
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = '#2a4a2e';
    ctx.fillRect(0, 0, w, h);

    ctx.translate(this.ox, this.oy);
    ctx.scale(this.scale, this.scale);

    this.drawSky(ctx);
    this.drawSun(ctx);
    this.drawClouds(ctx);
    this.drawMountains(ctx);
    this.drawGround(ctx);
    this.drawPath(ctx);
    this.drawFence(ctx);
    this.drawFarmField(ctx);
    this.drawHouse(ctx);
    this.drawTrees(ctx);
    this.drawChickens(ctx);
    this.drawPigs(ctx);
    this.drawFarmer(ctx);
    this.drawFireflies(ctx);

    ctx.restore();
  }

  /* ---- 天空 ---- */
  drawSky(ctx) {
    const bands = [PAL.skyTop, PAL.skyMid, PAL.skyLow, PAL.skyBase];
    const bandH = 220 / bands.length;
    bands.forEach((c, i) => px(ctx, -10, i * bandH, WORLD_W + 20, bandH + 1, c));
  }

  drawSun(ctx) {
    const sx = 78, sy = 76, r = 30;
    ctx.fillStyle = PAL.sun;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + this.time * 0.2;
      const rx = sx + Math.cos(a) * (r + 10);
      const ry = sy + Math.sin(a) * (r + 10);
      px(ctx, rx - 3, ry - 3, 6, 6, PAL.sun);
    }
    drawPixelCircle(ctx, sx, sy, r, PAL.sun);
    drawPixelCircle(ctx, sx - 4, sy - 4, r - 7, PAL.sunCore);
  }

  drawClouds(ctx) {
    for (const c of this.clouds) {
      this.drawCloud(ctx, c.x, c.y, c.s);
    }
  }

  drawCloud(ctx, x, y, s) {
    const blobs = [
      [0, 10, 22], [22, 0, 26], [48, 8, 20], [30, 14, 24], [12, 4, 16],
    ];
    ctx.fillStyle = PAL.cloud;
    for (const [bx, by, br] of blobs) {
      drawPixelCircle(ctx, x + bx * s, y + by * s, br * s, PAL.cloud);
    }
    ctx.fillStyle = PAL.cloudShade;
    px(ctx, x + 8 * s, y + 26 * s, 52 * s, 6 * s, PAL.cloudShade);
  }

  drawMountains(ctx) {
    hill(ctx, -20, 300, 420, 120, PAL.mountFar);
    hill(ctx, 260, 310, 480, 140, PAL.mountNear);
    hill(ctx, 700, 300, 300, 100, PAL.mountFar);
  }

  /* ---- 地面 ---- */
  drawGround(ctx) {
    px(ctx, -10, 290, WORLD_W + 20, 260, PAL.grass);
    ctx.fillStyle = PAL.grassSpot;
    for (let i = 0; i < 46; i++) {
      const gx = (i * 73.7) % WORLD_W;
      const gy = 300 + ((i * 41.3) % 210);
      ctx.fillRect(Math.round(gx), Math.round(gy), 3, 7);
      ctx.fillRect(Math.round(gx) + 8, Math.round(gy) + 3, 3, 5);
    }
    ctx.fillStyle = PAL.grassDark;
    for (let i = 0; i < 30; i++) {
      const gx = (i * 91.3) % WORLD_W;
      const gy = 310 + ((i * 57.7) % 200);
      ctx.fillRect(Math.round(gx), Math.round(gy), 2, 6);
    }
  }

  /* ---- 小径 ---- */
  drawPath(ctx) {
    ctx.fillStyle = PAL.path;
    for (let i = 0; i < 26; i++) {
      const yy = 470 + i * 5;
      const half = 22 - i * 1.1;
      px(ctx, 470 - half, yy, half * 2, 6, i % 2 ? PAL.path : PAL.pathDark);
    }
  }

  /* ---- 围栏 ---- */
  drawFence(ctx) {
    const posts = [
      [420, 380], [420, 410], [420, 440], [420, 470],
      [640, 500], [660, 500], [680, 500], [700, 500],
    ];
    for (const [fx, fy] of posts) {
      px(ctx, fx, fy, 6, 20, PAL.fence);
      px(ctx, fx - 2, fy - 2, 10, 5, PAL.fence);
    }
    px(ctx, 418, 396, 14, 4, PAL.woodDark);
    px(ctx, 418, 430, 14, 4, PAL.woodDark);
  }

  /* ---- 农田 ---- */
  drawFarmField(ctx) {
    for (const cell of this.cells) {
      const { x, y } = cell;
      px(ctx, x, y, this.cellW, this.cellH, PAL.soilDark);
      px(ctx, x + 2, y + 2, this.cellW - 4, this.cellH - 4, PAL.soil);
      ctx.fillStyle = PAL.soilLight;
      for (let i = 0; i < 3; i++) {
        px(ctx, x + 4, y + 6 + i * 13, this.cellW - 8, 3, PAL.soilLight);
      }
      if (cell.planted) {
        this.drawCrop(ctx, cell);
      } else {
        // 未播种的空地：画一颗小种子提示
        px(ctx, x + this.cellW / 2 - 3, y + this.cellH / 2 - 2, 6, 4, PAL.seed);
      }
    }
  }

  drawCrop(ctx, cell) {
    const cx = cell.x + this.cellW / 2;
    const cy = cell.y + this.cellH / 2 + 8;
    const s = cell.stage;
    if (s === 0) {                                // 刚出芽
      px(ctx, cx - 2, cy - 6, 4, 6, PAL.treeLeafL);
      px(ctx, cx - 2, cy - 10, 4, 4, PAL.treeLeafL);
    } else if (s === 1) {                         // 幼苗
      px(ctx, cx - 6, cy - 12, 12, 12, PAL.treeLeaf);
      px(ctx, cx - 2, cy - 16, 4, 6, PAL.treeLeafL);
      px(ctx, cx - 10, cy - 6, 4, 6, PAL.treeLeaf);
    } else if (s === 2) {                         // 开花
      px(ctx, cx - 8, cy - 16, 16, 16, PAL.treeLeafL);
      px(ctx, cx - 2, cy - 22, 4, 6, PAL.treeLeaf);
      px(ctx, cx - 12, cy - 10, 4, 8, PAL.treeLeaf);
      px(ctx, cx - 2, cy - 8, 4, 4, '#ffe9a8');
    } else if (s === 3) {                         // 结果
      px(ctx, cx - 10, cy - 18, 20, 20, PAL.treeLeaf);
      px(ctx, cx - 2, cy - 24, 4, 8, PAL.treeLeafL);
      px(ctx, cx - 14, cy - 8, 6, 10, PAL.gold);
      px(ctx, cx + 8, cy - 8, 6, 10, PAL.gold);
    } else {                                      // 成熟（金色）
      px(ctx, cx - 10, cy - 18, 20, 20, PAL.gold);
      px(ctx, cx - 2, cy - 24, 4, 8, '#c99a00');
      px(ctx, cx - 14, cy - 8, 6, 10, '#c99a00');
      px(ctx, cx + 8, cy - 8, 6, 10, '#c99a00');
      px(ctx, cx - 4, cy - 20, 3, 3, '#fff3b0');
    }
  }

  /* ---- 小木屋 ---- */
  drawHouse(ctx) {
    const hx = 330, hy = 250;
    px(ctx, hx + 96, hy - 34, 16, 44, PAL.chimney);
    px(ctx, hx + 96, hy - 40, 16, 8, PAL.woodDark);
    ctx.fillStyle = PAL.roof;
    for (let i = 0; i < 7; i++) {
      px(ctx, hx + 6 - i * 8, hy + i * 10, 148 + i * 16, 10, i % 2 ? PAL.roof : PAL.roofDark);
    }
    px(ctx, hx + 18, hy + 68, 124, 74, PAL.wood);
    for (let r = 0; r < 6; r++) {
      px(ctx, hx + 18, hy + 68 + r * 12, 124, 12, r % 2 ? PAL.woodDark : PAL.wood);
    }
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    for (let i = 0; i < 5; i++) {
      px(ctx, hx + 18 + i * 26, hy + 68, 3, 74);
    }
    px(ctx, hx + 40, hy + 92, 26, 24, PAL.window);
    px(ctx, hx + 94, hy + 92, 26, 24, PAL.window);
    ctx.fillStyle = PAL.woodDark;
    px(ctx, hx + 52, hy + 92, 3, 24);
    px(ctx, hx + 106, hy + 92, 3, 24);
    px(ctx, hx + 66, hy + 106, 30, 36, PAL.door);
    px(ctx, hx + 90, hy + 122, 4, 4, PAL.gold);
  }

  /* ---- 树 ---- */
  drawTrees(ctx) {
    this.tree(ctx, 96, 330, 1.05);
    this.tree(ctx, 700, 322, 1.2);
    this.tree(ctx, 852, 336, 0.9);
  }

  tree(ctx, x, baseY, s) {
    px(ctx, x - 4 * s, baseY - 34 * s, 8 * s, 34 * s, PAL.trunk);
    px(ctx, x - 6 * s, baseY - 8 * s, 12 * s, 8 * s, PAL.trunk);
    ctx.fillStyle = PAL.treeLeafD;
    drawPixelCircle(ctx, x, baseY - 52 * s, 24 * s, PAL.treeLeafD);
    ctx.fillStyle = PAL.treeLeaf;
    drawPixelCircle(ctx, x, baseY - 58 * s, 19 * s, PAL.treeLeaf);
    ctx.fillStyle = PAL.treeLeafL;
    drawPixelCircle(ctx, x - 3 * s, baseY - 62 * s, 12 * s, PAL.treeLeafL);
    px(ctx, x - 12 * s, baseY - 66 * s, 6 * s, 6 * s, '#7cc04f');
    px(ctx, x + 2 * s, baseY - 70 * s, 5 * s, 5 * s, '#7cc04f');
    ctx.fillStyle = PAL.gold;
    px(ctx, x - 8 * s, baseY - 48 * s, 4 * s, 4 * s, PAL.gold);
    px(ctx, x + 6 * s, baseY - 44 * s, 4 * s, 4 * s, PAL.gold);
  }

  /* ---- 鸡 ---- */
  drawChickens(ctx) {
    const colors = { r: PAL.chickenRed, w: PAL.chicken, o: PAL.chickenBeak, b: PAL.chickenRed };
    for (const ch of this.chickens) {
      const rows = CHICKEN_FRAMES[ch.frame];
      drawSprite(ctx, rows, ch.x, ch.y, 3, colors, ch.dir < 0);
    }
  }

  /* ---- 小猪 ---- */
  drawPigs(ctx) {
    const colors = {
      p: PAL.pigBody, n: PAL.pigNose, b: PAL.pigHoof,
    };
    for (const pg of this.pigs) {
      const rows = PIG_FRAMES[pg.frame] || PIG_FRAMES.stand;
      // 影子
      ctx.fillStyle = 'rgba(0,0,0,.2)';
      ctx.fillRect(Math.round(pg.x + 1), Math.round(pg.y + 30), 34, 7);
      // 身体高光 + 卷尾
      drawSprite(ctx, rows, pg.x, pg.y, 3, colors, pg.dir < 0);
      // 卷尾（侧边小圈）
      const tailX = pg.dir < 0 ? Math.round(pg.x + 6) : Math.round(pg.x + 26);
      ctx.fillStyle = PAL.pigLight;
      ctx.fillRect(tailX, Math.round(pg.y + 6), 4, 4);
      ctx.fillRect(tailX + (pg.dir < 0 ? -2 : 2), Math.round(pg.y + 8), 4, 4);
    }
  }

  /* ---- 农夫 ---- */
  drawFarmer(ctx) {
    const f = this.farmer;
    const colors = {
      H: PAL.farmerHat, h: PAL.farmerHair, s: PAL.farmerSkin,
      S: PAL.farmerShirt, p: PAL.farmerPants, b: PAL.farmerBoots,
    };
    const rows = FARMER_FRAMES[f.frame] || FARMER_FRAMES.stand;
    // 行走时身体轻微起伏（配合迈步）
    const walking = f.frame.indexOf('walk') >= 0;
    const bob = walking && f.frame.endsWith('2') ? -1 : 0;
    // 影子（保持贴地）
    ctx.fillStyle = 'rgba(0,0,0,.22)';
    ctx.fillRect(Math.round(f.x + 2), Math.round(f.y + 54), 34, 8);
    // 侧面朝向时水平翻转
    const flip = f.face === 'side' ? f.flip : false;
    drawSprite(ctx, rows, f.x, f.y + bob, 3, colors, flip);
  }

  /* ---- 萤火虫 ---- */
  drawFireflies(ctx) {
    for (const fl of this.fireflies) {
      const glow = 0.3 + 0.5 * Math.abs(Math.sin(fl.ph));
      ctx.globalAlpha = Math.max(0.12, glow);
      px(ctx, fl.x, fl.y, 3, 3, PAL.firefly);
      ctx.globalAlpha = 1;
    }
  }
}

/* 供 main.js 使用 */
window.FarmScene = FarmScene;
window.renderMenuBackground = renderMenuBackground;
window.PAL = PAL;
