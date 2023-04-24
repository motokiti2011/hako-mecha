/** ユーザーお気に入り情報 */
export interface userFavorite {
  // ID
  id: string;
  // ユーザーID
  userId: string;
  // 伝票番号
  slipNo: string;
  // タイトル
  title: string;
  // 価格
  price: number;
  // 期間
  whet: string;
  // サービスタイプ
  serviceType: string;
  // 終了日
  endDate: number;
  // 画像url
  imageUrl:string;
  // 作成日時
  created: string;
  // 更新日時
  updated: string;
}
