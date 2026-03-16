/**
 * Game chính: state, thời tiết, tab, HUD, modal ô đất, tích hợp quét -> hạt giống -> trồng -> shop
 */

const TICK_INTERVAL_MS = 2000;
const WEATHER_CHANGE_MIN_MS = 60000;
const WEATHER_CHANGE_MAX_MS = 120000;
const QUIZ_DAILY_KEY = 'vuon_trai_cay_quiz_daily';
const QUIZ_MAX_CORRECT_PER_DAY = 10;
const QUIZ_REWARD_MONEY = 15;

let gameState = {
  money: 100,
  scanCount: 5,
  water: 3,
  fertilizer: 2,
  seeds: {},   // { seedId: count }
  products: [], // [{ key, name, icon, sellPrice }]
  weather: 'sun', // 'sun' | 'rain'
  nextWeatherAt: 0,
};

window.gameState = gameState;

function updateHUD() {
  const s = gameState;
  const moneyEl = document.getElementById('money');
  const scanEl = document.getElementById('scan-count');
  const waterEl = document.getElementById('water-count');
  const fertEl = document.getElementById('fertilizer-count');
  if (moneyEl) moneyEl.textContent = s.money;
  if (scanEl) scanEl.textContent = s.scanCount;
  if (waterEl) waterEl.textContent = s.water;
  if (fertEl) fertEl.textContent = s.fertilizer;

  const weatherEl = document.getElementById('weather');
  if (weatherEl) {
    weatherEl.classList.toggle('raining', s.weather === 'rain');
    weatherEl.querySelector('.weather-icon').textContent = s.weather === 'rain' ? '🌧️' : '☀️';
    weatherEl.querySelector('.weather-text').textContent = s.weather === 'rain' ? 'Mưa' : 'Nắng';
  }
}

function addSeed(seedId, count = 1) {
  gameState.seeds[seedId] = (gameState.seeds[seedId] || 0) + count;
}

function useSeed(seedId) {
  const n = gameState.seeds[seedId] || 0;
  if (n <= 0) return false;
  gameState.seeds[seedId] = n - 1;
  return true;
}

function addProduct(product) {
  gameState.products.push(product);
}

function sellProduct(index) {
  if (index < 0 || index >= gameState.products.length) return;
  const p = gameState.products.splice(index, 1)[0];
  gameState.money += p.sellPrice || 0;
}

function gameTick() {
  const now = Date.now();
  const dt = (now - (gameState.lastTick || now)) / 1000;
  gameState.lastTick = now;

  if (gameState.nextWeatherAt && now >= gameState.nextWeatherAt) {
    gameState.weather = gameState.weather === 'sun' ? 'rain' : 'sun';
    gameState.nextWeatherAt = now + WEATHER_CHANGE_MIN_MS + Math.random() * (WEATHER_CHANGE_MAX_MS - WEATHER_CHANGE_MIN_MS);
  } else if (!gameState.nextWeatherAt) {
    gameState.nextWeatherAt = now + WEATHER_CHANGE_MIN_MS + Math.random() * (WEATHER_CHANGE_MAX_MS - WEATHER_CHANGE_MIN_MS);
  }

  tickGarden(dt);
  updateHUD();
  renderGarden();
}

function renderGarden() {
  const grid = document.getElementById('garden-grid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < CELL_COUNT; i++) {
    const cell = getCell(i);
    const div = document.createElement('div');
    div.className = 'cell ' + (cell ? 'planted' : 'empty');
    div.dataset.index = i;
    const icon = document.createElement('span');
    icon.className = 'cell-icon';
    icon.textContent = getCellIcon(cell);
    div.appendChild(icon);
    if (cell && cell.flood > 0) {
      const floodBar = document.createElement('div');
      floodBar.className = 'flood-bar';
      floodBar.style.width = cell.flood + '%';
      div.appendChild(floodBar);
    }
    if (cell && cell.water > 0) {
      const waterBar = document.createElement('div');
      waterBar.className = 'water-bar';
      waterBar.style.width = cell.water + '%';
      div.appendChild(waterBar);
    }
    div.addEventListener('click', () => openCellModal(i));
    grid.appendChild(div);
  }
}

