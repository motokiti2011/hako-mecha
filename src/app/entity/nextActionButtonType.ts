
export interface ModalData {
  title:string,
  message:string,
  nextActionList:nextAction[],
  resultAction:string,
}

export interface nextAction {
  nextId:string,
  nextAction:string
}


export const nextActionButtonType = {
  TOP: '0',
  MYMENU: '1',
  SERVICECREATE: '2',
  SERVICEDETAEL: '3',
};

export const nextActionTitleType = {
  SUCSESSMESSAGE: '登録に成功しました。',
  ERRORMESSAGE: '登録に失敗しました。'
}

export const nextActionMessageType = {
  NEXTMESSAGE: '次の操作を選んでください。'
}

export const nextActionButtonTypeMap = {
  // '0': 'トップメニューに\n戻る',
  // '1': 'マイメニューへ\n移動する',
  // '2': '次のサービスを\n作成する',
  // '3': 'サービス詳細を\n確認する',
  '0': 'トップメニューに戻る',
  '1': 'マイメニューへ移動する',
  '2': '次のサービスを作成する',
  '3': 'サービス詳細を確認する',
};

