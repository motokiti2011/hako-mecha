/** 
 * 伝票メッセージ許可ユーザーテーブル
 */
export interface slipMegPrmUser {
  // 伝票番号
  slipNo: string;
  // 管理者ID
  slipAdminUser: string;
  // 許可済ユーザーリスト
  permissionUserList: Array<slipPermissionUser>;
}


/**
 * 許可済ユーザー情報
 */
export interface slipPermissionUser {
  // ユーザーID
  userId: string;
  // ユーザー名
  userName: string;
  // 許可区分
  parmissionDiv: string;
}
