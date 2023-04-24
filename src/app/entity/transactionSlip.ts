export interface transactionSlip {
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
  // サービスタイトル
  serviceTitle: string;
  // 伝票関係性
  slipRelation: string;
  // 伝票管理者ID
  slipAdminId: string;
  // 伝票管理者名
  slipAdminName: string;
  // 入札者ID
  bidderId: string;
  // 削除区分
  deleteDiv: string;
  // 完了予定日
  completionScheduledDate: string;
  // 作成日時
  created: string;
  // 更新日時
  updated: string;
}


/**
 * 伝票関係性
 */
export const SlipRelation = {
  Admin: "管理者",
  RequestRelation: "依頼関係者",
  ReceivedRelation: "受注関係者",
} as const;
