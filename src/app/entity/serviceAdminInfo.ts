import { baseInfo } from "./officeInfo";
import { evaluationInfo } from "./evaluationInfo";

export interface serviceAdminInfo {
  // 管理者ID
  adminId: string;  
  // 管理者名称
  adminName: string;
  // メールアドレス
  mail: string | null;
  // 電話番号
  telNo: string| null;
  // 郵便番号
  post: string| null;
  // 住所
  adless: string| null;
  // 紹介文
  introduction: string | null;
  // 所属事業所ID
  affiliationOfficeId: string| null;
  // 所属事業所名称
  affiliationOfficeName: string| null;
  // 保有資格情報
  qualification: string[] | null;
  // 得意作業
  specialtyWork: string | null;
  // 業務内容リスト
  workContentList: string[] | null;
  // 営業時間
  businessHours: string[] | null;
  // 拠点情報リスト
  baseInfoList: Array<baseInfo>| null;
  /** 評価情報 */
  evaluationInfo: evaluationInfo| null;
  // プロフィール画像URL
  profileImageUrl: string| null;
}

