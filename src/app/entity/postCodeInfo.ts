/**
 * 郵便番号検索情報（ハートレイルズ）
 */
export interface postSerchInfo {
  // 市町村
  city: string;
  // 市町村
  city_kana: string;
  // その他住所
  town: string;
  // その他住所
  town_kana: string;
  // x座標
  x: string;
  // y座標
  y: string;
  // 都道府県名
  prefecture: string;
  // 郵便番号
  postal: string;
}


export interface postCodeInfo {
  // 地域コード
  areaCode: string;
  // 郵便番号
  postCode: string;
  // 都道府県名（カナ）
  prefecturesKana: string;
  // 市町村名（カナ）
  municipalityKana: string;
  // 町域名（カナ）
  townAreaKana: string;
  // 都道府県名
  prefectures: string;
  // 市町村
  municipality: string;
  // 町域名
  townArea: string;
  // 都道府県コード
  prefecturesCode: string;
}

