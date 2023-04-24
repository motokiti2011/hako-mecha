import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { Overlay } from '@angular/cdk/overlay';
import { user } from 'src/app/entity/user';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { MessageSelectDaialogComponent } from 'src/app/page/modal/message-select-daialog/message-select-daialog.component';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { inquiryInfo, initInquiryInfo } from 'src/app/entity/inquiryInfo';

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.scss']
})
export class InquiryComponent implements OnInit {

  // ユーザー情報
  user?: user;

  // お問い合わせ情報
  inquiryInfo: inquiryInfo = initInquiryInfo;

  /** フォームコントロール */
  name = new FormControl('', [
    Validators.required
  ]);

  mail = new FormControl('', [
    Validators.required
  ]);

  content = new FormControl('', [
    Validators.required
  ]);

  /** お問い合わせ送信先データ */
  categoryData = { id: '', value: '' };
  /** 管理ユーザーセレクト */
  categorySelect = '';


  /** フォームグループオブジェクト */
  groupForm = this.builder.group({
    name: this.name,
    mail: this.mail,
    content: this.content,
  })


  /** ローディングオーバーレイ */
  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private builder: FormBuilder,
    private cognito: CognitoService,
    private router: Router,
    public modal: MatDialog,
    private overlay: Overlay,
    private apiService: ApiSerchService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    // ログイン状態確認
    const authUser = this.cognito.initAuthenticated();
    if (authUser) {
      this.setUserInfo(authUser);
    }
    else {
      this.setContents();
    }
  }

  /**
   * 送信するボタン押下イベント
   */
  getResult() {
    // ダイアログ表示（ログインしてください）し前画面へ戻る
    const dialogData: messageDialogData = {
      massage: messageDialogMsg.ConfirmSendReq,
      closeFlg: false,
      closeTime: 0,
      btnDispDiv: true
    }
    const dialogRef = this.modal.open(MessageSelectDaialogComponent, {
      width: '380px',
      height: '180px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      // OKの場合
      if (result) {
        this.postInquiry();
      } else {
        // キャンセルの場合
        this.overlayRef.detach();
      }
      return;
    });
  }



  //******************************   以下内部処理 *******************************************/

  /**
   * ユーザー情報を取得する
   * @param userId
   */
  private setUserInfo(userId: string) {
    this.apiService.getUser(userId).subscribe(data => {
      if (data[0]) {
        this.user = data[0];
      }
      this.setContents();
      // ローディング解除
      this.overlayRef.detach();
    });
  }

  /**
   * 画面表示データを設定する
   */
  private setContents() {
    if (this.user) {
      this.inquiryInfo.inquiryUserId = this.user.userId;
      this.inquiryInfo.inquiryUserName = this.user.userName;
      this.inquiryInfo.inquiryMailAdless = this.user.mailAdress;
      this.name.setValue(this.user.userName);
      this.mail.setValue(this.user.mailAdress);
    } else {
      this.inquiryInfo.inquiryUserId = '0';
      this.inquiryInfo.inquiryUserId = '';
    }
    // ローディング解除
    this.overlayRef.detach();
  }

  /**
   * お問い合わせ情報を送信する
   */
  private postInquiry() {
    this.inquiryInfo.inquiryUserName = this.name.value;
    this.inquiryInfo.inquiryMailAdless = this.mail.value;
    this.inquiryInfo.inquiryUserContents = this.content.value;
    this.apiService.postInquiry(this.inquiryInfo).subscribe(data => {
      if (data === 200) {
        this.openMsgDialog(messageDialogMsg.Sender, true);
      } else {
        this.openMsgDialog(messageDialogMsg.AnSender, false);
      }
    });
  }



  /**
   * メッセージダイアログ展開
   * @param msg
   * @param locationDiv
   */
  private openMsgDialog(msg: string, locationDiv: boolean) {
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
      // ローディング解除
      this.overlayRef.detach();
      return;
    });
  }





}
