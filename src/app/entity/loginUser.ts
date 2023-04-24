export interface loginUser {
  // ユーザーID
  userId: string;
  // ユーザー名
  userName: string;
  // メカニックID
  mechanicId: string| null;
  // 工場ID
  officeId: string| null;
}
