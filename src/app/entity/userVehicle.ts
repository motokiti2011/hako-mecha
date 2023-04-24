export interface userVehicle {
  // 車両ID
  vehicleId: string;
  // ユーザーID
  userId: string;
  // 車両名
  vehicleName: string;
  // 車両区分
  vehicleDiv: string;
  // 車両番号(ナンバー)
  vehicleNo: string;
  // 車両番号(ナンバー)地域名
  vehicleNoAreaName: string;
  // 車両番号(ナンバー)分類番号
  vehicleNoClassificationNum: string;
  // 車両番号(ナンバー)ひらがな
  vehicleNoKana: string;
  // 車両番号(ナンバー)一連指定番号
  vehicleNoSerialNum: string;
  // 車台番号
  chassisNo: string[];
  // 指定類別
  designatedClassification: string;
  // メーカー
  maker: string| null;
  // 車両形状
  form: string| null;
  // カラー
  coler: string;
  // カラーNo.
  colerNo: string;
  // 走行距離
  mileage: number;
  // 初年度登録日
  firstRegistrationDate: string;
  // 車検満了日
  inspectionExpirationDate: string;
  // 更新ユーザーID
  updateUserId: string;
  // 作成日時
  created: string;
  // 更新日時
  updated: string;
}

/**
 * 車両登録番号
 */
export interface vehicleNumberPlate {
  // 地域名
  areaName: string;
  // 分類番号
  classificationNum: string;
  // ひらがな
  kana: string;
  // 一連指定番号
  serialNum: string;
}

/**
 * 初年度登録日
 */
export interface firstRegistrationDate {
  // 元号
  eraName: string;
  // 年
  year: string;
  // 月
  month: string;
}

/**
 * 元号セレクトデータ
 */
export const selectEraName = [
  { id: '0', name: '昭和'},
  { id: '1', name: '平成'},
  { id: '2', name: '令和'}
]

/**
 * カラー
 */
export const selectColoer = [
  { id: '0', name: 'ホワイト'},
  { id: '1', name: 'ブラック'},
  { id: '2', name: 'シルバー'},
  { id: '3', name: 'ゴールド'},
  { id: '4', name: 'グレー'},
  { id: '5', name: 'レッド'},
  { id: '6', name: 'ブルー'},
  { id: '7', name: 'イエロー'},
  { id: '8', name: 'ブラウン'},
  { id: '9', name: 'グリーン'},
  { id: '10', name: 'ピンク'},
  { id: '11', name: 'パープル'},
  { id: '12', name: 'オレンジ'},
  { id: '13', name: 'ライトブルー'},
]


/**
 * 車検満了日
 */
export interface inspectionExpirationDate {
  // 年
  year: string;
  // 月
  month: string;
  // 日
  day: string;
}


