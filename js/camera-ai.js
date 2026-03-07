/**
 * Camera + AI nhận diện trái cây/cây bằng MobileNet (TensorFlow.js).
 * Nâng cấp: ưu tiên COCO-SSD (object detection) để giảm nhận nhầm trái cây/cây,
 * rồi fallback qua MobileNet (classification) nếu không chắc.
 */

let model = null;
let isModelLoading = false;

let detector = null; // coco-ssd
let isDetectorLoading = false;

// AI server (Python) – ưu tiên nếu cấu hình window.AI_API_BASE
const AI_SERVER_TIMEOUT_MS = 6500;

// Ngưỡng tin cậy để hạn chế nhận sai
const COCO_MIN_SCORE = 0.55;
const MOBILENET_MIN_PROB = 0.28;

async function loadModel() {
  if (model) return model;
  if (isModelLoading) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (model) { clearInterval(check); resolve(model); }
      }, 100);
    });
  }
  isModelLoading = true;
  try {
    model = await mobilenet.load({ version: 2, alpha: 0.5 });
    return model;
  } finally {
    isModelLoading = false;
  }
}

async function loadDetector() {
  if (detector) return detector;
  if (isDetectorLoading) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (detector) { clearInterval(check); resolve(detector); }
      }, 100);
    });
  }
  isDetectorLoading = true;
  try {
    // lite_mobilenet_v2 nhanh hơn, đủ tốt cho trái cây
    detector = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
    return detector;
  } finally {
    isDetectorLoading = false;
  }
}

function getSeedFromPredictions(predictions) {
  if (!predictions || !predictions.length) return null;
  const lower = (s) => (s || '').toLowerCase();
  for (const p of predictions) {
    const name = lower(p.className);
    for (const row of CLASSNAME_TO_SEED) {
      const seedId = row[row.length - 1];
      for (let i = 0; i < row.length - 1; i++) {
        if (name.includes(lower(row[i])) && SEEDS[seedId]) {
          if (p.probability >= MOBILENET_MIN_PROB) return { seedId, confidence: p.probability };
        }
      }
    }
  }
  return null;
}

function getSeedFromDetections(detections) {
  if (!detections || !detections.length) return null;
  // detections: [{class, score, bbox}, ...]
  // Chọn detection phù hợp có score cao nhất
  const sorted = [...detections].sort((a, b) => (b.score || 0) - (a.score || 0));
  for (const d of sorted) {
    const cls = (d.class || '').toLowerCase();
    const seedId = COCO_TO_SEED[cls];
    if (seedId && SEEDS[seedId] && (d.score || 0) >= COCO_MIN_SCORE) {
      return { seedId, confidence: d.score };
    }
  }
  return null;
}

function getAiServerBase() {
  const base = (window.AI_API_BASE || '').trim();
  return base ? base.replace(/\/+$/, '') : '';
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

async function recognizeViaServerBlob(imageBlob) {
  const base = getAiServerBase();
  if (!base) return null;
  const fd = new FormData();
  fd.append('image', imageBlob, 'scan.jpg');
  const res = await fetchWithTimeout(base + '/predict', { method: 'POST', body: fd }, AI_SERVER_TIMEOUT_MS);
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  if (!data || !data.ok || !data.prediction || !data.prediction.seedId) return null;
  const seedId = data.prediction.seedId;
  const seed = SEEDS[seedId];
  if (!seed) return null;
  return {
    seedId,
    name: seed.name,
    icon: seed.icon,
    confidence: data.prediction.confidence || 0,
    source: 'python-yolo',
  };
}

function videoFrameToBlob(video) {
  return new Promise((resolve) => {
    try {
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, w, h);
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    } catch (_) {
      resolve(null);
    }
  });
}

/**
 * Chụp frame từ video, chạy MobileNet, trả về { seedId, name, icon } hoặc null
 */
async function recognizeFromVideo(video) {
  // 0) Ưu tiên AI server Python (nếu cấu hình)
  try {
    const blob = await videoFrameToBlob(video);
    if (blob) {
      const viaServer = await recognizeViaServerBlob(blob);
      if (viaServer) return viaServer;
    }
  } catch (_) {}

  // 1) Ưu tiên object detection (đỡ nhầm trái cây/cây)
  try {
    const det = await loadDetector();
    const detections = await det.detect(video);
    const hit = getSeedFromDetections(detections);
    if (hit) {
      const seed = SEEDS[hit.seedId];
      return { seedId: hit.seedId, name: seed.name, icon: seed.icon, confidence: hit.confidence, source: 'coco-ssd' };
    }
  } catch (_) {
    // nếu detector lỗi, fallback MobileNet
  }

  // 2) Fallback classification
  const net = await loadModel();
  const predictions = await net.classify(video, 5);
  const result = getSeedFromPredictions(predictions);
  if (!result) return null;
  const seed = SEEDS[result.seedId];
  return {
    seedId: result.seedId,
    name: seed.name,
    icon: seed.icon,
    confidence: result.confidence,
    source: 'mobilenet',
  };
}

/**
 * Nhận diện từ ảnh (HTMLImageElement). Trả về cùng format với recognizeFromVideo.
 */
async function recognizeFromImage(img) {
  // 0) Ưu tiên AI server Python (nếu cấu hình)
  try {
    if (img && img.src) {
      const resp = await fetch(img.src);
      const blob = await resp.blob();
      const viaServer = await recognizeViaServerBlob(blob);
      if (viaServer) return viaServer;
    }
  } catch (_) {}

  try {
    const det = await loadDetector();
    const detections = await det.detect(img);
    const hit = getSeedFromDetections(detections);
    if (hit) {
      const seed = SEEDS[hit.seedId];
      return { seedId: hit.seedId, name: seed.name, icon: seed.icon, confidence: hit.confidence, source: 'coco-ssd' };
    }
  } catch (_) {}

  const net = await loadModel();
  const predictions = await net.classify(img, 5);
  const result = getSeedFromPredictions(predictions);
  if (!result) return null;
  const seed = SEEDS[result.seedId];
  return {
    seedId: result.seedId,
    name: seed.name,
    icon: seed.icon,
    confidence: result.confidence,
    source: 'mobilenet',
  };
}

/**
 * Khởi tạo camera và trả về stream
 */
async function startCamera(videoEl) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
    audio: false,
  });
  videoEl.srcObject = stream;
  return stream;
}

function stopCamera(stream) {
  if (stream && stream.getTracks) {
    stream.getTracks().forEach((t) => t.stop());
  }
}
