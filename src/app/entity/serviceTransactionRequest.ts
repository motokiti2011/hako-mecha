// サービス取引依頼
export interface serviceTransactionRequest {
  // ID
  id:	string;
  // 伝票番号
  slipNo: string;
  // リクエストＩＤ
  requestId: string;
  // リクエストユーザー名
  requestUserName: string;
  // 申し込みユーザータイプ
  serviceUserType: string;
  // リクエストタイプ
  requestType: string,
  // ファイル
  files: string[];
  // 依頼状況
  requestStatus: string;
  // 確定区分
  confirmDiv: string;
  // 期限
  deadline: string;
  // 登録年月日
  created: string;
  // 更新日時
  updated: string;
}


export const UserType = {
  User: '0',
  Office: '1',
  Mechanic: '2',
} as const;