function openCellModal(cellIndex) {
  const cell = getCell(cellIndex);
  const modal = document.getElementById('cell-modal');
  const body = document.getElementById('modal-body');
  if (!modal || !body) return;

  if (!cell) {
    const seedsAvailable = Object.entries(gameState.seeds).filter(([, n]) => n > 0);
    body.innerHTML = `
      <h3>Ô đất trống</h3>
      <p>Chọn hạt giống để trồng:</p>
      <div class="modal-actions" id="modal-plant-choices"></div>
    `;
    const wrap = body.querySelector('#modal-plant-choices');
    seedsAvailable.forEach(([seedId, count]) => {
      const cfg = getSeedConfig(seedId);
      if (!cfg) return;
      const btn = document.createElement('button');
      btn.className = 'btn btn-plant';
      btn.textContent = `${cfg.icon} ${cfg.name} (${count})`;
      btn.onclick = () => {
        if (!useSeed(seedId)) return;
        plantSeed(cellIndex, seedId);
        modal.classList.remove('active');
        renderGarden();
        updateHUD();
        renderInventory();
      };
      wrap.appendChild(btn);
    });
    if (seedsAvailable.length === 0) {
      body.innerHTML = '<h3>Ô đất trống</h3><p>Bạn chưa có hạt giống. Hãy quét camera trái cây hoặc cây để nhận hạt!</p>';
    }
  } else {
    const config = getSeedConfig(cell.seedId);
    const name = config ? config.name : cell.seedId;
    const icon = config ? config.icon : '🌱';
    const canHarvestNow = canHarvest(cell);

    let actionsHtml = '';
    if (canHarvestNow) {
      actionsHtml += '<button class="btn btn-harvest" id="btn-harvest">Thu hoạch</button>';
    } else {
      if (gameState.water > 0) {
        actionsHtml += '<button class="btn btn-water" id="btn-water">💧 Tưới nước</button>';
      }
      if (gameState.fertilizer > 0) {
        actionsHtml += '<button class="btn btn-fertilize" id="btn-fertilize">🌱 Bón phân</button>';
      }
    }

    body.innerHTML = `
      <h3>${icon} ${name}</h3>
      <div class="bar-label">Độ ẩm</div>
      <div class="bar-wrap"><div class="bar-fill water" style="width:${cell.water}%"></div></div>
      <div class="bar-label">Úng nước (≥${FLOOD_DEATH_THRESHOLD}% cây chết)</div>
      <div class="bar-wrap"><div class="bar-fill flood" style="width:${cell.flood}%"></div></div>
      <div class="bar-label">Lớn lên</div>
      <div class="bar-wrap"><div class="bar-fill growth" style="width:${cell.growth}%"></div></div>
      <div class="modal-actions">${actionsHtml}</div>
    `;

    body.querySelector('#btn-water')?.addEventListener('click', () => {
      if (gameState.water <= 0) return;
      gameState.water--;
      waterCell(cellIndex);
      updateHUD();
      openCellModal(cellIndex);
    });
    body.querySelector('#btn-fertilize')?.addEventListener('click', () => {
      if (gameState.fertilizer <= 0) return;
      gameState.fertilizer--;
      fertilizeCell(cellIndex);
      updateHUD();
      openCellModal(cellIndex);
    });
    body.querySelector('#btn-harvest')?.addEventListener('click', () => {
      const product = harvestCell(cellIndex);
      if (product) {
        addProduct(product);
        renderInventory();
      }
      modal.classList.remove('active');
      renderGarden();
      updateHUD();
    });
  }

  modal.classList.add('active');
}

