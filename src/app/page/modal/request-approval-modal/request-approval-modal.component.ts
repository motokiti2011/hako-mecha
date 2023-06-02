import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { serviceTransactionRequest, UserType } from 'src/app/entity/serviceTransactionRequest';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';

/**
 * 取引依頼承認モーダル
 */
@Component({
  selector: 'app-request-approval-modal',
  templateUrl: './request-approval-modal.component.html',
  styleUrls: ['./request-approval-modal.component.scss']
})
export class RequestApprovalModalComponent implements OnInit {

  // 画面表示データ
  dispItems: serviceTransactionRequest[] = [];

  constructor(
    public modal: MatDialog,
    public _dialogRef: MatDialogRef<RequestApprovalModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: serviceTransactionRequest[]
  ) { }

  ngOnInit(): void {
    // 画面表示処理
    if (this.data.length === 0) {
      // データがない場合
      this.openMsgDialog(messageDialogMsg.NoData, false, false);
      return;
    }
    this.dispItems = this.data;
  }

  /**
   * 依頼内容選択イベント
   * @param item
   */
  onSelect(item: serviceTransactionRequest) {
    let msg = '';
    // メッセージ作成
    if (item.serviceUserType === UserType.User) {
      msg = item.requestUserName + '様からと取引を開始しますか？';
    } else if (item.serviceUserType === UserType.Office) {
      msg = '工場：' + item.requestUserName + 'と取引を開始しますか？';
    } else {
      msg = 'メカニック：' + item.requestUserName + 'と取引を開始しますか？';
    }
    this.openMsgDialog(msg, false, true, item);
  }

  /**
   * 申込ユーザー情報選択イベント
   */
  onRequestUserSelect(item: serviceTransactionRequest) {
    // ユーザータイプに応じた照会画面を別タブにて開く
    console.log(item.requestUserName)

  }


  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }


  /******************************** 以下内部処理 **********************************/

  /**
   * 承認した取引依頼を返却する。
   */
  private sendResult(item: serviceTransactionRequest) {
    this._dialogRef.close(item);
  }

  /**
   * メッセージダイアログ展開
   * @param msg
   * @param locationDiv
   */
  private openMsgDialog(msg: string, locationDiv: boolean, btnType: boolean, item?: serviceTransactionRequest) {
    // メッセージ表示し前画面へ戻る
    const dialogData: messageDialogData = {
      massage: msg,
      closeFlg: false,
      closeTime: 0,
      btnDispDiv: btnType
    }
    const dialogRef = this.modal.open(MessageDialogComponent, {
      width: '350px',
      height: '150px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (item && result) {
        this.sendResult(item);
        return;
      }
      if (locationDiv) {
        // モーダルを閉じる
        this.closeModal();
        console.log(result);
        return;
      }
    });
  }
}
