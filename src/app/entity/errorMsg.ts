export interface errorMessag {
  // メッセージ
  message: string;
  // 表示メッセージ
  value: string;
}


export const errorMsg: errorMessag[] = [
  {message: 'others', value: 'ユーザー名は少なくとも1文字は入力してください。\nパスワードは以下の条件を満たしてください。\n・最小 8 文字、少なくとも 1 つの数字を含む \n ・少なくとも 1 つの小文字を含む \n ・少なくとも 1 つの大文字を含む \n ・少なくとも 1 つの特殊文字を含む' },
  {message: 'UsernameExistsException: User already exists', value: 'このユーザーは既に存在します。'},
  {message: '', value: '入力が誤っております。もう一度確認の上入力してください。'},
  {message: 'Incorrect username or password.', value: 'ユーザー名またはパスワードが誤ってます。'}
]

