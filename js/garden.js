/**
 * Vườn: lưới ô đất, trồng cây, tưới nước, bón phân, úng, lớn lên, thu hoạch
 */

const GARDEN_ROWS = 4;
const GARDEN_COLS = 5;
const CELL_COUNT = GARDEN_ROWS * GARDEN_COLS;

let gardenState = []; // mỗi ô: null hoặc { seedId, plantedAt, water, flood, growth, fertilizer }

function initGarden() {
  gardenState = [];
  for (let i = 0; i < CELL_COUNT; i++) {
    gardenState[i] = null;
  }
}

function getCell(index) {
  return gardenState[index] || null;
}

function getSeedConfig(seedId) {
  return SEEDS[seedId] || null;
}

function plantSeed(cellIndex, seedId) {
  if (cellIndex < 0 || cellIndex >= CELL_COUNT || gardenState[cellIndex]) return false;
  gardenState[cellIndex] = {
    seedId,
    plantedAt: Date.now(),
    water: 0,
    flood: 0,
    growth: 0,
    fertilizer: 0,
  };
  return true;
}

function waterCell(cellIndex) {
  const cell = gardenState[cellIndex];
  if (!cell) return false;
  cell.water = Math.min(100, cell.water + WATER_INCREASE_PER_USE);
  cell.flood = Math.min(100, cell.flood + FLOOD_INCREASE_PER_WATER);
  return true;
}

function fertilizeCell(cellIndex) {
  const cell = gardenState[cellIndex];
  if (!cell) return false;
  cell.growth = Math.min(100, cell.growth + FERTILIZER_GROWTH_BOOST);
  cell.fertilizer = (cell.fertilizer || 0) + 1;
  return true;
}

function isRaining() {
  return window.gameState && window.gameState.weather === 'rain';
}

function tickGarden(dtSeconds) {
  const state = window.gameState;
  const raining = state && state.weather === 'rain';

  for (let i = 0; i < CELL_COUNT; i++) {
    const cell = gardenState[i];
    if (!cell) continue;

    const config = getSeedConfig(cell.seedId);
    if (!config) continue;

    // Úng giảm dần
    cell.flood = Math.max(0, cell.flood - FLOOD_DECAY_PER_TICK * (dtSeconds / 10));
    // Chết vì úng
    if (cell.flood >= FLOOD_DEATH_THRESHOLD) {
      gardenState[i] = null;
      continue;
    }

    // Mưa: + nước và + úng
    if (raining) {
      cell.water = Math.min(100, cell.water + (RAIN_WATER_AMOUNT * dtSeconds / 60));
      cell.flood = Math.min(100, cell.flood + (RAIN_FLOOD_AMOUNT * dtSeconds / 60));
    }

    // Nước giảm dần (bay hơi)
    cell.water = Math.max(0, cell.water - (1.5 * dtSeconds / 60));

    // Tăng trưởng khi đủ nước và chưa chết
    if (cell.water >= DRY_THRESHOLD && cell.flood < FLOOD_DEATH_THRESHOLD) {
      const rate = GROWTH_PER_TICK_BASE * (1 + (cell.fertilizer || 0) * 0.1);
      cell.growth = Math.min(100, cell.growth + rate * (dtSeconds / 10));
    }
  }
}

function canHarvest(cell) {
  if (!cell) return false;
  return cell.growth >= 100 && cell.flood < FLOOD_DEATH_THRESHOLD;
}

function harvestCell(cellIndex) {
  const cell = gardenState[cellIndex];
  if (!cell || !canHarvest(cell)) return null;
  const config = getSeedConfig(cell.seedId);
  if (!config) return null;
  const product = { key: config.productKey, name: config.name, icon: config.icon, sellPrice: config.sellPrice };
  gardenState[cellIndex] = null;
  return product;
}

function getGrowthStage(cell) {
  if (!cell) return 0;
  const g = cell.growth;
  if (g >= 100) return 4;
  if (g >= 60) return 3;
  if (g >= 30) return 2;
  if (g >= 10) return 1;
  return 0;
}

function getCellIcon(cell) {
  if (!cell) return '🟫';
  const config = getSeedConfig(cell.seedId);
  if (!config) return '❓';
  const stage = getGrowthStage(cell);
  const icons = ['🌱', '🪴', '🌿', '🌳', config.icon];
  return icons[Math.min(stage, icons.length - 1)];
}

window.gardenState = gardenState;
