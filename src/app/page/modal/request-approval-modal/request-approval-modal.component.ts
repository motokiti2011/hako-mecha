import { Component, Inject,  OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';


/**
 * 取引依頼承認モーダル
 */
@Component({
  selector: 'app-request-approval-modal',
  templateUrl: './request-approval-modal.component.html',
  styleUrls: ['./request-approval-modal.component.scss']
})
export class RequestApprovalModalComponent implements OnInit {



  constructor(
    public modal: MatDialog,
    public _dialogRef: MatDialogRef<RequestApprovalModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: serviceTransactionRequest[]
  ) { }

  ngOnInit(): void {
    // 画面表示処理
    if(this.data.length === 0) {

    }
  }

  /**
   * 依頼内容選択イベント
   * @param item
   */
  onSelect(item: serviceTransactionRequest) {

  }

  /**
   * 申込ユーザー情報選択イベント
   */
  onRequestUserSelect(item: serviceTransactionRequest) {

  }


  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }


  /******************************** 以下内部処理 **********************************/

  /**
   *
   */
  private sendResult(item: serviceTransactionRequest) {

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
      width: '300px',
      height: '150px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if(item && result) {
        this.sendResult(item);
        return;
      }
      if(locationDiv) {
        // モーダルを閉じる
        this.closeModal();
        console.log(result);
        return;
      }
    });
  }

}
