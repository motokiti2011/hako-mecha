export interface userMyList {
  // ID
  id: string;
  // ユーザーID
  userId: string;
  // メカニックID
  mechanicId: string;
  // 工場ID
  officeId: string;
  // サービスタイプ
  serviceType: string;
  // 伝票番号
  slipNo: string;
  // タイトル
  serviceTitle: string;
  // カテゴリー
  category: string;
  // メッセージ
  message: string;
  // 既読・未読フラグ
  readDiv: string;
  // メッセージ日付
  messageDate: string;
  // メッセージ質問ID
  messageOrQuastionId: string;
  // 入札者ID
  bidderId: string;
  // リクエスト情報
  requestInfo: requestInfo | null;
  // 削除区分
  deleteDiv: string;
  // 作成日時
  created: string;
  // 更新日時
  updated: string;
}

/** リクエスト情報 */
export interface requestInfo {
  // リクエストID
  requestId: string;
  // リクエストタイプ
  requestType: string;
  // リクエスト対象ID
  requestTargetId: string;
  // リクエスト対象名
  requestTargetName: string;
}

/** 表示用マイリスト情報 */
export interface dispUserMyList {
  // No.
  no?: number;
  // id
  id: string;
  // ユーザーID
  userId: string;
  // メカニックID
  mechanicId: string;
  // 工場ID
  officeId: string;
  // サービスタイプ
  serviceType: string;
  // 伝票番号
  slipNo: string;
  // タイトル
  serviceTitle: string;
  // カテゴリー
  category: string;
  // 表示カテゴリー
  dispCategory: string;
  // メッセージ
  message: string;
  // 既読・未読フラグ
  readDiv: string;
  // 表示既読・未読
  dispRead: string;
  // メッセージ日付
  messageDate: string;
  // 表示用メッセージ日付
  dispMessageDate: string;
  // メッセージ質問ID
  messageOrQuastionId: string;
  // 入札者ID
  bidderId: string;
  // 削除区分
  deleteDiv: string;
}

/** マイリストカテゴリー設定値 */
export const MylistCategory = {
  // 運営メッセージ
  operationMessage: '0',
  // メッセージのFrom
  fromMessage: '1',
  // 質問解答
  anserMessage: '2',
  // 管理伝票へのメッセージ
  adminMessage: '3',
  // 管理伝票への質問
  adminQuestion: '4',
  // 管理伝票への入札があった場合
  adminSlipBid: '5',
  // 管理伝票への見積もりが作成された場合
  adminSlipQuote: '6'
}

/** マイリストカテゴリー設定メッセージ */
export const MylistCategoryMessage = {
  // 運営メッセージ
  OPERATION_MSG: '運営からのメッセージが届いてます。',
  // メッセージのFrom
  FORM_MSG: 'メッセージが届いてます。',
  // 質問解答
  ANSER_MSG: '質問に回答があります。',
  // 管理伝票へのメッセージ
  ADMIN_MSG: 'メッセージが届いてます。',
  // 管理伝票への質問
  ADMIN_QA: '質問が来ております。',
  // 管理伝票への入札があった場合
  ADMIN_SLIP_BIT: '入札がありました。',
  // 管理伝票への見積もりが作成された場合
  ADMIN_SLIP_QUOTO: '見積もりが届いております。'
}
