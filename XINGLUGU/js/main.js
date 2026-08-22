/* ═══════════════════════════════════════════════════════════════
   main.js —— XINGLUGU 主控制逻辑 v2
   菜单 / 加载 / 游戏三态切换。v2 新增：
   - 4 方向自由移动（WASD / 方向键）
   - 播种 / 收获上下文交互（空格 / E / 点击）
   - 种子商店（B / 按钮）
   - 任务目标系统 + HUD 状态显示
   ═══════════════════════════════════════════════════════════════ */
'use strict';

(() => {
  /* ---------- DOM ---------- */
  const $ = (id) => document.getElementById(id);
  const bgCanvas   = $('bgCanvas');
  const mainMenu   = $('mainMenu');
  const loadingSc  = $('loadingScreen');
  const gameScreen = $('gameScreen');
  const gameCanvas = $('gameCanvas');
  const hudDate    = $('hudDate');
  const hudGold    = $('hudGold');
  const hudEnergy  = $('hudEnergy');
  const hudSeeds   = $('hudSeeds');
  const hudTask    = $('hudTask');
  const energyFill = $('energyFill');
  const dialogBox  = $('dialogBox');
  const dialogName = $('dialogName');
  const dialogText = $('dialogText');
  const dialogNext = $('dialogNext');
  const floatArea  = $('floatArea');
  const soundLabel = $('soundLabel');
  const btnSound   = $('btnSound');
  const helpModal  = $('helpModal');
  const aboutModal = $('aboutModal');
  const shopModal  = $('shopModal');
  const shopSeeds  = $('shopSeeds');
  const shopGold   = $('shopGold');
  const progressFill = $('progressFill');
  const loadingText  = $('loadingText');

  /* ---------- 状态 ---------- */
  let farmScene = null;
  let bgAnimId = 0;
  let gameAnimId = 0;
  let gold = 50;          // 初始 50 G
  let seeds = 3;          // 初始 3 颗种子
  let day = 1;
  let energy = 100;
  let dialogQueue = [];
  let typingTimer = null;
  let lastDialogShown = false;
  let currentFullText = '';
  let task = null;        // { type: 'plant'|'harvest', count, done }
  let hintTimer = null;

  /* ═══════════════ 菜单背景动画 ═══════════════ */
  function startMenuBg() {
    const ctx = bgCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      bgCanvas.width = Math.round(window.innerWidth * dpr);
      bgCanvas.height = Math.round(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener('resize', resize);
    cancelAnimationFrame(bgAnimId);
    const loop = (now) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderMenuBackground(ctx, window.innerWidth, window.innerHeight, now / 1000);
      bgAnimId = requestAnimationFrame(loop);
    };
    bgAnimId = requestAnimationFrame(loop);
  }

  function stopMenuBg() {
    cancelAnimationFrame(bgAnimId);
  }

  /* ═══════════════ 模态管理 ═══════════════ */
  function openModal(modal) {
    modal.hidden = false;
    const btn = modal.querySelector('.pixel-btn');
    if (btn) btn.focus();
  }
  function closeModal(modal) {
    modal.hidden = true;
  }
  function closeAllModals() {
    closeModal(helpModal);
    closeModal(aboutModal);
    closeModal(shopModal);
  }

  [helpModal, aboutModal, shopModal].forEach((m) => {
    m.addEventListener('click', (e) => { if (e.target === m) closeModal(m); });
  });
  $('helpClose').addEventListener('click', () => closeModal(helpModal));
  $('aboutClose').addEventListener('click', () => closeModal(aboutModal));

  /* ═══════════════ 菜单事件 ═══════════════ */
  function showScreen(screen) {
    [mainMenu, loadingSc, gameScreen].forEach((s) => { s.hidden = true; });
    screen.hidden = false;
  }

  $('btnStart').addEventListener('click', () => {
    XLAudio.init();
    XLAudio.sfx.click();
    XLAudio.sfx.start();
    startLoading();
  });

  btnSound.addEventListener('click', () => {
    XLAudio.init();
    const next = !XLAudio.isEnabled();
    XLAudio.setEnabled(next);
    XLAudio.sfx.toggle();
    soundLabel.textContent = next ? '开' : '关';
    btnSound.setAttribute('aria-pressed', String(next));
  });

  $('btnHelp').addEventListener('click', () => {
    XLAudio.init();
    XLAudio.sfx.click();
    openModal(helpModal);
  });

  $('btnAbout').addEventListener('click', () => {
    XLAudio.init();
    XLAudio.sfx.click();
    openModal(aboutModal);
  });

  /* ═══════════════ 加载流程 ═══════════════ */
  const LOAD_TIPS = [
    '正在播种春天……',
    '正在给小鸡喂食……',
    '正在打扫谷仓……',
    '正在浇灌农田……',
    '马上就出发啦！',
  ];

  function startLoading() {
    showScreen(loadingSc);
    stopMenuBg();
    progressFill.style.width = '0%';
    const start = performance.now();
    const iv = setInterval(() => {
      const p = Math.min(100, ((performance.now() - start) / 2400) * 100); // 约 2.4 秒
      progressFill.style.width = p + '%';
      loadingText.textContent = LOAD_TIPS[Math.min(LOAD_TIPS.length - 1, Math.floor(p / 20))];
      if (p >= 100) {
        clearInterval(iv);
        loadingText.textContent = '欢迎来到 XINGLUGU 农场！';
        setTimeout(enterGame, 350);
      }
    }, 100);
  }

  /* ═══════════════ 进入游戏 ═══════════════ */
  function enterGame() {
    showScreen(gameScreen);
    gold = 50;
    seeds = 3;
    day = 1;
    energy = 100;
    newTask('harvest', 3);
    updateHud();

    if (!farmScene) {
      farmScene = new FarmScene(gameCanvas);
    }
    farmScene.start();

    dialogQueue = [
      { name: '爷爷', text: '欢迎来到 XINGLUGU 农场！用 WASD / 方向键自由走动。' },
      { name: '爷爷', text: '走到农田旁，按 空格 或 E 播种，作物成熟后同样收获。' },
      { name: '爷爷', text: '按 B 可以打开商店买种子。先完成第一个小任务吧！' },
    ];
    showNextDialog();
    startGameLoop();
    XLAudio.startBGM();
  }

  /* ═══════════════ 任务系统 ═══════════════ */
  function newTask(type, count) {
    task = { type, count, done: 0 };
    updateTaskHud();
  }

  function updateTaskHud() {
    if (!task) { hudTask.textContent = ''; return; }
    const label = task.type === 'plant' ? '播种' : '收获';
    hudTask.textContent = `任务：${label} ${task.count} 个作物 (${task.done}/${task.count})`;
  }

  function taskProgress(type) {
    if (!task || task.type !== type) return;
    task.done += 1;
    updateTaskHud();
    if (task.done >= task.count) {
      const reward = 25;
      gold += reward;
      updateHud();
      dialogQueue.push({
        name: '任务完成',
        text: `太棒了！任务完成，奖励 ${reward} G！继续加油！`,
      });
      showNextDialog();
      newTask(type === 'plant' ? 'harvest' : 'plant', 3 + Math.floor(Math.random() * 3));
    }
  }

  /* ═══════════════ 游戏循环 ═══════════════ */
  function startGameLoop() {
    cancelAnimationFrame(gameAnimId);
    let last = performance.now();
    let dayTimer = 0;
    let energyRegen = 0;

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // 玩家移动（读取按键状态）
      let dx = 0, dy = 0;
      if (keys.up) dy -= 1;
      if (keys.down) dy += 1;
      if (keys.left) dx -= 1;
      if (keys.right) dx += 1;
      if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }
      if (farmScene && (dx !== 0 || dy !== 0)) {
        farmScene.move(dx, dy, dt);
      }

      farmScene.update(dt);
      farmScene.draw();
      updateInteractHint();

      // 日期推进（每 90 秒一天）
      dayTimer += dt;
      if (dayTimer >= 90) { dayTimer = 0; day += 1; }
      hudDate.textContent = '春 ' + day + ' 日';

      // 体力缓慢恢复
      if (energy < 100) {
        energyRegen += dt;
        if (energyRegen >= 1.2) { energyRegen = 0; energy = Math.min(100, energy + 1); }
        updateHud();
      }

      gameAnimId = requestAnimationFrame(loop);
    };
    gameAnimId = requestAnimationFrame(loop);
  }

  function updateHud() {
    hudGold.textContent = gold + ' G';
    hudSeeds.textContent = '×' + seeds;
    hudEnergy.textContent = Math.round(energy) + '%';
    energyFill.style.width = energy + '%';
  }

  /* ═══════════════ 交互提示（靠近可操作格） ═══════════════ */
  let hintEl = null;
  function updateInteractHint() {
    if (!farmScene) return;
    const cell = farmScene.nearCell(52);
    let hint = '';
    if (cell) {
      if (!cell.planted) {
        hint = seeds > 0 ? '按 空格/E 播种' : '种子用完了，按 B 去商店买';
      } else if (cell.stage >= 4) {
        hint = '按 空格/E 收获';
      } else {
        hint = '作物还在生长中…';
      }
    } else if (nearShop()) {
      hint = '按 B 打开商店';
    }
    if (hint !== (hintEl && hintEl.textContent)) {
      if (!hintEl) {
        hintEl = document.createElement('div');
        hintEl.className = 'interact-hint';
        gameScreen.appendChild(hintEl);
      }
      hintEl.textContent = hint;
      hintEl.hidden = !hint;
    }

    // 靠近小猪 → 猪哼一声（带冷却）
    if (farmScene.pigs) {
      const f = farmScene.farmer;
      for (const p of farmScene.pigs) {
        if (p.oinkCd <= 0 && Math.hypot(p.x - f.x, p.y - f.y) < 62) {
          XLAudio.sfx.oink();
          p.oinkCd = 3.2;
        }
      }
    }
  }

  function nearShop() {
    if (!farmScene) return false;
    const f = farmScene.farmer;
    return Math.hypot(f.x - 470, f.y - 480) < 90;
  }

  /* ═══════════════ RPG 对话框（打字机） ═══════════════ */
  function showNextDialog() {
    clearInterval(typingTimer);
    if (dialogQueue.length === 0) {
      dialogBox.hidden = true;
      return;
    }
    const msg = dialogQueue.shift();
    dialogBox.hidden = false;
    if (msg.name) {
      dialogName.hidden = false;
      dialogName.textContent = '◆ ' + msg.name;
    } else {
      dialogName.hidden = true;
    }
    dialogText.textContent = '';
    lastDialogShown = false;
    const full = msg.text;
    currentFullText = full;
    let i = 0;
    typingTimer = setInterval(() => {
      if (i < full.length) {
        dialogText.textContent += full[i];
        i += 1;
        if (i % 2 === 0) XLAudio.sfx.dialog();
      } else {
        clearInterval(typingTimer);
        lastDialogShown = true;
      }
    }, 32);
  }

  function advanceDialog() {
    if (typingTimer) {
      clearInterval(typingTimer);
      typingTimer = null;
      dialogText.textContent = currentFullText;
      lastDialogShown = true;
      return;
    }
    showNextDialog();
  }

  dialogNext.addEventListener('click', () => {
    XLAudio.sfx.click();
    advanceDialog();
  });

  /* ═══════════════ 播种 / 收获 ═══════════════ */
  function interact() {
    if (!farmScene || gameScreen.hidden) return;
    const cell = farmScene.nearCell(52);

    if (cell && !cell.planted) {
      // 播种
      if (seeds <= 0) {
        XLAudio.sfx.toggle();
        dialogQueue.push({ name: '提示', text: '没有种子啦！按 B 打开商店购买（5 G/颗）。' });
        showNextDialog();
        return;
      }
      if (energy < 5) {
        XLAudio.sfx.toggle();
        dialogQueue.push({ name: '提示', text: '体力不足，休息一下再种吧。' });
        showNextDialog();
        return;
      }
      farmScene.plant(cell);
      seeds -= 1;
      energy -= 5;
      XLAudio.sfx.harvest();
      farmScene.doAction('plant', 0.65);
      taskProgress('plant');
      updateHud();
    } else if (cell && cell.stage >= 4) {
      // 收获
      const reward = farmScene.harvestCell(cell);
      if (reward > 0) {
        gold += reward;
        energy = Math.max(0, energy - 3);
        XLAudio.sfx.harvest();
        farmScene.doAction('dig', 0.65);
        spawnCoin(reward, cell);
        taskProgress('harvest');
        updateHud();
        if (energy <= 0) {
          energy = 100;
          dialogQueue.push({ name: '爷爷', text: '累坏了吧？休息一下，体力恢复啦！' });
          showNextDialog();
        }
      }
    } else if (nearShop()) {
      openShop();
    } else {
      XLAudio.sfx.click();
    }
  }

  /* 点击画布同样触发（世界坐标命中格） */
  gameCanvas.addEventListener('click', (e) => {
    if (!farmScene || gameScreen.hidden) return;
    const wp = farmScene.toWorld(e.clientX, e.clientY);
    let idx = -1;
    farmScene.cells.forEach((cell, i) => {
      if (idx >= 0) return;
      if (wp.x >= cell.x && wp.x <= cell.x + farmScene.cellW &&
          wp.y >= cell.y && wp.y <= cell.y + farmScene.cellH) {
        idx = i;
      }
    });
    if (idx < 0) { XLAudio.sfx.click(); return; }
    // 点击命中格：把农夫走过去交互（简化：直接执行该格操作）
    const cell = farmScene.cells[idx];
    farmScene.farmer.x = cell.x + farmScene.cellW / 2;
    farmScene.farmer.y = cell.y + farmScene.cellH;
    interact();
  });

  function spawnCoin(amount, cell) {
    const el = document.createElement('span');
    el.className = 'float-coin';
    el.textContent = '+' + amount + ' G';
    const wp = farmScene.toWorld(
      cell.x + farmScene.cellW / 2,
      cell.y + farmScene.cellH / 2
    );
    const rect = gameScreen.getBoundingClientRect();
    el.style.left = wp.x + 'px';
    el.style.top = wp.y + 'px';
    floatArea.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  /* ═══════════════ 商店 ═══════════════ */
  function openShop() {
    shopSeeds.textContent = seeds;
    shopGold.textContent = gold + ' G';
    openModal(shopModal);
    XLAudio.sfx.click();
  }

  $('shopBuy1').addEventListener('click', () => buySeeds(1));
  $('shopBuy5').addEventListener('click', () => buySeeds(5));
  $('shopClose').addEventListener('click', () => closeModal(shopModal));

  function buySeeds(n) {
    const cost = 5 * n;
    if (gold < cost) {
      XLAudio.sfx.toggle();
      shopGold.textContent = '金币不足！';
      return;
    }
    gold -= cost;
    seeds += n;
    XLAudio.sfx.coin();
    shopSeeds.textContent = seeds;
    shopGold.textContent = gold + ' G';
    updateHud();
  }

  /* ═══════════════ 键盘控制 ═══════════════ */
  const keys = { up: false, down: false, left: false, right: false };

  window.addEventListener('keydown', (e) => {
    const modalOpen = !helpModal.hidden || !aboutModal.hidden || !shopModal.hidden;
    if (modalOpen) {
      if (e.key === 'Escape') { closeAllModals(); e.preventDefault(); }
      return;
    }
    const k = e.key.toLowerCase();
    switch (k) {
      case 'w': case 'arrowup':    keys.up = true;    e.preventDefault(); break;
      case 's': case 'arrowdown':  keys.down = true;  e.preventDefault(); break;
      case 'a': case 'arrowleft':  keys.left = true;  e.preventDefault(); break;
      case 'd': case 'arrowright': keys.right = true; e.preventDefault(); break;
      case ' ':
        e.preventDefault();
        if (!gameScreen.hidden) interact();
        else if (!dialogBox.hidden) advanceDialog();
        break;
      case 'e':
        if (!gameScreen.hidden) interact();
        break;
      case 'b':
        if (!gameScreen.hidden) openShop();
        break;
      case 'm':
        XLAudio.init();
        const next = !XLAudio.isEnabled();
        XLAudio.setEnabled(next);
        XLAudio.sfx.toggle();
        soundLabel.textContent = next ? '开' : '关';
        btnSound.setAttribute('aria-pressed', String(next));
        break;
      case 'escape':
        if (!gameScreen.hidden) backToMenu();
        break;
    }
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') keys.up = false;
    if (k === 's' || k === 'arrowdown') keys.down = false;
    if (k === 'a' || k === 'arrowleft') keys.left = false;
    if (k === 'd' || k === 'arrowright') keys.right = false;
  });

  /* ═══════════════ 返回菜单 ═══════════════ */
  function backToMenu() {
    XLAudio.sfx.click();
    if (farmScene) farmScene.stop();
    XLAudio.stopBGM();
    if (hintEl) { hintEl.remove(); hintEl = null; }
    showScreen(mainMenu);
    startMenuBg();
  }

  $('btnBack').addEventListener('click', backToMenu);

  /* ═══════════════ 启动 ═══════════════ */
  function boot() {
    startMenuBg();
    try {
      const saved = localStorage.getItem('xinglugu_sound');
      if (saved !== null) {
        const on = saved === '1';
        soundLabel.textContent = on ? '开' : '关';
        btnSound.setAttribute('aria-pressed', String(on));
        XLAudio.setEnabled(on);
      }
    } catch (e) { /* ignore */ }
  }

  boot();

  /* 调试钩子（控制台可用） */
  window.__xlDebug = {
    getScene: () => farmScene,
    getState: () => ({ gold, seeds, day, energy, task }),
    ripeAll: () => {
      if (!farmScene) return false;
      farmScene.cells.forEach((c) => {
        c.planted = true;
        c.stage = 4;
        c.frozen = true;
      });
      return true;
    },
    plantAll: () => {
      if (!farmScene) return false;
      farmScene.cells.forEach((c) => farmScene.plant(c));
      return true;
    },
    harvestAll: () => {
      if (!farmScene) return 0;
      let total = 0;
      for (const c of farmScene.cells) {
        const r = farmScene.harvestCell(c);
        total += r;
      }
      gold += total;
      updateHud();
      return total;
    },
  };
})();
