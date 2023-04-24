export interface slipQuestion {
  // ID
  id: number;
  // 伝票番号
  slipNo: String;
  // 伝票管理ユーザー
  slipAdminUser: String;
  // 質問者ID
  senderId: String;
  // 質問者名
  senderName: String;
  // 質問文
  senderText: String;
  // 解答フラグ
  anserDiv: String;
  // 解答文
  anserText: String;
  // 作成日時
  created: string;
  // 更新日時
  updated: string;
}