function renderInventory() {
  const seedsEl = document.getElementById('seeds-list');
  const productsEl = document.getElementById('products-list');
  if (!seedsEl || !productsEl) return;

  seedsEl.innerHTML = Object.entries(gameState.seeds)
    .filter(([, n]) => n > 0)
    .map(([seedId, n]) => {
      const cfg = getSeedConfig(seedId);
      const name = cfg ? cfg.name : seedId;
      const icon = cfg ? cfg.icon : '🌱';
      return `<span class="seed-chip">${icon} ${name} × ${n}</span>`;
    })
    .join('') || '<span class="text-muted">Chưa có hạt. Quét camera để nhận!</span>';

  productsEl.innerHTML = gameState.products.map((p, i) => `
    <span class="product-chip">
      ${p.icon} ${p.name}
      <span class="sell-price">+${p.sellPrice}💰</span>
      <button class="btn" style="padding:4px 8px;font-size:0.8rem" data-sell-index="${i}">Bán</button>
    </span>
  `).join('');

  productsEl.querySelectorAll('[data-sell-index]').forEach((btn) => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.sellIndex, 10);
      sellProduct(idx);
      renderInventory();
      updateHUD();
    };
  });
}


function removeLegacyTopQuizButton() {
  const legacyTopQuizBtn = document.querySelector('.hud-right #btn-quiz');
  if (legacyTopQuizBtn) legacyTopQuizBtn.remove();
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      if (target === 'quiz') {
        if (typeof window.openQuizModal === 'function') window.openQuizModal();
        return;
      }

      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
      if (target === 'shop') renderShop();
      if (target === 'inventory') renderInventory();
    });
  });
}


function setupIndexCatalog() {
  const btnIndex = document.getElementById('btn-index');
  const indexModal = document.getElementById('index-modal');
  const indexClose = document.getElementById('index-modal-close');
  const indexBody = document.getElementById('index-seeds-body');

  if (!btnIndex || !indexModal || !indexClose || !indexBody) return;
  if (btnIndex.dataset.boundIndex === '1') return;

  btnIndex.dataset.boundIndex = '1';

  const seedsData = (typeof SEEDS !== 'undefined' && SEEDS) || window.SEEDS || {};
  const rows = Object.entries(seedsData)
    .sort((a, b) => (a[1]?.name || a[0]).localeCompare((b[1]?.name || b[0]), 'vi'))
    .map(([seedId, cfg]) => {
      const icon = cfg?.icon || '🌱';
      const name = cfg?.name || seedId;
      const growTime = typeof cfg?.growTime === 'number' ? cfg.growTime : '-';
      const sellPrice = typeof cfg?.sellPrice === 'number' ? `${cfg.sellPrice} 💰` : '-';
      return `
        <tr>
          <td>${icon}</td>
          <td>${name}</td>
          <td><code>${seedId}</code></td>
          <td>${growTime}</td>
          <td>${sellPrice}</td>
        </tr>
      `;
    })
    .join('');

  indexBody.innerHTML = rows || '<tr><td colspan="5">Chưa có dữ liệu cây.</td></tr>';

  btnIndex.addEventListener('click', () => indexModal.classList.add('active'));
  indexClose.addEventListener('click', () => indexModal.classList.remove('active'));
  indexModal.addEventListener('click', (e) => {
    if (e.target === indexModal) indexModal.classList.remove('active');
  });
}


function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getQuizDailyState() {
  const today = getTodayKey();
  try {
    const raw = localStorage.getItem(QUIZ_DAILY_KEY);
    const state = raw ? JSON.parse(raw) : null;
    if (state && state.date === today && Number.isFinite(state.correctCount)) {
      return { date: today, correctCount: Math.max(0, Math.min(QUIZ_MAX_CORRECT_PER_DAY, state.correctCount)) };
    }
  } catch (_) {}
  return { date: today, correctCount: 0 };
}

function setQuizDailyState(state) {
  localStorage.setItem(QUIZ_DAILY_KEY, JSON.stringify(state));
}

