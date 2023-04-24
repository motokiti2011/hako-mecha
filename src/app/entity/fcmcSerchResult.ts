
/**
 * 工場・メカニック検索結果
 */
export interface fcmcSerchResult {
  // ID
  id: string;
  // 名前
  name: string;
  // 電話番号
  tel: string | null;
  // メールアドレス
  mailAdress: string | null;
  // 所在地１（地域）
  area1: string | null;
  // 所在地２（市町村）
  area2: string | null;
  // 所在地（その他）
  adress: string | null;
  // 郵便番号
  postCode: string | null;
  // 紹介文
  introduction: string | null;
  // PR画像URL
  PRimageURL: string | null;
}


export interface fcmcSerchData {
  // 地域1
  area1: string;
  // 地域2
  area2: string;
  // 名称
  name: string;
  // 電話番号
  telNo: string;
}

export const initSerchData: fcmcSerchData = {
  area1: '',
  area2: '',
  name: '',
  telNo: ''
};