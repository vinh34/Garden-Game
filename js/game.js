/**
 * Game chính: state, thời tiết, tab, HUD, modal ô đất, tích hợp quét -> hạt giống -> trồng -> shop
 */

const TICK_INTERVAL_MS = 2000;
const WEATHER_CHANGE_MIN_MS = 60000;
const WEATHER_CHANGE_MAX_MS = 120000;

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

function setupTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
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

  await loadModel();
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
    if (typeof saveGameToServer === 'function' && typeof isLoggedIn === 'function' && isLoggedIn()) {
      saveGameToServer(data).then(() => {}).catch(() => {});
    }
  } catch (_) {}
}

function updateAccountUI() {
  const btnAccount = document.getElementById('btn-account');
  const accountInfo = document.getElementById('account-info');
  const accountEmail = document.getElementById('account-email');
  if (!btnAccount || !accountInfo) return;
  if (typeof isLoggedIn === 'function' && isLoggedIn()) {
    btnAccount.style.display = 'none';
    accountInfo.style.display = 'flex';
    if (accountEmail) accountEmail.textContent = getEmail ? getEmail() : '';
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
    if (typeof logout === 'function') logout();
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
        await register(email, password);
        authMessage.textContent = 'Đăng ký thành công. Tiến trình sẽ được lưu lên tài khoản.';
      } else {
        await login(email, password);
        const serverSave = await loadSaveFromServer();
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
  initGarden();
  if (typeof isLoggedIn === 'function' && isLoggedIn() && typeof loadSaveFromServer === 'function') {
    try {
      const serverSave = await loadSaveFromServer();
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
  setupModalClose();
  setupAuth();
  setupScan();

  setInterval(gameTick, TICK_INTERVAL_MS);
  setInterval(saveGame, 10000);
}

document.addEventListener('DOMContentLoaded', init);