function setupQuiz() {
  const tabQuiz = document.getElementById('tab-quiz');
  const quizModal = document.getElementById('quiz-modal');
  const quizClose = document.getElementById('quiz-modal-close');
  const quizMeta = document.getElementById('quiz-meta');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const quizMessage = document.getElementById('quiz-message');
  const quizNext = document.getElementById('quiz-next');

  if (!tabQuiz || !quizModal || !quizClose || !quizMeta || !quizQuestion || !quizOptions || !quizMessage || !quizNext) return;
  if (tabQuiz.dataset.boundQuiz === '1') return;
  tabQuiz.dataset.boundQuiz = '1';

  const questions = (window.QUIZ_QUESTIONS || []).filter((q) => q && q.question && Array.isArray(q.options) && q.options.length === 4);
  let currentQuestion = null;

  function renderQuestion() {
    const state = getQuizDailyState();
    const left = QUIZ_MAX_CORRECT_PER_DAY - state.correctCount;
    quizMeta.textContent = `Lượt đúng còn lại hôm nay: ${left}/${QUIZ_MAX_CORRECT_PER_DAY} · Mỗi câu đúng +${QUIZ_REWARD_MONEY}💰`;

    if (!questions.length) {
      quizQuestion.textContent = 'Chưa có dữ liệu câu hỏi.';
      quizOptions.innerHTML = '';
      quizNext.disabled = true;
      return;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[randomIndex];
    quizQuestion.textContent = currentQuestion.question;
    quizOptions.innerHTML = currentQuestion.options
      .map((opt, i) => {
        const key = ['A', 'B', 'C', 'D'][i];
        return `<button type="button" class="btn quiz-option" data-quiz-option="${key}"><strong>${key}.</strong> ${opt}</button>`;
      })
      .join('');

    if (left <= 0) {
      quizMessage.textContent = 'Bạn đã hết 10 lượt thưởng hôm nay. Quay lại ngày mai nhé!';
      quizMessage.className = 'quiz-message error';
      quizOptions.querySelectorAll('[data-quiz-option]').forEach((btn) => { btn.disabled = true; });
    }

    quizOptions.querySelectorAll('[data-quiz-option]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const latest = getQuizDailyState();
        const remaining = QUIZ_MAX_CORRECT_PER_DAY - latest.correctCount;
        if (remaining <= 0) {
          quizMessage.textContent = 'Bạn đã hết lượt nhận thưởng hôm nay.';
          quizMessage.className = 'quiz-message error';
          return;
        }

        const picked = btn.dataset.quizOption;

        if (picked === currentQuestion.answer) {
          latest.correctCount += 1;
          setQuizDailyState(latest);
          gameState.money += QUIZ_REWARD_MONEY;
          updateHUD();
          const leftNow = QUIZ_MAX_CORRECT_PER_DAY - latest.correctCount;
          quizMeta.textContent = `Lượt đúng còn lại hôm nay: ${leftNow}/${QUIZ_MAX_CORRECT_PER_DAY} · Mỗi câu đúng +${QUIZ_REWARD_MONEY}💰`;
          quizMessage.textContent = `Chính xác! +${QUIZ_REWARD_MONEY}💰, còn ${leftNow} lượt hôm nay.`;
          quizMessage.className = 'quiz-message success';
          quizOptions.querySelectorAll('[data-quiz-option]').forEach((b) => { b.disabled = true; });
        } else {
          quizMessage.textContent = `Sai rồi! Bạn không bị trừ lượt, vẫn còn ${remaining} lượt hôm nay. Bạn có thể chọn lại.`;
          quizMessage.className = 'quiz-message error';
        }
      });
    });
  }

  function openQuizModal() {
    quizMessage.textContent = '';
    quizMessage.className = 'quiz-message';
    renderQuestion();
    quizModal.classList.add('active');
  }

  window.openQuizModal = openQuizModal;
  quizClose.addEventListener('click', () => quizModal.classList.remove('active'));
  quizModal.addEventListener('click', (e) => {
    if (e.target === quizModal) quizModal.classList.remove('active');
  });
  quizNext.addEventListener('click', () => {
    quizMessage.textContent = '';
    quizMessage.className = 'quiz-message';
    renderQuestion();
  });
}

function setupModalClose() {
  document.getElementById('modal-close')?.addEventListener('click', () => {
    document.getElementById('cell-modal')?.classList.remove('active');
  });
  document.getElementById('cell-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'cell-modal') e.target.classList.remove('active');
  });
  document.getElementById('plant-info-close')?.addEventListener('click', closePlantInfoModal);
  document.getElementById('plant-info-ok')?.addEventListener('click', closePlantInfoModal);
  document.getElementById('plant-info-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'plant-info-modal') closePlantInfoModal();
  });
}

