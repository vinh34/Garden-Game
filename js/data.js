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

// Map COCO-SSD (object detection) -> seedId trong game
// COCO-SSD thường bắt vật thể trái cây chính xác hơn phân loại tổng quát.
const COCO_TO_SEED = {
  apple: 'tao',
  banana: 'chuoi',
  orange: 'cam',
  broccoli: 'broccoli',
  carrot: 'ca_rot',
  'hot dog': null,
  pizza: null,
};

// Map từ className (chuỗi từ MobileNet) sang seedId
const CLASSNAME_TO_SEED = [
  ['granny smith', 'apple', 'tao'], ['strawberry', 'dau_tay'], ['orange', 'cam'], ['lemon', 'chanh'],
  ['fig', 'sung'], ['pineapple', 'ananas', 'dua'], ['banana', 'chuoi'], ['jackfruit', 'jak', 'jack', 'mit'],
  ['custard apple', 'na'], ['pomegranate', 'luu'], ['cucumber', 'cuke', 'dua_chuot'], ['bell pepper', 'ot_chuong'],
  ['broccoli', 'broccoli'], ['mushroom', 'nam'], ['corn', 'ngo'], ['acorn', 'hat_de'],
  ['hip', 'rose hip', 'rosehip', 'tang_hoa'],
  ['head cabbage', 'cabbage', 'bap_cai'], ['cauliflower', 'sup_lo'], ['zucchini', 'courgette', 'bi_xanh'],
  ['spaghetti squash', 'bi_tay'], ['acorn squash', 'bi_acorn'], ['butternut squash', 'bi_ngo_mi'],
  ['artichoke', 'globe artichoke', 'atiso'], ['cardoon', 'atiso'], ['grape', 'nho'], ['watermelon', 'dua_hau'],
  ['papaya', 'du_du'], ['mango', 'xoai'], ['avocado', 'bo'], ['cherry', 'anh_dao'], ['pear', 'le'],
  ['peach', 'dao'], ['plum', 'man'], ['apricot', 'mo'], ['olive', 'oliu'], ['potato', 'khoai_tay'],
  ['tomato', 'ca_chua'], ['carrot', 'ca_rot'], ['eggplant', 'aubergine', 'ca_tim'], ['pea', 'dau_cove'],
  ['squash', 'pumpkin', 'bi_ngo'], ['radish', 'cu_cai_trang'], ['onion', 'hanh_tay'], ['garlic', 'toi'],
  ['peanut', 'dau_phong'], ['walnut', 'hat_oc_cho'], ['almond', 'hao_tran'], ['coconut', 'dua_xiem'],
  ['lime', 'chanh_le'], ['grapefruit', 'buoi'], ['lettuce', 'xa_lach'], ['asparagus', 'mang_tay'],
  ['sunflower', 'huong_duong'], ['daisy', 'hoa_cuc'], ['rose', 'hoa_hong'], ['tulip', 'tulip'],
  ['chili', 'pepper', 'ot_hiem'], ['ginger', 'gung'], ['sweet potato', 'khoai_lang'], ['taro', 'khoai_mon'],
  ['rice', 'gao'], ['wheat', 'lua_mi'], ['bean', 'dau_que'], ['spinach', 'rau_cai_bong'], ['beet', 'cu_cai_do'],
  ['turnip', 'cu_cai'], ['leek', 'lay_on'], ['parsley', 'rau_mui'], ['basil', 'hung_que'], ['mint', 'bac_ha'],
  ['oyster mushroom', 'nam_bao_ngu'], ['shiitake', 'nam_dong_co'], ['pomegranate', 'luu'],
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
  nho: { name: 'Nho', icon: '🍇', growTime: 160, sellPrice: 35, productKey: 'nho' },
  dua_hau: { name: 'Dưa hấu', icon: '🍉', growTime: 95, sellPrice: 22, productKey: 'dua_hau' },
  du_du: { name: 'Đu đủ', icon: '🍈', growTime: 150, sellPrice: 28, productKey: 'du_du' },
  xoai: { name: 'Xoài', icon: '🥭', growTime: 180, sellPrice: 38, productKey: 'xoai' },
  bo: { name: 'Bơ', icon: '🥑', growTime: 200, sellPrice: 45, productKey: 'bo' },
  vai: { name: 'Vải', icon: '🍒', growTime: 140, sellPrice: 32, productKey: 'vai' },
  chom_chom: { name: 'Chôm chôm', icon: '🍈', growTime: 170, sellPrice: 40, productKey: 'chom_chom' },
  thanh_long: { name: 'Thanh long', icon: '🐉', growTime: 130, sellPrice: 30, productKey: 'thanh_long' },
  kiwi: { name: 'Kiwi', icon: '🥝', growTime: 190, sellPrice: 42, productKey: 'kiwi' },
  chanh_dau: { name: 'Chanh dây', icon: '🍋', growTime: 100, sellPrice: 26, productKey: 'chanh_dau' },
  dau_den: { name: 'Dâu đen', icon: '🫐', growTime: 85, sellPrice: 28, productKey: 'dau_den' },
  dau_xanh: { name: 'Việt quất', icon: '🫐', growTime: 90, sellPrice: 32, productKey: 'dau_xanh' },
  phuc_bon_tu: { name: 'Phúc bồn tử', icon: '🍇', growTime: 88, sellPrice: 30, productKey: 'phuc_bon_tu' },
  le: { name: 'Lê', icon: '🍐', growTime: 150, sellPrice: 26, productKey: 'le' },
  dao: { name: 'Đào', icon: '🍑', growTime: 140, sellPrice: 30, productKey: 'dao' },
  man: { name: 'Mận', icon: '🍑', growTime: 120, sellPrice: 24, productKey: 'man' },
  mo: { name: 'Mơ', icon: '🍑', growTime: 130, sellPrice: 28, productKey: 'mo' },
  anh_dao: { name: 'Anh đào', icon: '🍒', growTime: 125, sellPrice: 35, productKey: 'anh_dao' },
  oliu: { name: 'Ô liu', icon: '🫒', growTime: 210, sellPrice: 48, productKey: 'oliu' },
  cha_la: { name: 'Chà là', icon: '🌴', growTime: 220, sellPrice: 55, productKey: 'cha_la' },
  khoai_tay: { name: 'Khoai tây', icon: '🥔', growTime: 75, sellPrice: 14, productKey: 'khoai_tay' },
  ca_chua: { name: 'Cà chua', icon: '🍅', growTime: 80, sellPrice: 18, productKey: 'ca_chua' },
  ca_rot: { name: 'Cà rốt', icon: '🥕', growTime: 70, sellPrice: 12, productKey: 'ca_rot' },
  bap_cai: { name: 'Bắp cải', icon: '🥬', growTime: 85, sellPrice: 16, productKey: 'bap_cai' },
  sup_lo: { name: 'Súp lơ', icon: '🥦', growTime: 88, sellPrice: 20, productKey: 'sup_lo' },
  bi_xanh: { name: 'Bí xanh', icon: '🥒', growTime: 72, sellPrice: 15, productKey: 'bi_xanh' },
  bi_ngo: { name: 'Bí đỏ', icon: '🎃', growTime: 100, sellPrice: 22, productKey: 'bi_ngo' },
  ca_tim: { name: 'Cà tím', icon: '🍆', growTime: 90, sellPrice: 18, productKey: 'ca_tim' },
  dau_cove: { name: 'Đậu cô ve', icon: '🫛', growTime: 65, sellPrice: 14, productKey: 'dau_cove' },
  dau_que: { name: 'Đậu que', icon: '🥒', growTime: 68, sellPrice: 13, productKey: 'dau_que' },
  mang_tay: { name: 'Măng tây', icon: '🌿', growTime: 150, sellPrice: 40, productKey: 'mang_tay' },
  xa_lach: { name: 'Xà lách', icon: '🥬', growTime: 55, sellPrice: 10, productKey: 'xa_lach' },
  rau_muong: { name: 'Rau muống', icon: '🥬', growTime: 45, sellPrice: 8, productKey: 'rau_muong' },
  atiso: { name: 'Atisô', icon: '🥬', growTime: 160, sellPrice: 38, productKey: 'atiso' },
  cu_cai_do: { name: 'Củ cải đỏ', icon: '🥕', growTime: 60, sellPrice: 14, productKey: 'cu_cai_do' },
  cu_cai: { name: 'Củ cải', icon: '🥕', growTime: 58, sellPrice: 11, productKey: 'cu_cai' },
  hanh_tay: { name: 'Hành tây', icon: '🧅', growTime: 95, sellPrice: 16, productKey: 'hanh_tay' },
  toi: { name: 'Tỏi', icon: '🧄', growTime: 120, sellPrice: 20, productKey: 'toi' },
  dau_phong: { name: 'Đậu phộng', icon: '🥜', growTime: 110, sellPrice: 25, productKey: 'dau_phong' },
  hao_tran: { name: 'Hạnh nhân', icon: '🥜', growTime: 200, sellPrice: 52, productKey: 'hao_tran' },
  hanh_nhan: { name: 'Hạt điều', icon: '🥜', growTime: 190, sellPrice: 50, productKey: 'hanh_nhan' },
  hat_dieu: { name: 'Hạt điều', icon: '🥜', growTime: 185, sellPrice: 48, productKey: 'hat_dieu' },
  dua_xiem: { name: 'Dừa', icon: '🥥', growTime: 250, sellPrice: 35, productKey: 'dua_xiem' },
  chanh_le: { name: 'Chanh leo', icon: '🍋', growTime: 105, sellPrice: 22, productKey: 'chanh_le' },
  buoi: { name: 'Bưởi', icon: '🍊', growTime: 170, sellPrice: 32, productKey: 'buoi' },
  bi_ao: { name: 'Bí ao', icon: '🎃', growTime: 95, sellPrice: 20, productKey: 'bi_ao' },
  ot_hiem: { name: 'Ớt hiểm', icon: '🌶️', growTime: 85, sellPrice: 18, productKey: 'ot_hiem' },
  rau_mui: { name: 'Rau mùi', icon: '🌿', growTime: 50, sellPrice: 12, productKey: 'rau_mui' },
  hung_que: { name: 'Húng quế', icon: '🌿', growTime: 48, sellPrice: 10, productKey: 'hung_que' },
  cai_thia: { name: 'Cải thảo', icon: '🥬', growTime: 65, sellPrice: 14, productKey: 'cai_thia' },
  cu_cai_trang: { name: 'Củ cải trắng', icon: '🥕', growTime: 56, sellPrice: 10, productKey: 'cu_cai_trang' },
  khoai_lang: { name: 'Khoai lang', icon: '🍠', growTime: 110, sellPrice: 15, productKey: 'khoai_lang' },
  khoai_mon: { name: 'Khoai môn', icon: '🍠', growTime: 140, sellPrice: 22, productKey: 'khoai_mon' },
  gung: { name: 'Gừng', icon: '🫚', growTime: 200, sellPrice: 28, productKey: 'gung' },
  nghe: { name: 'Nghệ', icon: '🫚', growTime: 210, sellPrice: 30, productKey: 'nghe' },
  sen: { name: 'Sen', icon: '🪷', growTime: 130, sellPrice: 35, productKey: 'sen' },
  hoa_hong: { name: 'Hoa hồng', icon: '🌹', growTime: 100, sellPrice: 25, productKey: 'hoa_hong' },
  hoa_cuc: { name: 'Hoa cúc', icon: '🌼', growTime: 75, sellPrice: 18, productKey: 'hoa_cuc' },
  huong_duong: { name: 'Hướng dương', icon: '🌻', growTime: 95, sellPrice: 22, productKey: 'huong_duong' },
  tulip: { name: 'Tulip', icon: '🌷', growTime: 70, sellPrice: 28, productKey: 'tulip' },
  lay_on: { name: 'Tỏi tây', icon: '🧅', growTime: 100, sellPrice: 18, productKey: 'lay_on' },
  rau_que: { name: 'Rau quế', icon: '🌿', growTime: 45, sellPrice: 9, productKey: 'rau_que' },
  bac_ha: { name: 'Bạc hà', icon: '🌿', growTime: 52, sellPrice: 14, productKey: 'bac_ha' },
  hat_bi: { name: 'Hạt bí', icon: '🎃', growTime: 105, sellPrice: 20, productKey: 'hat_bi' },
  hat_huong_duong: { name: 'Hạt hướng dương', icon: '🌻', growTime: 98, sellPrice: 18, productKey: 'hat_huong_duong' },
  lua_mi: { name: 'Lúa mì', icon: '🌾', growTime: 115, sellPrice: 16, productKey: 'lua_mi' },
  vung: { name: 'Vừng', icon: '🌱', growTime: 90, sellPrice: 24, productKey: 'vung' },
  bi_ngo_mi: { name: 'Bí ngô Mỹ', icon: '🎃', growTime: 102, sellPrice: 24, productKey: 'bi_ngo_mi' },
  nam_bao_ngu: { name: 'Nấm bào ngư', icon: '🍄', growTime: 42, sellPrice: 22, productKey: 'nam_bao_ngu' },
  rau_dang: { name: 'Rau dền', icon: '🥬', growTime: 48, sellPrice: 9, productKey: 'rau_dang' },
  ca_hoa: { name: 'Cải hoa', icon: '🥦', growTime: 82, sellPrice: 19, productKey: 'ca_hoa' },
  bi_acorn: { name: 'Bí acorn', icon: '🎃', growTime: 92, sellPrice: 21, productKey: 'bi_acorn' },
  dau_xanh_la: { name: 'Đậu xanh', icon: '🫛', growTime: 72, sellPrice: 15, productKey: 'dau_xanh_la' },
  khoai_so: { name: 'Khoai sọ', icon: '🍠', growTime: 135, sellPrice: 20, productKey: 'khoai_so' },
  rau_cai_cay: { name: 'Rau cải cay', icon: '🥬', growTime: 52, sellPrice: 11, productKey: 'rau_cai_cay' },
  bi_rong: { name: 'Bí rợ', icon: '🎃', growTime: 98, sellPrice: 20, productKey: 'bi_rong' },
  rau_den: { name: 'Rau dền đen', icon: '🥬', growTime: 50, sellPrice: 10, productKey: 'rau_den' },
  ca_chua_anh: { name: 'Cà chua anh đào', icon: '🍅', growTime: 78, sellPrice: 22, productKey: 'ca_chua_anh' },
  bi_tay: { name: 'Bí tây', icon: '🥒', growTime: 74, sellPrice: 16, productKey: 'bi_tay' },
  gao: { name: 'Lúa', icon: '🌾', growTime: 120, sellPrice: 14, productKey: 'gao' },
  dau_den_my: { name: 'Đậu đen', icon: '🫘', growTime: 85, sellPrice: 18, productKey: 'dau_den_my' },
  bap_cai_tim: { name: 'Bắp cải tím', icon: '🥬', growTime: 88, sellPrice: 20, productKey: 'bap_cai_tim' },
  rau_cai_xoan: { name: 'Rau cải xoăn', icon: '🥬', growTime: 60, sellPrice: 16, productKey: 'rau_cai_xoan' },
  bi_do_nho: { name: 'Bí đỏ nhỏ', icon: '🎃', growTime: 88, sellPrice: 18, productKey: 'bi_do_nho' },
  ca_chua_bi: { name: 'Cà chua bi', icon: '🍅', growTime: 76, sellPrice: 20, productKey: 'ca_chua_bi' },
  ot_xanh: { name: 'Ớt xanh', icon: '🌶️', growTime: 82, sellPrice: 16, productKey: 'ot_xanh' },
  rau_can: { name: 'Rau cần', icon: '🥬', growTime: 70, sellPrice: 14, productKey: 'rau_can' },
  bong_cai_tim: { name: 'Bông cải tím', icon: '🥦', growTime: 86, sellPrice: 24, productKey: 'bong_cai_tim' },
  rau_mong_toi: { name: 'Rau mồng tơi', icon: '🥬', growTime: 42, sellPrice: 8, productKey: 'rau_mong_toi' },
  nam_kim_chanh: { name: 'Nấm kim châm', icon: '🍄', growTime: 38, sellPrice: 18, productKey: 'nam_kim_chanh' },
  bi_phap: { name: 'Bí Pháp', icon: '🥒', growTime: 76, sellPrice: 17, productKey: 'bi_phap' },
  rau_thom: { name: 'Rau thơm', icon: '🌿', growTime: 46, sellPrice: 10, productKey: 'rau_thom' },
  rau_ma: { name: 'Rau má', icon: '🌿', growTime: 40, sellPrice: 12, productKey: 'rau_ma' },
  rau_muong_bo: { name: 'Rau muống bò', icon: '🥬', growTime: 44, sellPrice: 9, productKey: 'rau_muong_bo' },
  rau_can_ta: { name: 'Rau cần tây', icon: '🥬', growTime: 90, sellPrice: 16, productKey: 'rau_can_ta' },
  rau_cai_ngo: { name: 'Rau cải ngồng', icon: '🥬', growTime: 55, sellPrice: 13, productKey: 'rau_cai_ngo' },
  bi_xiem: { name: 'Bí xiêm', icon: '🎃', growTime: 96, sellPrice: 19, productKey: 'bi_xiem' },
  rau_cai_bong: { name: 'Rau cải bó xôi', icon: '🥬', growTime: 58, sellPrice: 14, productKey: 'rau_cai_bong' },
  rau_cai_xoan_xanh: { name: 'Cải xoăn xanh', icon: '🥬', growTime: 62, sellPrice: 15, productKey: 'rau_cai_xoan_xanh' },
  nam_dong_co: { name: 'Nấm đông cô', icon: '🍄', growTime: 95, sellPrice: 35, productKey: 'nam_dong_co' },
  hat_oc_cho: { name: 'Hạt óc chó', icon: '🥜', growTime: 195, sellPrice: 55, productKey: 'hat_oc_cho' },
  hat_phi: { name: 'Hạt phỉ', icon: '🥜', growTime: 180, sellPrice: 48, productKey: 'hat_phi' },
  hat_hoa_qua: { name: 'Hạt hồ đào', icon: '🥜', growTime: 188, sellPrice: 52, productKey: 'hat_hoa_qua' },
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
  nho: { scientificName: 'Vitis vinifera', family: 'Vitaceae', planting: 'Nho ưa khí hậu ôn đới/Địa Trung Hải, đất thoát nước. Trồng cây ghép, giàn leo. Tỉa cành, bón kali. Thu khi chùm chín.', scientific: 'Nho là cây leo lâu năm; quả dùng làm rượu, ăn tươi, nho khô. Giàu resveratrol.' },
  dua_hau: { scientificName: 'Citrullus lanatus', family: 'Cucurbitaceae', planting: 'Dưa hấu ưa nóng, đất tơi, nhiều nắng. Gieo hạt 80–100 cm. Tưới đều, bón kali. Thu khi cuống khô, gõ đục.', scientific: 'Dưa hấu chứa ~92% nước; lycopene, vitamin A, C. Cây một năm.' },
  du_du: { scientificName: 'Carica papaya', family: 'Caricaceae', planting: 'Đu đủ ưa nhiệt đới, đất thoát nước. Trồng cây con/hạt 2–3 m. Tưới đủ, bón phân cân đối. Thu khi quả vàng ửng.', scientific: 'Đu đủ chứa enzyme papain; giàu vitamin C, folate. Cây thân thảo lớn.' },
  xoai: { scientificName: 'Mangifera indica', family: 'Anacardiaceae', planting: 'Xoài ưa nhiệt đới, đất sâu thoát nước. Cây ghép 8–10 m. Tưới mùa khô, bón NPK. Thu khi quả chín vàng/đỏ.', scientific: 'Xoài nguồn gốc Nam Á; quả giàu vitamin A, C, chất xơ.' },
  bo: { scientificName: 'Persea americana', family: 'Lauraceae', planting: 'Bơ ưa khí hậu cận nhiệt, đất thoát nước. Cây ghép 6–8 m. Cần thụ phấn chéo. Thu khi quả mềm.', scientific: 'Bơ giàu chất béo lành mạnh, kali, vitamin E, K.' },
  vai: { scientificName: 'Litchi chinensis', family: 'Sapindaceae', planting: 'Vải ưa nhiệt đới ẩm, đất giàu dinh dưỡng. Cây ghép 6–8 m. Tưới đủ, bón kali. Thu khi vỏ đỏ.', scientific: 'Vải giàu vitamin C; quả có hạt độc nếu ăn sống quá nhiều.' },
  chom_chom: { scientificName: 'Nephelium lappaceum', family: 'Sapindaceae', planting: 'Chôm chôm ưa nhiệt đới, đất ẩm. Cây 6–8 m. Tưới đều. Thu khi tua đỏ, quả vàng.', scientific: 'Chôm chôm có gai mềm; thịt quả ngọt, giàu vitamin C.' },
  thanh_long: { scientificName: 'Hylocereus undatus', family: 'Cactaceae', planting: 'Thanh long ưa khô nóng, đất thoát nước. Trồng hom, trụ đỡ. Tưới ít. Thu khi vỏ đỏ, tai xanh.', scientific: 'Thanh long là xương rồng leo; quả giàu betalain, vitamin C.' },
  kiwi: { scientificName: 'Actinidia deliciosa', family: 'Actinidiaceae', planting: 'Kiwi ưa khí hậu ôn đới mát, đất thoát nước. Giàn leo, cần cây đực. Thu khi quả chín mềm.', scientific: 'Kiwi giàu vitamin C, K, chất xơ; có enzyme actinidain.' },
  chanh_dau: { scientificName: 'Passiflora edulis', family: 'Passifloraceae', planting: 'Chanh dây leo, ưa ấm, đất thoát nước. Trồng giàn. Thu khi quả tím/vàng rụng.', scientific: 'Chanh dây giàu vitamin C, chất xơ; ancaloit có tác dụng an thần nhẹ.' },
  dau_den: { scientificName: 'Rubus spp.', family: 'Rosaceae', planting: 'Dâu đen ưa mát, đất giàu hữu cơ. Trồng cây/cành; hàng 1–2 m. Thu khi quả đen mềm.', scientific: 'Dâu đen giàu anthocyanin, vitamin C, chất xơ.' },
  dau_xanh: { scientificName: 'Vaccinium spp.', family: 'Ericaceae', planting: 'Việt quất ưa đất chua, mát. Trồng bụi 1–1,5 m. Thu khi quả xanh đậm, dễ rụng.', scientific: 'Việt quất giàu chất chống oxy hóa, vitamin K, mangan.' },
  phuc_bon_tu: { scientificName: 'Rubus idaeus', family: 'Rosaceae', planting: 'Phúc bồn tử ưa mát, đất thoát nước. Trồng cành; 50 cm. Thu khi quả đỏ, dễ tách.', scientific: 'Phúc bồn tử (raspberry) giàu vitamin C, ellagic acid.' },
  le: { scientificName: 'Pyrus spp.', family: 'Rosaceae', planting: 'Lê ưa ôn đới, đất sâu. Cây ghép 4–5 m. Tỉa cành, bón phân. Thu khi quả vàng xanh.', scientific: 'Lê giàu chất xơ, vitamin C; nhiều giống ăn tươi và nấu.' },
  dao: { scientificName: 'Prunus persica', family: 'Rosaceae', planting: 'Đào ưa ôn đới, đất thoát nước. Cây ghép 4–5 m. Tỉa, phòng sâu. Thu khi quả mềm thơm.', scientific: 'Đào giàu vitamin C, A; có lông tơ hoặc không (đào trơn).' },
  man: { scientificName: 'Prunus domestica', family: 'Rosaceae', planting: 'Mận ưa ôn đới, đất tơi. Cây ghép 4–5 m. Thu khi quả tím/đỏ, có phấn.', scientific: 'Mận giàu vitamin C, K; ăn tươi hoặc sấy.' },
  mo: { scientificName: 'Prunus armeniaca', family: 'Rosaceae', planting: 'Mơ ưa khí hậu khô mát, đất thoát nước. Cây 4–5 m. Thu khi quả vàng cam.', scientific: 'Mơ giàu beta-caroten, vitamin A; dùng tươi, sấy, mứt.' },
  anh_dao: { scientificName: 'Prunus avium', family: 'Rosaceae', planting: 'Anh đào ưa ôn đới, đất sâu. Cây 5–6 m. Thu khi quả đỏ đen, cuống xanh.', scientific: 'Anh đào (cherry) giàu anthocyanin, vitamin C; ngọt hoặc chua.' },
  oliu: { scientificName: 'Olea europaea', family: 'Oleaceae', planting: 'Ô liu ưa Địa Trung Hải, đất thoát nước. Cây 6–8 m. Thu xanh (muối) hoặc chín đen (dầu).', scientific: 'Ô liu giàu acid béo không no; dầu ô liu tốt cho tim mạch.' },
  cha_la: { scientificName: 'Phoenix dactylifera', family: 'Arecaceae', planting: 'Chà là ưa sa mạc, nóng khô. Cây cọ 8–10 m. Tưới nhỏ giọt. Thu khi quả chín nâu.', scientific: 'Chà là giàu đường, chất xơ; lương thực truyền thống vùng Trung Đông.' },
  khoai_tay: { scientificName: 'Solanum tuberosum', family: 'Solanaceae', planting: 'Khoai tây ưa mát, đất tơi. Trồng củ 30 cm. Vun gốc, bón kali. Thu khi lá vàng.', scientific: 'Khoai tây là cây lương thực quan trọng; củ giàu tinh bột, vitamin C.' },
  ca_chua: { scientificName: 'Solanum lycopersicum', family: 'Solanaceae', planting: 'Cà chua ưa nắng, đất giàu dinh dưỡng. Gieo bầu rồi trồng 50 cm. Giàn/cọc. Thu khi quả đỏ.', scientific: 'Cà chua giàu lycopene, vitamin C, A; quả mọng.' },
  ca_rot: { scientificName: 'Daucus carota', family: 'Apiaceae', planting: 'Cà rốt ưa đất tơi sâu, thoát nước. Gieo hạt 15–20 cm. Thu khi củ đỏ cam.', scientific: 'Cà rốt giàu beta-caroten (vitamin A), chất xơ.' },
  bap_cai: { scientificName: 'Brassica oleracea var. capitata', family: 'Brassicaceae', planting: 'Bắp cải ưa mát, đất giàu dinh dưỡng. Gieo ươm, trồng 40–50 cm. Thu khi bắp cuộn chặt.', scientific: 'Bắp cải là lá cuộn; giàu vitamin K, C, folate.' },
  sup_lo: { scientificName: 'Brassica oleracea var. botrytis', family: 'Brassicaceae', planting: 'Súp lơ ưa mát, đất tơi. Trồng 45–50 cm. Che lá khi có hoa. Thu khi bông trắng chắc.', scientific: 'Súp lơ là chùm hoa chưa nở; giàu vitamin C, K.' },
  bi_xanh: { scientificName: 'Cucurbita pepo', family: 'Cucurbitaceae', planting: 'Bí xanh ưa ấm, đất tơi. Gieo 60–80 cm. Giàn hoặc bò. Thu khi quả non xanh.', scientific: 'Bí xanh (zucchini) giàu nước, vitamin C; quả non ăn cả vỏ.' },
  bi_ngo: { scientificName: 'Cucurbita maxima', family: 'Cucurbitaceae', planting: 'Bí đỏ ưa ấm, đất giàu dinh dưỡng. Gieo 80–100 cm. Thu khi cuống khô, vỏ cứng.', scientific: 'Bí đỏ giàu beta-caroten, vitamin A; có thể bảo quản lâu.' },
  ca_tim: { scientificName: 'Solanum melongena', family: 'Solanaceae', planting: 'Cà tím ưa nắng, đất giàu dinh dưỡng. Trồng 50 cm. Thu khi quả bóng, tím đậm.', scientific: 'Cà tím giàu nasunin (chất chống oxy hóa), chất xơ.' },
  dau_cove: { scientificName: 'Phaseolus vulgaris', family: 'Fabaceae', planting: 'Đậu cô ve ưa ấm, đất tơi. Gieo 30–40 cm. Giàn leo. Thu khi quả non xanh.', scientific: 'Đậu cô ve giàu protein, chất xơ, folate.' },
  dau_que: { scientificName: 'Phaseolus vulgaris', family: 'Fabaceae', planting: 'Đậu que tương tự đậu cô ve; thu non, ăn cả vỏ.', scientific: 'Đậu que là giống đậu lấy quả non; giàu vitamin K.' },
  mang_tay: { scientificName: 'Asparagus officinalis', family: 'Asparagaceae', planting: 'Măng tây ưa đất cát pha, thoát nước. Trồng cây 1 năm; thu măng 15–20 cm.', scientific: 'Măng tây là chồi non; giàu folate, vitamin K.' },
  xa_lach: { scientificName: 'Lactuca sativa', family: 'Asteraceae', planting: 'Xà lách ưa mát, đất tơi. Gieo 20–25 cm. Tưới đều. Thu khi lá đủ lớn.', scientific: 'Xà lách giàu nước, vitamin K, folate; nhiều loại lá.' },
  rau_muong: { scientificName: 'Ipomoea aquatica', family: 'Convolvulaceae', planting: 'Rau muống ưa nước, đất ẩm hoặc nước. Gieo/giâm; thu đọt non.', scientific: 'Rau muống giàu sắt, vitamin A; trồng cạn hoặc nước.' },
  atiso: { scientificName: 'Cynara cardunculus var. scolymus', family: 'Asteraceae', planting: 'Atisô ưa khí hậu mát, đất sâu. Trồng cây con; thu khi bông chưa nở.', scientific: 'Atisô là hoa chưa nở; giàu cynarin, chất xơ.' },
  cu_cai_do: { scientificName: 'Beta vulgaris', family: 'Amaranthaceae', planting: 'Củ cải đỏ ưa mát, đất tơi. Gieo 10–15 cm. Thu khi củ 5–8 cm.', scientific: 'Củ cải đỏ giàu betalain, folate, kali.' },
  cu_cai: { scientificName: 'Raphanus sativus', family: 'Brassicaceae', planting: 'Củ cải trắng/đỏ ưa mát, đất tơi. Gieo 5–10 cm. Thu non.', scientific: 'Củ cải giàu vitamin C, isothiocyanate.' },
  hanh_tay: { scientificName: 'Allium cepa', family: 'Amaryllidaceae', planting: 'Hành tây ưa nắng, đất thoát nước. Gieo hạt/củ; 10–15 cm. Thu khi lá đổ.', scientific: 'Hành tây giàu quercetin, vitamin C; làm gia vị và rau.' },
  toi: { scientificName: 'Allium sativum', family: 'Amaryllidaceae', planting: 'Tỏi ưa nắng, đất tơi. Trồng tép 10–15 cm. Thu khi lá vàng 1/3.', scientific: 'Tỏi chứa allicin; kháng khuẩn, tốt cho tim mạch.' },
  dau_phong: { scientificName: 'Arachis hypogaea', family: 'Fabaceae', planting: 'Đậu phộng ưa nắng, đất cát pha. Gieo 25–30 cm. Thu khi lá vàng, đào củ.', scientific: 'Đậu phộng (lạc) là cây họ đậu; hạt giàu protein, dầu.' },
  hao_tran: { scientificName: 'Prunus dulcis', family: 'Rosaceae', planting: 'Hạnh nhân ưa khí hậu Địa Trung Hải. Cây 5–6 m. Thu khi vỏ nứt.', scientific: 'Hạnh nhân giàu vitamin E, magie; ăn hạt.' },
  hanh_nhan: { scientificName: 'Anacardium occidentale', family: 'Anacardiaceae', planting: 'Hạt điều ưa nhiệt đới, đất thoát nước. Cây 8–10 m. Thu quả, lấy hạt.', scientific: 'Hạt điều giàu chất béo, magie; quả giả (cuống) cũng dùng.' },
  hat_dieu: { scientificName: 'Anacardium occidentale', family: 'Anacardiaceae', planting: 'Cùng loài với hạt điều; trồng lấy hạt.', scientific: 'Hạt điều chứa acid béo không bão hòa.' },
  dua_xiem: { scientificName: 'Cocos nucifera', family: 'Arecaceae', planting: 'Dừa ưa ven biển nhiệt đới, đất cát. Trồng quả già; 8–10 m. Thu khi nước ngọt.', scientific: 'Dừa cho nước, cơm, dầu; sợi xơ dừa dùng công nghiệp.' },
  chanh_le: { scientificName: 'Citrus × latifolia', family: 'Rutaceae', planting: 'Chanh leo (lime) ưa nhiệt đới. Tương tự chanh; quả xanh nhỏ.', scientific: 'Chanh leo giàu vitamin C; dùng nước uống, ẩm thực.' },
  buoi: { scientificName: 'Citrus maxima', family: 'Rutaceae', planting: 'Bưởi ưa nhiệt đới, đất thoát nước. Cây 5–6 m. Thu khi vỏ vàng/xanh.', scientific: 'Bưởi giàu vitamin C, naringenin; có loại chua và ngọt.' },
  bi_ao: { scientificName: 'Cucurbita spp.', family: 'Cucurbitaceae', planting: 'Bí ao ưa ấm, đất tơi. Trồng tương tự bí đỏ; thu khi quả già.', scientific: 'Bí ao dùng nấu ăn; giàu carotenoid.' },
  ot_hiem: { scientificName: 'Capsicum frutescens', family: 'Solanaceae', planting: 'Ớt hiểm ưa nắng. Gieo bầu, trồng 30–40 cm. Thu khi quả đỏ.', scientific: 'Ớt hiểm rất cay; chứa capsaicin cao.' },
  rau_mui: { scientificName: 'Coriandrum sativum', family: 'Apiaceae', planting: 'Rau mùi ưa mát, đất tơi. Gieo 15–20 cm. Thu lá non hoặc hạt.', scientific: 'Rau mùi (ngò) giàu vitamin K; lá và hạt đều dùng.' },
  hung_que: { scientificName: 'Ocimum basilicum', family: 'Lamiaceae', planting: 'Húng quế ưa nắng, đất thoát nước. Gieo 20–25 cm. Thu lá non.', scientific: 'Húng quế giàu tinh dầu; dùng gia vị và thuốc.' },
  cai_thia: { scientificName: 'Brassica rapa var. pekinensis', family: 'Brassicaceae', planting: 'Cải thảo ưa mát. Gieo ươm, trồng 30–40 cm. Thu khi bắp cuộn.', scientific: 'Cải thảo lá mỏng, dùng nấu canh, muối.' },
  cu_cai_trang: { scientificName: 'Raphanus sativus var. longipinnatus', family: 'Brassicaceae', planting: 'Củ cải trắng dài ưa mát. Gieo 5–10 cm. Thu non.', scientific: 'Củ cải trắng giàu vitamin C; ăn sống hoặc nấu.' },
  khoai_lang: { scientificName: 'Ipomoea batatas', family: 'Convolvulaceae', planting: 'Khoai lang ưa nắng, đất tơi. Trồng dây 30–40 cm. Thu khi lá vàng.', scientific: 'Khoai lang giàu beta-caroten, tinh bột; củ và lá đều ăn được.' },
  khoai_mon: { scientificName: 'Colocasia esculenta', family: 'Araceae', planting: 'Khoai môn ưa ẩm, đất giàu hữu cơ. Trồng củ 50–60 cm. Thu khi lá già.', scientific: 'Khoai môn giàu tinh bột; cần nấu chín để loại bỏ độc nhẹ.' },
  gung: { scientificName: 'Zingiber officinale', family: 'Zingiberaceae', planting: 'Gừng ưa ẩm, đất tơi. Trồng củ 20–25 cm. Thu khi lá vàng.', scientific: 'Gừng chứa gingerol; chống viêm, hỗ trợ tiêu hóa.' },
  nghe: { scientificName: 'Curcuma longa', family: 'Zingiberaceae', planting: 'Nghệ ưa ẩm, đất tơi. Trồng củ 25–30 cm. Thu khi lá khô.', scientific: 'Nghệ chứa curcumin; kháng viêm, tạo màu vàng.' },
  sen: { scientificName: 'Nelumbo nucifera', family: 'Nelumbonaceae', planting: 'Sen trồng trong ao, đất bùn. Trồng củ/cây; nước 30–50 cm. Thu hạt, ngó, củ.', scientific: 'Sen là biểu tượng văn hóa; hạt, ngó giàu dinh dưỡng.' },
  hoa_hong: { scientificName: 'Rosa spp.', family: 'Rosaceae', planting: 'Hoa hồng ưa nắng, đất thoát nước. Trồng cây/ghép 40–60 cm. Tỉa, bón phân.', scientific: 'Hoa hồng có hàng nghìn giống; dùng trang trí, tinh dầu.' },
  hoa_cuc: { scientificName: 'Chrysanthemum spp.', family: 'Asteraceae', planting: 'Hoa cúc ưa nắng, đất tơi. Gieo/trồng 25–30 cm. Thu khi nở.', scientific: 'Hoa cúc nhiều màu; trà cúc, trang trí.' },
  huong_duong: { scientificName: 'Helianthus annuus', family: 'Asteraceae', planting: 'Hướng dương ưa nắng, đất tơi. Gieo 40–50 cm. Thu khi đầu chín, hạt đen.', scientific: 'Hướng dương cho hạt giàu dầu, vitamin E.' },
  tulip: { scientificName: 'Tulipa spp.', family: 'Liliaceae', planting: 'Tulip ưa lạnh, đất thoát nước. Trồng củ mùa thu; 10–15 cm. Nở xuân.', scientific: 'Tulip có nguồn gốc Trung Á; nhiều màu, trồng cảnh.' },
  lay_on: { scientificName: 'Allium ampeloprasum var. porrum', family: 'Amaryllidaceae', planting: 'Tỏi tây (leek) ưa mát, đất giàu dinh dưỡng. Trồng 15–20 cm. Thu khi thân trắng dài.', scientific: 'Tỏi tây giàu vitamin K, folate; dùng nấu ăn.' },
  rau_que: { scientificName: 'Coriandrum sativum', family: 'Apiaceae', planting: 'Rau quế (ngò) tương tự rau mùi; thu lá non.', scientific: 'Rau quế giàu vitamin K; lá và hạt dùng gia vị.' },
  bac_ha: { scientificName: 'Mentha spp.', family: 'Lamiaceae', planting: 'Bạc hà ưa ẩm, đất tơi. Trồng cành 20 cm. Thu lá.', scientific: 'Bạc hà chứa menthol; làm trà, gia vị, thuốc.' },
  hat_bi: { scientificName: 'Cucurbita pepo', family: 'Cucurbitaceae', planting: 'Hạt bí lấy từ quả bí già; phơi khô, tách hạt.', scientific: 'Hạt bí giàu kẽm, magie, acid béo.' },
  hat_huong_duong: { scientificName: 'Helianthus annuus', family: 'Asteraceae', planting: 'Trồng hướng dương; thu khi đầu chín, lấy hạt.', scientific: 'Hạt hướng dương giàu vitamin E, selen.' },
  lua_mi: { scientificName: 'Triticum aestivum', family: 'Poaceae', planting: 'Lúa mì ưa ôn đới, đất tơi. Gieo hạt; thu khi bông vàng.', scientific: 'Lúa mì là lương thực chính; hạt xay thành bột.' },
  vung: { scientificName: 'Sesamum indicum', family: 'Pedaliaceae', planting: 'Vừng ưa nắng, đất thoát nước. Gieo 20–30 cm. Thu khi quả khô.', scientific: 'Vừng giàu dầu, canxi; hạt dùng ẩm thực.' },
  bi_ngo_mi: { scientificName: 'Cucurbita maxima', family: 'Cucurbitaceae', planting: 'Bí ngô Mỹ (butternut) ưa ấm. Trồng tương tự bí đỏ; quả dạng bầu.', scientific: 'Bí butternut thịt vàng, ngọt; giàu vitamin A.' },
  nam_bao_ngu: { scientificName: 'Pleurotus ostreatus', family: 'Pleurotaceae', planting: 'Nấm bào ngư trồng trên mùn cưa/rơm đã khử trùng. Ẩm, mát. Thu khi mép nấm chưa cong.', scientific: 'Nấm bào ngư giàu protein, beta-glucan.' },
  rau_dang: { scientificName: 'Amaranthus spp.', family: 'Amaranthaceae', planting: 'Rau dền ưa nắng, đất tơi. Gieo 15–20 cm. Thu đọt non.', scientific: 'Rau dền giàu sắt, canxi, vitamin K.' },
  ca_hoa: { scientificName: 'Brassica oleracea var. botrytis', family: 'Brassicaceae', planting: 'Cải hoa (súp lơ) trồng tương tự súp lơ; thu bông trắng/xanh.', scientific: 'Cải hoa là chùm hoa chưa nở.' },
  bi_acorn: { scientificName: 'Cucurbita pepo var. turbinata', family: 'Cucurbitaceae', planting: 'Bí acorn ưa ấm; quả nhỏ hình acorn. Trồng 60–80 cm.', scientific: 'Bí acorn thịt vàng cam; giàu vitamin A.' },
  dau_xanh_la: { scientificName: 'Vigna radiata', family: 'Fabaceae', planting: 'Đậu xanh ưa ấm. Gieo 10–15 cm. Thu quả khô hoặc ăn non.', scientific: 'Đậu xanh giàu protein, folate; làm giá, chè.' },
  khoai_so: { scientificName: 'Colocasia antiquorum', family: 'Araceae', planting: 'Khoai sọ ưa ẩm, đất giàu hữu cơ. Trồng củ 50 cm. Thu khi lá già.', scientific: 'Khoai sọ củ nhỏ; nấu chín dùng trong ẩm thực.' },
  rau_cai_cay: { scientificName: 'Brassica juncea', family: 'Brassicaceae', planting: 'Cải cay ưa mát. Gieo 15–20 cm. Thu lá non làm dưa/dùng tươi.', scientific: 'Cải cay có vị cay nhẹ; giàu vitamin A, C.' },
  bi_rong: { scientificName: 'Cucurbita moschata', family: 'Cucurbitaceae', planting: 'Bí rợ ưa ấm; quả to, thịt cam. Trồng 80–100 cm.', scientific: 'Bí rợ giàu beta-caroten; nấu ăn, bánh.' },
  rau_den: { scientificName: 'Amaranthus cruentus', family: 'Amaranthaceae', planting: 'Rau dền đen ưa nắng. Gieo 15 cm. Thu đọt non.', scientific: 'Rau dền đen lá đỏ tía; giàu sắt.' },
  ca_chua_anh: { scientificName: 'Solanum lycopersicum', family: 'Solanaceae', planting: 'Cà chua anh đào (cherry) trồng như cà chua; quả nhỏ, chùm.', scientific: 'Cà chua bi ngọt; giàu lycopene.' },
  bi_tay: { scientificName: 'Cucurbita pepo', family: 'Cucurbitaceae', planting: 'Bí tây (summer squash) ưa ấm. Thu quả non.', scientific: 'Bí tây quả vàng/xanh; ăn non.' },
  gao: { scientificName: 'Oryza sativa', family: 'Poaceae', planting: 'Lúa ưa nước, khí hậu nhiệt đới. Cấy mạ; thu khi bông vàng.', scientific: 'Lúa là lương thực chính của châu Á; hạt gạo.' },
  dau_den_my: { scientificName: 'Phaseolus vulgaris', family: 'Fabaceae', planting: 'Đậu đen ưa ấm. Gieo 10–15 cm. Thu quả khô lấy hạt.', scientific: 'Đậu đen giàu protein, chất xơ, sắt.' },
  bap_cai_tim: { scientificName: 'Brassica oleracea var. capitata f. rubra', family: 'Brassicaceae', planting: 'Bắp cải tím ưa mát; trồng như bắp cải; lá tím.', scientific: 'Bắp cải tím giàu anthocyanin; màu tím khi nấu.' },
  rau_cai_xoan: { scientificName: 'Brassica oleracea var. sabellica', family: 'Brassicaceae', planting: 'Cải xoăn ưa mát. Gieo 30–40 cm. Thu lá xoăn.', scientific: 'Cải xoăn (kale) giàu vitamin K, A, C.' },
  bi_do_nho: { scientificName: 'Cucurbita pepo', family: 'Cucurbitaceae', planting: 'Bí đỏ nhỏ (pumpkin mini) trồng như bí; quả nhỏ trang trí.', scientific: 'Bí đỏ nhỏ dùng trang trí hoặc nấu.' },
  ca_chua_bi: { scientificName: 'Solanum lycopersicum', family: 'Solanaceae', planting: 'Cà chua bi trồng như cà chua; quả nhỏ, nhiều.', scientific: 'Cà chua bi ngọt, dùng salad.' },
  ot_xanh: { scientificName: 'Capsicum annuum', family: 'Solanaceae', planting: 'Ớt xanh thu khi quả còn xanh; cùng cây với ớt đỏ.', scientific: 'Ớt xanh ít chín; vitamin C, capsaicin.' },
  rau_can: { scientificName: 'Apium graveolens', family: 'Apiaceae', planting: 'Rau cần (cần tây) ưa mát, ẩm. Trồng 25–30 cm. Thu thân lá.', scientific: 'Cần tây giàu vitamin K; thân giòn, dùng nấu/salad.' },
  bong_cai_tim: { scientificName: 'Brassica oleracea var. botrytis', family: 'Brassicaceae', planting: 'Bông cải tím ưa mát; giống súp lơ nhưng màu tím.', scientific: 'Bông cải tím chứa anthocyanin.' },
  rau_mong_toi: { scientificName: 'Basella alba', family: 'Basellaceae', planting: 'Mồng tơi ưa nắng, đất ẩm. Gieo/giâm 20 cm. Thu đọt non.', scientific: 'Mồng tơi giàu sắt, vitamin A; nấu canh.' },
  nam_kim_chanh: { scientificName: 'Flammulina velutipes', family: 'Physalacriaceae', planting: 'Nấm kim châm trồng giá thể đã khử trùng; ẩm, mát. Thu khi nấm dài 10–12 cm.', scientific: 'Nấm kim châm giàu protein, vitamin B.' },
  bi_phap: { scientificName: 'Cucurbita pepo', family: 'Cucurbitaceae', planting: 'Bí Pháp (zucchini Pháp) trồng như bí xanh; quả dài.', scientific: 'Bí Pháp dùng nấu ăn, giàu nước.' },
  rau_thom: { scientificName: 'Nhiều loài', family: 'Lamiaceae/Apiaceae', planting: 'Rau thơm chung cho các loại húng, mùi, quế... Trồng 20–25 cm. Thu lá.', scientific: 'Rau thơm cung cấp tinh dầu, vitamin; gia vị.' },
  rau_ma: { scientificName: 'Centella asiatica', family: 'Apiaceae', planting: 'Rau má ưa ẩm, bóng râm. Trồng cành 10–15 cm. Thu lá.', scientific: 'Rau má dùng nước uống, mát gan; giàu chất chống oxy hóa.' },
  rau_muong_bo: { scientificName: 'Ipomoea aquatica', family: 'Convolvulaceae', planting: 'Rau muống bò (trồng cạn) tương tự rau muống; thu đọt.', scientific: 'Rau muống bò trồng đất ẩm, không ngập nước.' },
  rau_can_ta: { scientificName: 'Apium graveolens', family: 'Apiaceae', planting: 'Cần tây ưa mát; trồng 25–30 cm. Thu thân.', scientific: 'Cần tây giàu vitamin K, folate.' },
  rau_cai_ngo: { scientificName: 'Brassica rapa var. parachinensis', family: 'Brassicaceae', planting: 'Cải ngồng ưa mát; thu ngồng hoa non.', scientific: 'Cải ngồng là phần hoa non; giàu vitamin C.' },
  bi_xiem: { scientificName: 'Cucurbita moschata', family: 'Cucurbitaceae', planting: 'Bí xiêm ưa ấm; quả dài, thịt vàng. Trồng 80 cm.', scientific: 'Bí xiêm dùng nấu canh, chè.' },
  rau_cai_bong: { scientificName: 'Spinacia oleracea', family: 'Amaranthaceae', planting: 'Rau bó xôi (spinach) ưa mát. Gieo 15–20 cm. Thu lá non.', scientific: 'Rau bó xôi giàu sắt, vitamin K, folate.' },
  rau_cai_xoan_xanh: { scientificName: 'Brassica oleracea var. sabellica', family: 'Brassicaceae', planting: 'Cải xoăn xanh trồng như cải xoăn; lá xanh đậm.', scientific: 'Cải xoăn xanh giàu vitamin A, C, K.' },
  nam_dong_co: { scientificName: 'Lentinula edodes', family: 'Omphalotaceae', planting: 'Nấm đông cô trồng trên gỗ/mùn cưa đã khử trùng. Ẩm, mát. Thu khi nấm nở.', scientific: 'Nấm đông cô (shiitake) giàu umami, beta-glucan.' },
  hat_oc_cho: { scientificName: 'Juglans regia', family: 'Juglandaceae', planting: 'Óc chó ưa ôn đới, đất sâu. Cây 8–10 m. Thu khi vỏ nứt.', scientific: 'Hạt óc chó giàu omega-3, vitamin E.' },
  hat_phi: { scientificName: 'Corylus avellana', family: 'Betulaceae', planting: 'Hạt phỉ ưa ôn đới. Cây bụi 4–5 m. Thu khi quả rụng.', scientific: 'Hạt phỉ (hazelnut) giàu vitamin E, chất béo.' },
  hat_hoa_qua: { scientificName: 'Carya illinoinensis', family: 'Juglandaceae', planting: 'Hồ đào (pecan) ưa khí hậu ấm. Cây 15–20 m. Thu khi vỏ nứt.', scientific: 'Hồ đào giàu chất béo, chất chống oxy hóa.' },
};

function getPlantInfo(seedId) { return PLANT_INFO[seedId] || null; }

// Giới hạn úng (flood): 0-100, vượt 80 thì cây chết
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
  { id: 'scan',      name: 'Lượt quét', icon: '📷', price: 30,  desc: 'Thêm 1 lượt quét camera', amount: 1 },
];

function getProductName(key) {
  const s = Object.values(SEEDS).find(x => x.productKey === key);
  return s ? s.name : key;
}

function getProductIcon(key) {
  const s = Object.values(SEEDS).find(x => x.productKey === key);
  return s ? s.icon : '📦';
}
