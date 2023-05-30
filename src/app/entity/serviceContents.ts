import { slipVehicle } from "./slipVehicle";

// サービス内容
export interface serviceContents {
  // ID
  id:	string;
  // ユーザーID
  userId: string;
  // ユーザー名
  userName: string;
  // メカニックID
  mechanicId: string |null,
  // メカニック名
  mechanicName: string |null,
  // オフィスID
  officeId: string |null,
  // オフィス名
  officeName: string |null,
  // タイトル
  title: string;
  // 作業場所
  workArea: string;
  // 価格
  price: number;
  // 地域1
  area1: string;
  // 地域2
  area2: string | null;
  // カテゴリー
  category:string;
  // 車両区分
  vehicleDiv: string;
  // 対象車両
  targetVehcle: slipVehicle | null;
  // 入札方式
  bidMethod: string;
  // 説明
  explanation: string;
  // 入札者ID
  bidderId: number;
  // お気に入りフラグ
  favoriteFlg:boolean;
  // 登録日
  registeredDate: number
  // 希望日
  preferredDate:number;
  // 希望時間
  preferredTime:number;
  // メッセージ公開レベル
  msgLv: string;
  // 画像url
  thumbnailUrl: string;
  // 画像urlリスト
  imageUrlList: string[]| null;
  // 論理削除フラグ
  logicalDeleteFlag: number;
  // 対象サービス内容
  serviceType: string;
}

export const initServiceContent:serviceContents = {
  id: '0',
  userId: '0',
  userName: '',
  mechanicId: null,
  mechanicName: null,
  officeId: null,
  officeName: null,
  title: '',
  workArea: '',
  price: 0,
  area1: '',
  area2: '',
  category: '0',
  bidMethod: '1',
  targetVehcle: null,
  vehicleDiv: '',
  explanation: '',
  bidderId: 0,
  favoriteFlg:false,
  registeredDate: 0,
  preferredDate: 0,
  preferredTime: 0,
  msgLv:'1',
  thumbnailUrl:'',
  imageUrlList:null,
  logicalDeleteFlag: 0,
  serviceType: '0'
}
