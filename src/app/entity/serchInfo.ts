export interface serchInfo {
  category: string;
  title: string;
  areaNo1: string;
  areaNo2: string;
  praiceBottom: string;
  praiceUpper: string;
  bidMethod: string;
  processStatus: string;
  targetVehicleInfo: string;
  workAreaInfo: string;
  Date: string;
  Date2: string;
  preferredDateKey: string;
}


export const serchParam: serchInfo = {
  // カテゴリー
  category: '',
  // タイトル
  title: '',
  // 地域1
  areaNo1: '',
  // 地域２
  areaNo2: '',
  // 価格（下限）
  praiceBottom: '',
  // 価格（上限）
  praiceUpper: '',
  // 入札方式
  bidMethod: '',
  // 工程ステータス
  processStatus: '0',
  // 対象車両
  targetVehicleInfo: '',
  // 作業場所
  workAreaInfo: '',
  // 日付１
  Date: '',
  // 日付２
  Date2: '',
  // 希望日時
  preferredDateKey: ''
}

