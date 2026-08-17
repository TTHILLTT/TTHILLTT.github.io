/* ========== 数字炸弹小游戏 ========== */
(function () {
  const CHEAT = '1e45141919810';

  const state = {
    min: 1,
    max: 100,
    bomb: 0,
    players: [],
    turn: 0,
  };

  const $ = (id) => document.getElementById(id);

  const el = {
    setup: $('nb-setup'),
    players: $('nb-players'),
    game: $('nb-game'),
    result: $('nb-result'),

    min: $('nb-min'),
    max: $('nb-max'),
    setupBtn: $('nb-setup-btn'),
    setupMsg: $('nb-setup-msg'),

    name: $('nb-name'),
    addBtn: $('nb-add-btn'),
    list: $('nb-list'),
    startBtn: $('nb-start-btn'),
    playersMsg: $('nb-players-msg'),

    range: $('nb-range'),
    remaining: $('nb-remaining'),
    turn: $('nb-turn'),
    guess: $('nb-guess'),
    guessBtn: $('nb-guess-btn'),
    msg: $('nb-msg'),
    history: $('nb-history'),

    winners: $('nb-winners'),
    loser: $('nb-loser'),
    restartBtn: $('nb-restart-btn'),
  };

  function show(panel) {
    [el.setup, el.players, el.game, el.result].forEach((p) => p.classList.toggle('hidden', p !== panel));
  }

  function setMsg(text, ok) {
    el.msg.textContent = text || '';
    el.msg.classList.toggle('ok', !!ok);
  }

  function setPlayersMsg(text) {
    el.playersMsg.textContent = text || '';
  }

  function setSetupMsg(text) {
    el.setupMsg.textContent = text || '';
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function renderRange() {
    el.range.textContent = `${state.min} ~ ${state.max}`;
    el.range.classList.remove('updated');
    void el.range.offsetWidth;
    el.range.classList.add('updated');
  }

  function renderTurn() {
    el.turn.textContent = `${state.players[state.turn]} 的回合`;
  }

  function setup() {
    const min = parseInt(el.min.value, 10);
    const max = parseInt(el.max.value, 10);
    if (isNaN(min) || isNaN(max) || min >= max) {
      setSetupMsg('请输入有效范围（最小数字需小于最大数字）');
      return;
    }
    state.min = min;
    state.max = max;
    state.players = [];
    state.turn = 0;
    el.list.innerHTML = '';
    el.name.value = '';
    setSetupMsg('');
    setPlayersMsg('');
    show(el.players);
    el.name.focus();
  }

  function addPlayer() {
    const name = el.name.value.trim();
    if (!name) {
      setPlayersMsg('请输入玩家名称');
      return;
    }
    if (state.players.indexOf(name) !== -1) {
      setPlayersMsg('该玩家已存在');
      return;
    }
    state.players.push(name);
    el.name.value = '';
    setPlayersMsg('');

    const nameSpan = document.createElement('span');
    nameSpan.className = 'nb-player-name';
    const avatar = document.createElement('span');
    avatar.className = 'nb-player-avatar';
    avatar.textContent = name.charAt(0).toUpperCase();
    const text = document.createElement('span');
    text.textContent = name;
    nameSpan.appendChild(avatar);
    nameSpan.appendChild(text);

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'nb-player-del';
    del.title = '移除玩家';
    del.textContent = '\u00d7';
    del.addEventListener('click', () => {
      const idx = state.players.indexOf(name);
      if (idx !== -1) state.players.splice(idx, 1);
      li.remove();
    });

    const li = document.createElement('li');
    li.className = 'nb-player';
    li.appendChild(nameSpan);
    li.appendChild(del);
    el.list.appendChild(li);
    el.name.focus();
  }

  function startGame() {
    if (state.players.length === 0) {
      setPlayersMsg('至少添加一名玩家');
      return;
    }
    state.bomb = Math.floor(Math.random() * (state.max - state.min + 1)) + state.min;
    state.turn = 0;
    el.history.innerHTML = '';
    el.remaining.textContent = state.players.length;
    renderRange();
    renderTurn();
    setMsg('');
    el.guess.value = '';
    show(el.game);
    el.guess.focus();
  }

  function addHistory(name, t) {
    const item = document.createElement('div');
    item.className = 'nb-h-item';
    item.innerHTML =
      `<b>${escapeHtml(name)}</b> 猜 <b>${t}</b>，范围缩小至 <span class="nb-h-range">${state.min} ~ ${state.max}</span>`;
    el.history.appendChild(item);
    el.history.scrollTop = el.history.scrollHeight;
  }

  function guess() {
    const raw = el.guess.value.trim();
    if (raw === CHEAT) {
      setMsg(`嘘～炸弹数字是: ${state.bomb}`, true);
      el.guess.value = '';
      return;
    }
    const t = parseInt(raw, 10);
    if (isNaN(t)) {
      setMsg('请输入数字');
      return;
    }
    if (t === state.bomb) {
      const loser = state.players[state.turn];
      const winners = state.players.filter((_, i) => i !== state.turn);
      el.loser.textContent = loser;
      el.winners.textContent = winners.length ? winners.join('、') : '无';
      el.guess.value = '';
      show(el.result);
      if (typeof window.shakeWindow === 'function') {
        window.shakeWindow(document.getElementById('numbomb'));
      }
      return;
    }
    if (t < state.min || t > state.max) {
      setMsg(`超出当前范围 ${state.min} ~ ${state.max}`);
      return;
    }
    if (t < state.bomb) {
      state.min = t + 1;
    } else {
      state.max = t - 1;
    }
    addHistory(state.players[state.turn], t);
    state.turn = (state.turn + 1) % state.players.length;
    setMsg('');
    el.guess.value = '';
    renderRange();
    renderTurn();
    el.guess.focus();
  }

  function restart() {
    show(el.setup);
    el.min.focus();
  }

  el.setupBtn.addEventListener('click', setup);
  el.addBtn.addEventListener('click', addPlayer);
  el.name.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPlayer();
    }
  });
  el.startBtn.addEventListener('click', startGame);
  el.guessBtn.addEventListener('click', guess);
  el.guess.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      guess();
    }
  });
  el.restartBtn.addEventListener('click', restart);
})();
