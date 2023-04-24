import { publicInfo, initPublicInfo } from "./publicInfo";

export interface officeInfo {
  // 事業所ID
  officeId: string;
  // 事業所名
  officeName: string;
  // 事業所電話番号リスト
  officeTel: string[];
  // 事業所メールアドレス
  officeMailAdress: string;
  // 事業所所在地１（地域）
  officeArea1: string;
  // 事業所所在地２（市町村）
  officeArea: string;
  // 事業所所在地（その他）
  officeAdress: string;
  // 事業所郵便番号
  officePostCode: string;
  // 業務内容リスト
  workContentList: string[];
  // 営業時間
  businessHours: string[];
  // 関連工場情報
  connectionOfficeInfo?: Array<connectionOfficeInfo> | null;
  // 関連メカニック情報
  connectionMechanicInfo?: Array<connectionMechanicInfo>;
  // 管理者設定情報
  adminSettingInfo: Array<adminSettingInfo>;
  // 事業所PR
  officePR: string;
  // 事業所PR画像URL
  officePRimageURL: string;
  // 事業所形態リスト
  officeFormList: Array<officeForm> | null;
  // 公開設定情報
  publicInfo: publicInfo;
  // 作成日
  created: string;
}

// 関連工場情報
export interface connectionOfficeInfo {
  // 事業所ID
  officeId: string;
  // 事業所名
  officeName: string;
  // 事業所関係性区分
  officeAssociationDiv: string | null;
  // 事業所関係性
  officeAssociation: string | null;
}

// 関連メカニック情報
export interface connectionMechanicInfo {
  // メカニックID
  mechanicId: string;
  // メカニック名
  mechanicName: string;
  // 所属区分
  belongsDiv: string | null;
  // 所属
  belongs: string | null;
}

// 管理者設定情報
export interface adminSettingInfo {
  // メカニックID
  mechanicId: string;
  // メカニック名
  mechanicName: string;
  // 所属区分
  belongsDiv: string | null;
  // 所属
  belongs: string | null;
  // 役割
  role: string;
  // 役割区分
  roleDiv: string;
}


/**
 * 拠点情報
 */
export interface baseInfo {
  // 事業所ID
  officeInfo: string;
  // 事業所名
  officeName: string| null;
  // 事業所関係性
  officeAssociation: string| null;
}

/**
 * 従業員
 */
export interface employee {
  // メカニックID
  mechanicId: string;
  // メカニック名
  mechanicName: string| null;
  // 所属区分
  belongsDiv: string| null;
}

/**
 * 事業形態
 */
export interface officeForm {
  // 業務形態区分
  officeFormDiv: string;
  // 業務形態区分名称
  officeFormDivName: string| null;
}


export const initOfficeInfo = {
  // 事業所ID
  officeId: '',
  // 事業所名
  officeName: '',
  // 事業所電話番号リスト
  officeTel: [],
  // 事業所メールアドレス
  officeMailAdress: '',
  // 事業所所在地１
  officeArea1: '',
  // 事業所所在地２
  officeArea: '',
  // 事業所所在地
  officeAdress: '',
  // 事業所郵便番号
  officePostCode: '',
  // 業務内容リスト
  workContentList: [],
  // 営業時間
  businessHours: [],
  // 関連工場情報
  connectionOfficeInfo: [],
  // 関連メカニック情報
  connectionMechanicInfo: [],
  // 管理者設定情報
  adminSettingInfo: [],
  // // 管理拠点ID
  // adminBaseId: '',
  // // 拠点情報リスト
  // baseInfoList: [],
  // // 管理者IDリスト
  // adminIdList: [],
  // // 従業員リスト
  // employeeList: [],
  // 事業所PR
  officePR: '',
  // 事業所PR画像URL
  officePRimageURL: '',
  // 業務形態区分リスト
  officeFormList: null,
  // 公開情報
  publicInfo: initPublicInfo,
  // 作成日
  created: ''
}
