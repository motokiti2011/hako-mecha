import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { user } from 'src/app/entity/user';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { MessageSelectDaialogComponent } from '../message-select-daialog/message-select-daialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-request-modal',
  templateUrl: './transaction-request-modal.component.html',
  styleUrls: ['./transaction-request-modal.component.scss']
})

/**
 * 取引依頼モーダル
 */
export class TransactionRequestModalComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<TransactionRequestModalComponent>,
    public modal: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: user
  ) { }

  // タイトル
  title = '取引依頼';
  // メッセージ
  message = '取引を依頼する対象を選択してください。';
  // モーダル選択項目
  selectItemList: { id: string, value: string }[] = [];

  ngOnInit(): void {
    // 表示設定
    const userItem = { id: '0', value: this.data.userName + 'として取引依頼' }
    const mechanicItem = { id: '2', value: 'メカニックとして取引依頼' }
    const officeItem = { id: '1', value: '整備工場として取引依頼' }
    this.selectItemList.push(userItem);
    if (this.data.mechanicId && this.data.mechanicId != '0') {
      this.selectItemList.push(mechanicItem);
    }
    if (this.data.officeId && this.data.officeId != '0') {
      this.selectItemList.push(officeItem);
    }
  }

  /**
   * ボタン押下イベント
   * @param selected
   */
  onItemClick(selected: string) {
    this.confirmMsgDialog(selected);
  }



  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }


  /**
   * メッセージモーダルを展開する
   * @param mgs
   */
  private confirmMsgDialog(selected: string) {
    // ダイアログ表示（ログインしてください）し前画面へ戻る
    const dialogData: messageDialogData = {
      massage: '取引依頼を送信しますがよろしいですか？',
      closeFlg: false,
      closeTime: 0,
      btnDispDiv: true
    }
    // 確認ダイアログを表示
    const dialogRef = this.modal.open(MessageSelectDaialogComponent, {
      width: '300px',
      height: '200px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._dialogRef.close(selected);
      }
      return;
    });
  }

}