function showPlantInfoPopup(seedId) {
  const info = getPlantInfo(seedId);
  const seed = getSeedConfig(seedId);
  const name = seed ? seed.name : seedId;
  const icon = seed ? seed.icon : '🌱';
  const body = document.getElementById('plant-info-body');
  const modal = document.getElementById('plant-info-modal');
  if (!body || !modal) return;
  if (!info) {
    body.innerHTML = '<p>Không có thông tin bổ sung cho loại này.</p>';
  } else {
    body.innerHTML =
      '<div class="plant-info-title">' + icon + ' ' + name + '</div>' +
      '<div class="plant-info-meta"><strong>Tên khoa học:</strong> ' + info.scientificName + '<br><strong>Họ:</strong> ' + info.family + '</div>' +
      '<div class="plant-info-section"><h4>🌱 Cách trồng ngoài đời</h4><p>' + info.planting + '</p></div>' +
      '<div class="plant-info-section"><h4>🔬 Thông tin khoa học</h4><p>' + info.scientific + '</p></div>';
  }
  modal.classList.add('active');
}

function closePlantInfoModal() {
  document.getElementById('plant-info-modal')?.classList.remove('active');
}

async function setupScan() {
  const video = document.getElementById('camera-video');
  const btn = document.getElementById('btn-scan');
  const resultEl = document.getElementById('scan-result');
  if (!video || !btn || !resultEl) return;

  // Tải AI: MobileNet + COCO-SSD
  await loadModel();
  if (typeof loadDetector === 'function') {
    try { await loadDetector(); } catch (_) {}
  }
  btn.textContent = 'Quét';
  btn.disabled = false;

  const fileInput = document.getElementById('scan-file-input');
  const btnUpload = document.getElementById('btn-upload-image');
  const imagePreview = document.getElementById('scan-image-preview');
  const cameraContainer = document.querySelector('.camera-container');
  if (btnUpload) btnUpload.disabled = false;
  if (btnUpload && fileInput) {
    btnUpload.addEventListener('click', function () { fileInput.click(); });
    fileInput.addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      if (gameState.scanCount <= 0) {
        resultEl.innerHTML = '<span class="error">Hết lượt quét! Mua thêm tại cửa hàng.</span>';
        resultEl.classList.add('error');
        return;
      }
      gameState.scanCount--;
      updateHUD();
      resultEl.textContent = 'Đang nhận diện...';
      resultEl.classList.remove('success', 'error');
      btnUpload.disabled = true;
      var reader = new FileReader();
      reader.onload = function (ev) {
        var dataUrl = ev.target.result;
        imagePreview.src = dataUrl;
        imagePreview.style.display = 'block';
        if (cameraContainer) cameraContainer.classList.add('has-image');
        var img = new Image();
        img.onload = function () {
          recognizeFromImage(img).then(function (rec) {
            if (rec) {
              addSeed(rec.seedId, 1);
              resultEl.innerHTML = '<span class="success">Nhận diện: ' + rec.icon + ' ' + rec.name + '. Bạn nhận được 1 hạt giống!</span>';
              resultEl.classList.add('success');
              renderInventory();
              showPlantInfoPopup(rec.seedId);
            } else {
              resultEl.innerHTML = '<span class="error">Không nhận diện được trái cây/cây. Thử ảnh khác!</span>';
              resultEl.classList.add('error');
              gameState.scanCount++;
              updateHUD();
            }
          }).catch(function (err) {
            resultEl.innerHTML = '<span class="error">Lỗi: ' + (err.message || 'Thử lại') + '</span>';
            resultEl.classList.add('error');
            gameState.scanCount++;
            updateHUD();
          }).then(function () {
            btnUpload.disabled = false;
            fileInput.value = '';
          });
        };
        img.onerror = function () {
          resultEl.innerHTML = '<span class="error">Không đọc được ảnh.</span>';
          resultEl.classList.add('error');
          gameState.scanCount++;
          updateHUD();
          btnUpload.disabled = false;
          fileInput.value = '';
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  }

  let stream = null;
  const tabScan = document.querySelector('.tab[data-tab="scan"]');
  const panelScan = document.getElementById('panel-scan');

  function onScanTabActive() {
    if (!panelScan.classList.contains('active')) return;
    if (cameraContainer) {
      cameraContainer.classList.remove('has-image');
      if (imagePreview) imagePreview.style.display = 'none';
    }
    startCamera(video).then((s) => { stream = s; }).catch(() => {
      resultEl.innerHTML = '<span class="error">Không thể mở camera. Kiểm tra quyền truy cập. Dùng nút &quot;Chọn ảnh&quot; bên dưới.</span>';
    });
  }

  function onScanTabInactive() {
    if (stream) {
      stopCamera(stream);
      stream = null;
    }
  }

  tabScan?.addEventListener('click', () => {
    setTimeout(onScanTabActive, 100);
  });
  document.querySelectorAll('.tab').forEach((t) => {
    t.addEventListener('click', () => {
      if (t.dataset.tab !== 'scan') onScanTabInactive();
    });
  });

  btn.addEventListener('click', async () => {
    if (gameState.scanCount <= 0) {
      resultEl.innerHTML = '<span class="error">Hết lượt quét! Mua thêm tại cửa hàng.</span>';
      resultEl.classList.add('error');
      return;
    }
    gameState.scanCount--;
    updateHUD();
    btn.disabled = true;
    resultEl.textContent = 'Đang nhận diện...';
    resultEl.classList.remove('success', 'error');

    try {
      const rec = await recognizeFromVideo(video);
      if (rec) {
        addSeed(rec.seedId, 1);
        resultEl.innerHTML = `<span class="success">Nhận diện: ${rec.icon} ${rec.name}. Bạn nhận được 1 hạt giống!</span>`;
        resultEl.classList.add('success');
        renderInventory();
        showPlantInfoPopup(rec.seedId);
      } else {
        resultEl.innerHTML = '<span class="error">Không nhận diện được trái cây/cây. Thử hướng camera rõ hơn!</span>';
        resultEl.classList.add('error');
        gameState.scanCount++;
        updateHUD();
      }
    } catch (err) {
      resultEl.innerHTML = '<span class="error">Lỗi: ' + (err.message || 'Thử lại') + '</span>';
      resultEl.classList.add('error');
      gameState.scanCount++;
      updateHUD();
    }
    btn.disabled = false;
  });
}

function getSaveData() {
  return {
    state: {
      money: gameState.money,
      scanCount: gameState.scanCount,
      water: gameState.water,
      fertilizer: gameState.fertilizer,
      seeds: gameState.seeds,
      products: gameState.products,
      weather: gameState.weather,
      nextWeatherAt: gameState.nextWeatherAt,
    },
    garden: (window.gardenState || []).map((c) => c ? { ...c } : null),
  };
}

function applySave(data) {
  if (!data) return;
  try {
    if (data.state) Object.assign(gameState, data.state);
    if (data.garden && Array.isArray(data.garden) && window.gardenState) {
      const g = window.gardenState;
      g.length = 0;
      data.garden.forEach((c) => g.push(c));
    }
  } catch (_) {}
}

function loadSave() {
  try {
    const raw = localStorage.getItem('vuon_trai_cay_save');
    if (!raw) return;
    applySave(JSON.parse(raw));
  } catch (_) {}
}

function saveGame() {
  try {
    const data = getSaveData();
    localStorage.setItem('vuon_trai_cay_save', JSON.stringify(data));
    if (typeof window.saveGameToServer === 'function' && typeof window.isLoggedIn === 'function' && window.isLoggedIn()) {
      window.saveGameToServer(data).then(() => {}).catch(() => {});
    }
  } catch (_) {}
}

function updateAccountUI() {
  const btnAccount = document.getElementById('btn-account');
  const accountInfo = document.getElementById('account-info');
  const accountEmail = document.getElementById('account-email');
  if (!btnAccount || !accountInfo) return;
  if (typeof window.isLoggedIn === 'function' && window.isLoggedIn()) {
    btnAccount.style.display = 'none';
    accountInfo.style.display = 'flex';
    if (accountEmail) accountEmail.textContent = window.getEmail ? window.getEmail() : '';
  } else {
    btnAccount.style.display = 'inline-block';
    accountInfo.style.display = 'none';
  }
}

async function setupAuth() {
  const authModal = document.getElementById('auth-modal');
  const authClose = document.getElementById('auth-modal-close');
  const btnAccount = document.getElementById('btn-account');
  const btnLogout = document.getElementById('btn-logout');
  const authForm = document.getElementById('auth-form');
  const authEmail = document.getElementById('auth-email');
  const authPassword = document.getElementById('auth-password');
  const authMessage = document.getElementById('auth-message');
  const authSubmit = document.getElementById('auth-submit');
  const authTitle = document.getElementById('auth-title');
  let currentTab = 'login';

  function setAuthTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.auth-tab').forEach((t) => t.classList.toggle('active', t.dataset.authTab === tab));
    authTitle.textContent = tab === 'login' ? 'Đăng nhập' : 'Đăng ký';
    authSubmit.textContent = tab === 'login' ? 'Đăng nhập' : 'Đăng ký';
    authMessage.textContent = '';
  }

  document.querySelectorAll('.auth-tab').forEach((t) => {
    t.addEventListener('click', () => setAuthTab(t.dataset.authTab));
  });

  authClose?.addEventListener('click', () => authModal?.classList.remove('active'));
  authModal?.addEventListener('click', (e) => { if (e.target === authModal) authModal.classList.remove('active'); });

  btnAccount?.addEventListener('click', () => {
    setAuthTab('login');
    authMessage.textContent = '';
    authModal?.classList.add('active');
  });

  btnLogout?.addEventListener('click', () => {
    if (typeof window.logout === 'function') window.logout();
    updateAccountUI();
  });

  authForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = authEmail?.value?.trim() || '';
    const password = authPassword?.value || '';
    authMessage.textContent = 'Đang xử lý...';
    authMessage.classList.remove('success', 'error');
    authSubmit.disabled = true;
    try {
      if (currentTab === 'register') {
        const registerFn = window.register;
        if (typeof registerFn !== 'function') throw new Error('Tính năng đăng ký chưa sẵn sàng. Vui lòng tải lại trang.');
        const registerResult = await registerFn(email, password);
        authMessage.textContent = registerResult?.requiresEmailConfirmation
          ? 'Đăng ký thành công. Vui lòng xác thực email rồi đăng nhập.'
          : 'Đăng ký thành công. Tiến trình sẽ được lưu lên tài khoản.';
      } else {
        const loginFn = window.login;
        if (typeof loginFn !== 'function') throw new Error('Tính năng đăng nhập chưa sẵn sàng. Vui lòng tải lại trang.');
        await loginFn(email, password);
        const serverSave = await window.loadSaveFromServer();
        if (serverSave) applySave(serverSave); else loadSave();
        renderGarden();
        renderInventory();
        renderShop();
        updateHUD();
        authMessage.textContent = 'Đăng nhập thành công. Đã tải tiến trình đã lưu.';
      }
      authMessage.classList.add('success');
      updateAccountUI();
      setTimeout(() => { authModal?.classList.remove('active'); }, 1200);
    } catch (err) {
      authMessage.textContent = err.message || 'Có lỗi xảy ra';
      authMessage.classList.add('error');
    }
    authSubmit.disabled = false;
  });

  updateAccountUI();
}

async function init() {
  if (typeof window.initAuth === 'function') await window.initAuth();
  initGarden();
  if (typeof window.isLoggedIn === 'function' && window.isLoggedIn() && typeof window.loadSaveFromServer === 'function') {
    try {
      const serverSave = await window.loadSaveFromServer();
      if (serverSave) applySave(serverSave); else loadSave();
    } catch (_) {
      loadSave();
    }
  } else {
    loadSave();
  }
  updateHUD();
  renderGarden();
  renderShop();
  renderInventory();
  setupTabs();
  removeLegacyTopQuizButton();
  setupModalClose();
  setupIndexCatalog();
  setupAuth();
  setupQuiz();
  setupScan();

  setInterval(gameTick, TICK_INTERVAL_MS);
  setInterval(saveGame, 10000);
}

document.addEventListener('DOMContentLoaded', setupIndexCatalog);
document.addEventListener('DOMContentLoaded', init);
