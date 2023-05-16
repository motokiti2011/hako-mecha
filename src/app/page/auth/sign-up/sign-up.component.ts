import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { MatDialog } from '@angular/material/dialog';
import { CognitoService } from '../cognito.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

/**
 * 新規登録画面
 */
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {


  title = '新規登録';

  /** 表示切替区分 */
  confirmationDiv = false;
  /** エラーメッセージ */
  dispMsg: any = '';
  userInfo = { userId: '', userName: '', mailAdress: '' }

  loading = false;

  user = {
    loginId: 'login',
    passwd: 'passwd',
    mail: 'email@.com',
    confirmationMail: 'email@.com',
    name: 'yamada',
    area: ''
  }

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private location: Location,
    private cognito: CognitoService,
    private router: Router,
    public modal: MatDialog,
    private overlay: Overlay,
  ) { }

  ngOnInit(): void {
  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }

  show() {
    console.log(1);
  }

  /**
   * 新規ユーザー登録を行う
   * @param email
   * @param password
   * @param userId
   */
  onSignup(email: string, password: string, userId: string) {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.cognito.signUp(userId, password, email)
      .then((result) => {
        this.confirmationDiv = true;
        this.dispMsg = '';
        this.userInfo.userId = userId;
        this.userInfo.userName = '';
        this.userInfo.mailAdress = email;
        console.log(result);
        this.overlayRef.detach();
        this.loading = false;
      }).catch((err) => {
        // this.dispMsg = errorMsg[0].value;
        // if (err == errorMsg[1].message) {
        //   this.dispMsg = errorMsg[1].value;
        // }
        console.log(err);
      });
  }

  /**
   * ユーザー登録後、確認コード入力を行いユーザー登録を完了させる。
   * @param confirmationEmail
   * @param confirmationCode
   */
  onConfirmation(confirmationEmail: string, confirmationCode: string) {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.cognito.confirmation(confirmationEmail, confirmationCode)
      .then((result) => {
        this.dispMsg = '';
        console.log(result);
        this.overlayRef.detach();
        this.loading = false;
        if (result) {
          this.openMsgDialog(messageDialogMsg.Resister, true);
        } else {
          this.openMsgDialog(messageDialogMsg.AnResister, false);
        }
      });
  }

  /**
   * 確認コード入力画面に切り替える場合
   */
  onConfirmSwitch() {
    if (this.confirmationDiv) {
      this.confirmationDiv = false;
    } else {
      this.confirmationDiv = true;
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
        this.router.navigate(["/main_menu"]);
      }
      console.log(result);
      return;
    });
  }

}
