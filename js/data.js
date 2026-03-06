/**
 * Dữ liệu game: loại hạt giống, sản phẩm, map ImageNet -> seed
 */

// Map ImageNet class index (MobileNet) -> seedId trong game
const IMAGENET_TO_SEED = {
  948: 'tao',      // Granny Smith
  949: 'dau_tay',  // strawberry
  950: 'cam',      // orange
  951: 'chanh',    // lemon
  952: 'sung',     // fig
  953: 'dua',      // pineapple
  954: 'chuoi',    // banana
  955: 'mit',      // jackfruit
  956: 'na',       // custard apple
  957: 'luu',      // pomegranate
  943: 'dua_chuot',// cucumber
  945: 'ot_chuong',// bell pepper
  937: 'broccoli', // broccoli
  947: 'nam',      // mushroom
  987: 'ngo',      // corn
  988: 'hat_de',   // acorn
  989: 'tang_hoa', // rose hip
};

// Map từ className (chuỗi từ MobileNet) sang seedId
const CLASSNAME_TO_SEED = [
  ['granny smith', 'apple', 'tao'], ['strawberry', 'dau_tay'], ['orange', 'cam'], ['lemon', 'chanh'],
  ['fig', 'sung'], ['pineapple', 'ananas', 'dua'], ['banana', 'chuoi'], ['jackfruit', 'jak', 'jack', 'mit'],
  ['custard apple', 'na'], ['pomegranate', 'luu'], ['cucumber', 'cuke', 'dua_chuot'], ['bell pepper', 'ot_chuong'],
  ['broccoli', 'broccoli'], ['mushroom', 'nam'], ['corn', 'ngo'], ['acorn', 'hat_de'],
  ['hip', 'rose hip', 'rosehip', 'tang_hoa'],
];

const SEEDS = {
  tao:       { name: 'Táo',      icon: '🍎',  growTime: 120, sellPrice: 25, productKey: 'tao' },
  dau_tay:   { name: 'Dâu tây',  icon: '🍓',  growTime: 90,  sellPrice: 30, productKey: 'dau_tay' },
  cam:       { name: 'Cam',      icon: '🍊',  growTime: 150, sellPrice: 28, productKey: 'cam' },
  chanh:     { name: 'Chanh',    icon: '🍋',  growTime: 100, sellPrice: 15, productKey: 'chanh' },
  sung:      { name: 'Sung',     icon: '🍈',  growTime: 140, sellPrice: 35, productKey: 'sung' },
  dua:       { name: 'Dứa',     icon: '🍍',  growTime: 180, sellPrice: 45, productKey: 'dua' },
  chuoi:     { name: 'Chuối',   icon: '🍌',  growTime: 130, sellPrice: 20, productKey: 'chuoi' },
  mit:       { name: 'Mít',     icon: '🍈',  growTime: 200, sellPrice: 55, productKey: 'mit' },
  na:        { name: 'Na',      icon: '🍎',  growTime: 160, sellPrice: 32, productKey: 'na' },
  luu:       { name: 'Lựu',     icon: '🍎',  growTime: 170, sellPrice: 40, productKey: 'luu' },
  dua_chuot: { name: 'Dưa chuột', icon: '🥒', growTime: 70,  sellPrice: 12, productKey: 'dua_chuot' },
  ot_chuong: { name: 'Ớt chuông', icon: '🫑', growTime: 80,  sellPrice: 18, productKey: 'ot_chuong' },
  broccoli:  { name: 'Bông cải', icon: '🥦', growTime: 85,  sellPrice: 22, productKey: 'broccoli' },
  nam:       { name: 'Nấm',     icon: '🍄',  growTime: 50,  sellPrice: 20, productKey: 'nam' },
  ngo:       { name: 'Ngô',     icon: '🌽',  growTime: 95,  sellPrice: 18, productKey: 'ngo' },
  hat_de:    { name: 'Cây sồi', icon: '🌰',  growTime: 220, sellPrice: 50, productKey: 'hat_de' },
  tang_hoa:  { name: 'Tầm xuân', icon: '🌹', growTime: 110, sellPrice: 28, productKey: 'tang_hoa' },
};

