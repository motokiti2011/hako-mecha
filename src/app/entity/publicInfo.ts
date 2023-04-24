import { baseInfo } from "./officeInfo";
import { evaluationInfo } from "./evaluationInfo";

/**
 * 公開情報
 */
export interface publicInfo {
  // 管理者名称
  adminNamePublicDiv: string;
  // メールアドレス
  mailPublicDiv: string;
  // 電話番号
  telNoPublicDiv: string;
  // 郵便番号
  postPublicDiv: string;
  // 住所
  adlessPublicDiv: string;
  // 紹介文
  introductionPublicDiv: string;
  // 所属事業所名称
  affiliationOfficeNamePublicDiv: string;
  // 保有資格情報
  qualificationPublicDiv: string;
  // 得意作業
  specialtyWorkPublicDiv: string;
  // 業務内容リスト
  workContentListPublicDiv: string;
  // 営業時間
  businessHoursPublicDiv: string;
  // 拠点情報リスト
  baseInfoListPublicDiv: string;
  /** 評価情報 */
  evaluationInfoPublicDiv: string;
  // プロフィール画像URL
  profileImageUrlPublicDiv: string;
}

export const initPublicInfo: publicInfo = {
  // 管理者名称
  adminNamePublicDiv: '0',
  // メールアドレス
  mailPublicDiv: '0',
  // 電話番号
  telNoPublicDiv: '0',
  // 郵便番号
  postPublicDiv: '0',
  // 住所
  adlessPublicDiv: '0',
  // 紹介文
  introductionPublicDiv: '0',
  // 所属事業所名称
  affiliationOfficeNamePublicDiv: '0',
  // 保有資格情報
  qualificationPublicDiv: '0',
  // 得意作業
  specialtyWorkPublicDiv: '0',
  // 業務内容リスト
  workContentListPublicDiv: '0',
  // 営業時間
  businessHoursPublicDiv: '0',
  // 拠点情報リスト
  baseInfoListPublicDiv: '0',
  /** 評価情報 */
  evaluationInfoPublicDiv: '0',
  // プロフィール画像URL
  profileImageUrlPublicDiv: '0'
}