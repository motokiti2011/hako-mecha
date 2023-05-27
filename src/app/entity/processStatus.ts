/**
 * 工程ステータス
 */
export const processStatus = {
  EXHIBITING: '0', // 出品中
  SURINGTRADING: '1', // 取引中
  ENDOFTRANSACTION: '2', // 取引終了
  EXPIRED: '3', // 期限切れ
  CANCEL: '4', // 取消
  TRANSACTIONCOMPLETION: '5', // 取引完了日オーバー
  DURINGTRANSACTIONCONFIRMATION: '6',  // 取引中（確定）
  DELETE: '99', // 削除
} as const;