/** Thông tin thực tế: cách trồng + thông tin khoa học (popup sau khi quét) */
const PLANT_INFO = {
  tao: { scientificName: 'Malus domestica', family: 'Rosaceae (Họ Hoa hồng)', planting: 'Trồng táo: cần khí hậu ôn đới, đất tơi thoát nước. Gieo hạt hoặc ghép cành; trồng cách 4–6 m. Tỉa cành, bón NPK, phun thuốc phòng sâu. Thu hoạch khi quả chín vàng/đỏ.', scientific: 'Táo có nguồn gốc Trung Á. Quả giàu vitamin C, chất xơ và chất chống oxy hóa. Có hơn 7.500 giống táo trên thế giới.' },
  dau_tay: { scientificName: 'Fragaria × ananassa', family: 'Rosaceae', planting: 'Dâu tây ưa mát, đất giàu hữu cơ, pH 5,5–6,5. Trồng cây con hoặc ngó; 30–40 cm. Tưới gốc, bón phân cân đối. Phủ rơm giữ ẩm. Thu khi quả đỏ đều.', scientific: 'Dâu tây là quả giả (đế hoa phình to). Giàu vitamin C, folate và mangan.' },
  cam: { scientificName: 'Citrus × sinensis', family: 'Rutaceae (Họ Cam)', planting: 'Cam ưa nhiệt đới/cận nhiệt, đất thoát nước. Trồng cây ghép, 4–5 m. Tưới đủ mùa khô, bón đạm–kali. Phòng sâu vẽ bùa, nhện. Thu khi vỏ chuyển màu.', scientific: 'Cam nguồn gốc Đông Nam Á, lai bưởi–quýt. Giàu vitamin C, flavonoid; tốt cho miễn dịch.' },
  chanh: { scientificName: 'Citrus × limon', family: 'Rutaceae', planting: 'Chanh trồng nhiều vùng, đất thoát nước. Cây ghép 3–4 m. Tưới đều, bón hữu cơ + NPK. Tỉa tán, phòng ghẻ. Thu khi quả to, vỏ xanh vàng.', scientific: 'Chanh giàu acid citric, vitamin C; kháng khuẩn, dùng nhiều trong ẩm thực.' },
  sung: { scientificName: 'Ficus carica', family: 'Moraceae', planting: 'Sung ưa ấm, đất giàu dinh dưỡng. Trồng cây con/giâm cành 4–5 m. Tưới vừa, bón hữu cơ. Chịu hạn khi lớn. Thu khi quả mềm, tím sẫm.', scientific: 'Quả sung là dạng syconium. Giàu chất xơ, kali, vitamin.' },
  dua: { scientificName: 'Ananas comosus', family: 'Bromeliaceae', planting: 'Dứa trồng nhiệt đới, đất thoát nước pH 4,5–5,5. Trồng chồi ngọn/nách; 30–50 cm. Tưới ẩm, bón kali. Thu khi mắt quả vàng ~1/3.', scientific: 'Dứa là quả phức. Chứa bromelain, vitamin C, mangan.' },
  chuoi: { scientificName: 'Musa spp.', family: 'Musaceae', planting: 'Chuối ưa nóng ẩm, đất giàu hữu cơ. Trồng chồi/cây nuôi cấy mô 2–3 m. Tưới đều, bón kali + hữu cơ. Thu khi quả no, xanh vàng.', scientific: 'Chuối là “cỏ” thân giả. Giàu kali, vitamin B6, carbohydrate.' },
  mit: { scientificName: 'Artocarpus heterophyllus', family: 'Moraceae', planting: 'Mít ưa nóng ẩm, đất sâu. Cây ghép 8–10 m. Tưới khi non, bón hữu cơ + NPK. Phòng rệp, sâu đục. Thu khi gai nở, thơm.', scientific: 'Mít nguồn gốc Ấn Độ; quả composite lớn. Giàu vitamin C, chất xơ.' },
  na: { scientificName: 'Annona squamosa', family: 'Annonaceae', planting: 'Na ưa nhiệt đới, đất nhẹ. Cây ghép/hạt 3–4 m. Tưới đều, bón kali. Thụ phấn bổ sung. Thu khi múi nở.', scientific: 'Na (mãng cầu ta); quả kép, thịt ngọt, vitamin C.' },
  luu: { scientificName: 'Punica granatum', family: 'Lythraceae', planting: 'Lựu ưa nắng, đất thoát nước, chịu hạn. 3–4 m. Tưới vừa, bón cân đối. Thu khi vỏ đỏ vàng, gõ đục.', scientific: 'Lựu giàu chất chống oxy hóa (punicalagin), vitamin C, kali.' },
  dua_chuot: { scientificName: 'Cucumis sativus', family: 'Cucurbitaceae', planting: 'Dưa chuột ưa ấm, đất tơi. Gieo hạt/cây con; 60–80 cm. Tưới đủ, bón đạm–kali. Giàn leo. Thu khi quả xanh.', scientific: 'Dưa chuột ~95% nước; vitamin K, kali. Ăn tươi, muối.' },
  ot_chuong: { scientificName: 'Capsicum annuum', family: 'Solanaceae', planting: 'Ớt chuông ưa nắng. Gieo bầu rồi trồng 40–50 cm. Tưới gốc, bón NPK. Thu khi đạt màu.', scientific: 'Ớt chuông ít cay, giàu vitamin C, A, carotenoid.' },
  broccoli: { scientificName: 'Brassica oleracea var. italica', family: 'Brassicaceae', planting: 'Bông cải ưa mát, đất giàu dinh dưỡng pH 6–7. Gieo ươm rồi trồng 45–60 cm. Thu khi bông còn xanh.', scientific: 'Là chùm hoa chưa nở. Giàu vitamin C, K, folate, sulforaphane.' },
  nam: { scientificName: 'Nhiều chi (Agaricus, Pleurotus...)', family: 'Giới Fungi', planting: 'Trồng nấm: giá thể đã khử trùng (rơm, mùn cưa), giống nấm, nhiệt–ẩm phù hợp. Nhà trồng, tưới phun. Thu khi nấm đủ lớn.', scientific: 'Nấm là sinh vật nhân chuẩn; giàu protein, vitamin D, selenium.' },
  ngo: { scientificName: 'Zea mays', family: 'Poaceae', planting: 'Ngô ưa nắng, đất tơi. Gieo 3–5 cm; 70–80 cm. Tưới lúc trổ–phun râu. Bón đạm–lân–kali. Thu khi râu khô hoặc bắp sữa.', scientific: 'Ngô là lương thực chính; hạt giàu tinh bột, carotenoid.' },
  hat_de: { scientificName: 'Quercus spp.', family: 'Fagaceae', planting: 'Sồi trồng từ hạt sồi: gieo bầu/vườn ươm. Cây non che bóng, tưới đủ. Trồng ra đất 5–10 m. Cây lâu năm.', scientific: 'Sồi là cây gỗ; hạt acorn từng là lương thực.' },
  tang_hoa: { scientificName: 'Rosa canina', family: 'Rosaceae', planting: 'Tầm xuân: hạt từ quả hip hoặc giâm cành. Đất thoát nước, nắng. Quả hip thu khi chín đỏ; làm mứt, trà.', scientific: 'Quả hip rất giàu vitamin C; dùng ẩm thực và dược liệu.' },
};

