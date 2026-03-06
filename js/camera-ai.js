/**
 * Camera + AI nhận diện trái cây/cây bằng MobileNet (TensorFlow.js).
 * MobileNet trả về className (string) và probability.
 */

let model = null;
let isModelLoading = false;

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

function getSeedFromPredictions(predictions) {
  if (!predictions || !predictions.length) return null;
  const lower = (s) => (s || '').toLowerCase();
  for (const p of predictions) {
    const name = lower(p.className);
    for (const row of CLASSNAME_TO_SEED) {
      const seedId = row[row.length - 1];
      for (let i = 0; i < row.length - 1; i++) {
        if (name.includes(lower(row[i])) && SEEDS[seedId]) {
          return { seedId, confidence: p.probability };
        }
      }
    }
  }
  return null;
}

/**
 * Chụp frame từ video, chạy MobileNet, trả về { seedId, name, icon } hoặc null
 */
async function recognizeFromVideo(video) {
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
  };
}

/**
 * Nhận diện từ ảnh (HTMLImageElement). Trả về cùng format với recognizeFromVideo.
 */
async function recognizeFromImage(img) {
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
