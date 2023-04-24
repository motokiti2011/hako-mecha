// 取引中商品情報
export interface transactionContents {
  // 伝票番号
  slipNo: string;
  // ユーザーID
  userId: string;
  // ユーザー名
  userName: string;
  // タイトル
  title: string;
  // カテゴリー
  category: string;
  // 地域
  area: string;
  // 価格
  price: string;
  // 入札方式
  bidMethod: string;
  // 入札者ID
  bidderId: string;
  // 入札完了日
  bidEndDate: string;
  // 説明
  explanation: string;
  // 表示区分
  displayDiv: string;
  // 希望日
  preferredDate: string;
  // 希望時間
  preferredTime: string;
  // 完了日
  completionDate: string;
  // 削除区分
  deleteDiv: string;
  // 画像url
  imageUrl: string;
  // メッセージ公開レベル
  messageOpenLebel: string;
  // 完了予定日
  completionScheduledDate: number;
  // 取引ステータス
  transactionStatus: string;
}

/**
 *　画面表示用取引情報
 */
export interface dispTransactionContents {
  // ID
  id: number;
  // ユーザーID
  userId: string;
  // ユーザー名
  userName: string;
  // 伝票番号
  slipNo: string;
  // タイトル
  title: string;
  // 価格
  price: string;
  // 画像url
  imageUrl: string;
  // カテゴリー
  category: string;
  // 地域
  area: string;
  // 入札方式
  bidMethod: string;
  // 入札者ID
  bidderId: string;
  // 入札完了日
  bidEndDate: string;
  // 説明
  explanation: string;
  // 表示区分
  displayDiv: string;
  // 希望日
  preferredDate: string;
  // 希望時間
  preferredTime: string;
  // 完了日
  completionDate: string;
  // 期間
  whet: string;
  // 終了日
  endDate: string;
  // 削除区分
  deleteDiv: string;
  // 完了予定日
  completionScheduledDate: number;
  // 取引ステータス
  transactionStatus: string;
  // メッセージ
  message: string| null;
}




/**
 * 取引ステータス
 */
export const TranStatus = {
  ServiceManegement: "サービス管理中",
  ServiceTransaction: "サービス取引中",
  MessageFrom: "メッセージ受信",
  MessageExchange: "メッセージやり取り中",
  Answered: "解答あり",
  Question: "質問中",
} as const;





