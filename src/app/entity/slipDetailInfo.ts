import { slipVehicle } from "./slipVehicle";

export interface slipDetailInfo {
  // 伝票番号
  slipNo: string;
  // 削除区分
  deleteDiv: string;
  // サービスカテゴリー
  category: string;
  // 伝票管理者ユーザーID
  slipAdminUserId: string;
  // 伝票管理者ユーザー名
  slipAdminUserName: string;
  // 管理者区分（どの管理者IDを利用するかどうか）
  adminDiv: string;
  // タイトル
  title: string;
  // サービス地域1
  areaNo1: string;
  // サービス地域2
  areaNo2: string | null;
  // 価格
  price: number;
  // 入札方式
  bidMethod: string;
  // 入札者ID
  bidderId: string;
  // 入札終了日
  bidEndDate: number;
  // 説明
  explanation: string;
  // 表示区分
  displayDiv: string;
  // 工程ステータス
  processStatus: string;
  // 対象サービス内容
  targetService: string;
  // 対象車両ID
  targetVehicleId: string;
  // 対象車両名
  targetVehicleName: string;
  // 車両区分
  targetVehicleDiv: string;  
  // 対象車両情報
  targetVehicleInfo?: slipVehicle | null;
  // 作業場所情報
  workAreaInfo: string;
  // 希望日
  preferredDate: number;
  // 希望時間
  preferredTime: string;
  // 完了日
  completionDate: number;
  // 取引完了日
  transactionCompletionDate: number;
  // サムネイルURL
  thumbnailUrl: string;
  // 画像URLリスト
  imageUrlList: string[];
  // メッセージ公開レベル
  messageOpenLebel: string;
  // 更新ユーザーID
  updateUserId: string;
  // 登録年月日
  created: string;
  // 更新日時
  updated: string;

}

/**
 * 空の伝票情報
 */
export const defaultSlip: slipDetailInfo = {
  // 伝票番号
  slipNo: '',
  // 削除区分
  deleteDiv: '',
  // サービスカテゴリー
  category: '',
  // 伝票管理者ユーザーID
  slipAdminUserId: '',
  // 伝票管理者ユーザー名
  slipAdminUserName: '',
  // 管理者区分
  adminDiv:'0',
  // タイトル
  title: '',
  // サービス地域1
  areaNo1: '',
  // サービス地域2
  areaNo2: '',
  // 価格
  price: 0,
  // 入札方式
  bidMethod: '',
  // 入札者ID
  bidderId: '',
  // 入札終了日
  bidEndDate: 0,
  // 説明
  explanation: '',
  // 表示区分
  displayDiv: '',
  // 工程ステータス
  processStatus: '',
  // 対象サービス内容
  targetService: '',
  // 対象車両ID
  targetVehicleId: '',
  // 対象車両名
  targetVehicleName: '',
  // // 対象車両情報
  // targetVehicleInfo: '',
  // 車両区分
  targetVehicleDiv: '',  
  // 作業場所情報
  workAreaInfo: '',
  // 希望日
  preferredDate: 0,
  // 希望時間
  preferredTime: '',
  // 完了日
  completionDate: 0,
  // 取引完了日
  transactionCompletionDate: 0,
  // サムネイルURL
  thumbnailUrl: '',
  // 画像URLリスト
  imageUrlList: [],
  // メッセージ公開レベル
  messageOpenLebel: '',
  // 更新ユーザーID
  updateUserId: '',
  // 登録年月日
  created: '',
  // 更新日時
  updated: ''
}
