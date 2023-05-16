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

/**
 * パスワード再発行画面
 */
@Component({
  selector: 'app-reissue-passwd',
  templateUrl: './reissue-passwd.component.html',
  styleUrls: ['./reissue-passwd.component.scss']
})
export class ReissuePasswdComponent implements OnInit {

  loading = false;
  /** ユーザー名 */
  userName = '';
  /** メールアドレス */
  email = '';
  /** 表示切替区分 */
  confirmationDiv = false;
  /** エラーメッセージ */
  dispMsg: any = '';

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
   * パスワードを送信するボタン押下イベント
   */
  btnAction() {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.forgotPassword()
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

  /**
   * 確認コード、新パスワード入力イベント
   * @param verificationCode 
   * @param newPassword 
   */
  onConfirmation(verificationCode: string, newPassword: string) {
    this.confirmPassword(verificationCode, newPassword)
  }


  // closeModal() {

  // }

  onDispSwitch() {
    if(this.confirmationDiv) {
      this.confirmationDiv = false;
    } else {
      this.confirmationDiv = true;
    }
  }



  /***************** 以下内部データ  ********************/
  /**
   * パスワード再送信イベント
   * @param username 
   * @param password 
   */
  async forgotPassword(): Promise<any> {
    try {
      await this.cognito.forgotPassword(this.userName, this.email);
      this.openMsgDialog(messageDialogMsg.SendForgotPassword, false);
      this.confirmationDiv = true;
    } catch (e) {
      if (e === null) {
        this.openMsgDialog(messageDialogMsg.ProblemOperationRedirect, false);
      }
    }
  }

  /**
   * 確認コード、新パスワード送信イベント
   * @param username 
   * @param password 
   */
  async confirmPassword(verificationCode: string, newPassword: string): Promise<any> {
    try {
      await this.cognito.confirmPassword(this.userName, verificationCode, newPassword);
      this.openMsgDialog(messageDialogMsg.Changed, true);
      this.confirmationDiv = true;
    } catch (e) {
      if (e === null) {
        this.openMsgDialog(messageDialogMsg.ProblemOperationRedirect, false);
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
