
/** メーカー情報 */
export interface makerInfo {
  id: string,
  name: string
}

/** 国内車両メーカーデータ */
export const domesticVehicleMakerData: makerInfo[] = [
  { id: '0', name: 'トヨタ' },
  { id: '1', name: '日産' },
  { id: '2', name: 'ホンダ' },
  { id: '3', name: 'マツダ' },
  { id: '4', name: 'スバル' },
  { id: '5', name: 'スズキ' },
  { id: '6', name: 'ダイハツ' },
  { id: '10', name: '三菱' },
  { id: '7', name: 'レクサス' },
  { id: '99', name: 'その他' },
];


/** 国外車両メーカーデータ */
export const abroadVehicleMakerData: makerInfo[] = [
  { id: '100', name: 'メルセデス・ベンツ' },
  { id: '101', name: 'BMW' },
  { id: '102', name: 'フォルクスワーゲン' },
  { id: '103', name: 'アウディ' },
  { id: '104', name: 'ミニ' },
  { id: '105', name: 'ポルシェ' },
  { id: '200', name: 'ボルボ' },
  { id: '201', name: 'キャデラック' },
  { id: '202', name: 'シボレー' },
  { id: '203', name: 'フォード' },
  { id: '204', name: 'ハマー' },
  { id: '205', name: 'クライスラー' },
  { id: '206', name: 'ジープ' },
  { id: '300', name: 'ランドローバー' },
  { id: '301', name: 'プジョー' },
  { id: '302', name: 'ルノー' },
  { id: '303', name: 'ジャガー' },
  { id: '400', name: 'フィアット' },
  { id: '401', name: 'アルファロメオ' },
  { id: '999', name: 'その他' },
];


/** 国内バイクメーカーデータ */
export const domesticBikeMakerData: makerInfo[] = [
  { id: '0', name: 'ホンダ' },
  { id: '1', name: 'ヤマハ' },
  { id: '2', name: 'スズキ' },
  { id: '3', name: 'カワサキ' },
  { id: '99', name: 'その他' },
];


/** 国外バイクメーカーデータ */
export const abroadBikeMakerData: makerInfo[] = [
  { id: '100', name: 'ハーレーダビッドソン' },
  { id: '101', name: 'BMW' },
  { id: '102', name: 'ドゥカティ' },
  { id: '103', name: 'トライアンフ' },
  { id: '104', name: 'アプリリア' },
  { id: '999', name: 'その他' },
];

/** 車両形状 */
export const vehicleFormData = [
  {name:'セダン'},
  {name:'ワゴン'},
  {name:'ミニバン'},
  {name:'SUV'},
  {name:'スポーツ'},
  {name:'軽ワゴン'},
  {name:'軽トラック'},
  {name:'トラック'},
  {name:'その他'},
  {name:'該当なし'},
];

/** バイク形状 */
export const bikeFormData = [
  {name:'ネイキッド'},
  {name:'アメリカン'},
  {name:'スポーツ'},
  {name:'ストリート'},
  {name:'ツアラー'},
  {name:'モタード'},
  {name:'オフロード'},
  {name:'アドベンチャー'},
  {name:'オフロード'},
  {name:'トラッカー'},
  {name:'ビッグスクーター'},
  {name:'原付'},
  {name:'原付スクーター'},
  {name:'業務用'},
  {name:'その他'},
  {name:'該当なし'},
];
