/**
 * 伝票関係性
 */
export const slipRelation = {
  ADMIN: '0', // 管理者
  REQUESTRELATION: '1', // 依頼関係者
  ORDERRELATION: '2', // 受注関係者
  TRADER: '3', // 取引者
  OTHERS: '99', // その他
} as const;
