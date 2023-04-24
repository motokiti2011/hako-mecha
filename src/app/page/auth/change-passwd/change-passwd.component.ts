import { Component, OnInit } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CognitoService } from '../cognito.service';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { MessageDialogComponent } from '../../modal/message-dialog/message-dialog.component';

@Component({
  selector: 'app-change-passwd',
  templateUrl: './change-passwd.component.html',
  styleUrls: ['./change-passwd.component.scss']
})
export class ChangePasswdComponent implements OnInit {

  loading = false;
  /** 旧パスワード */
  oldPasswd = '';
  /** 新パスワード */
  newPasswd = '';
  /** 確認用パスワード */
  confirmationPasswd = '';
  /** エラーメッセージ */
  errorMsg = '';


  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private cognito: CognitoService,
    private overlay: Overlay,
    public modal: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  /**
   * パスワード入力イベント
   */
  onPasswd() {
    if(!this.newPasswd || !this.oldPasswd || !this.confirmationPasswd ) {
      this.errorMsg = '旧、新、確認用パスワードの入力が必要です。';
    } else if(this.newPasswd != this.confirmationPasswd) {
      this.errorMsg = '新パスワードと確認用パスワードが異なっています。';
    } else {
      this.errorMsg = '';
    }
  }


  /**
   * パスワードを送信するボタン押下イベント
   */
  btnAction() {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.chengePasswd()
      .then((result) => {
        console.log(result);
        this.loading = false;
        this.overlayRef.detach();
      }).catch((err) => {
        console.log(err);
        this.loading = false;
        this.overlayRef.detach();
      });
  }






  /***************** 以下内部データ  ********************/
  /**
   * パスワード再送信イベント
   * @param username
   * @param password
   */
  async chengePasswd(): Promise<any> {
    try {
      await this.cognito.changePassword(this.oldPasswd, this.newPasswd);
      this.openMsgDialog(messageDialogMsg.ChengePassWd, true);
    } catch (e) {
      if (e === null) {
        this.openMsgDialog(messageDialogMsg.ProblemOperationRedirect, true);
      }
    }
  }

  /**
   * メッセージダイアログ展開
   * @param msg
   * @param locationDiv
  */
  private openMsgDialog(msg: string, locationDiv: boolean) {
    // ダイアログ表示（ログインしてください）し前画面へ戻る
    const dialogData: messageDialogData = {
      massage: msg,
      closeFlg: false,
      closeTime: 0,
      btnDispDiv: true
    }
    const dialogRef = this.modal.open(MessageDialogComponent, {
      width: '300px',
      height: '150px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (locationDiv) {
        // this.closeModal();
        this.router.navigate(["/main_menu"]);
      }
      console.log(result);
      // ローディング解除
      this.overlayRef.detach();
      return;
    });
  }

}