function getPlantInfo(seedId) { return PLANT_INFO[seedId] || null; }

// Giới hạn úng (flood): 0-100, vượt 80 thì cây chết 0-100, vượt 80 thì cây chết
const FLOOD_DEATH_THRESHOLD = 80;
const WATER_CONSUME_PER_USE = 1;
const FERTILIZER_CONSUME_PER_USE = 1;
const WATER_INCREASE_PER_USE = 15;   // mỗi lần tưới +15% độ ẩm
const FLOOD_INCREASE_PER_WATER = 8;  // mỗi lần tưới +8% úng
const FLOOD_DECAY_PER_TICK = 1;      // mỗi tick -1% úng (tự thoát)
const FERTILIZER_GROWTH_BOOST = 5;   // mỗi lần bón +5% growth
const RAIN_WATER_AMOUNT = 20;        // khi mưa +20% độ ẩm
const RAIN_FLOOD_AMOUNT = 10;        // khi mưa +10% úng
const GROWTH_PER_TICK_BASE = 0.5;    // mỗi tick (với đủ nước)
const DRY_THRESHOLD = 20;            // dưới 20% nước thì không lớn

// Shop
const SHOP_ITEMS = [
  { id: 'water',     name: 'Nước',      icon: '💧', price: 10,  desc: 'Tưới cây', amount: 3 },
  { id: 'fertilizer', name: 'Phân bón', icon: '🌱', price: 25,  desc: 'Bón cho cây lớn nhanh', amount: 2 },
  { id: 'scan',      name: 'Lượt quét', icon: '📷', price: 50,  desc: 'Thêm 1 lượt quét camera', amount: 1 },
];

function getProductName(key) {
  const s = Object.values(SEEDS).find(x => x.productKey === key);
  return s ? s.name : key;
}

function getProductIcon(key) {
  const s = Object.values(SEEDS).find(x => x.productKey === key);
  return s ? s.icon : '📦';
}
