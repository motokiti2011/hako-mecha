import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionBoardService } from './question-board.service';
import { slipQuestion } from 'src/app/entity/slipQuestion';
import { isNil as _isNil } from 'lodash';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { loginUser } from 'src/app/entity/loginUser';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { MatDialog } from '@angular/material/dialog';

/**
 * 質問モーダル
 */
@Component({
  selector: 'app-question-board',
  templateUrl: './question-board.component.html',
  styleUrls: ['./question-board.component.scss']
})
export class QuestionBoardComponent implements OnInit {

  /** 伝票番号 */
  slipNo = '';
  /** 質問リスト */
  questionList: slipQuestion[] = [];
  /** 表示区分 */
  dispDiv: boolean = false;
  /** 表示区分 */
  emptyMessage: string = 'このサービスへの質問はありません。';
  /** フォーム内容 */
  sernderMessage: string = '';
  /** 質問投稿ボタンdisible制御フラグ */
  isDisabled :boolean = true;
  /** 管理者区分 */
  adminDiv = true;
  /** 回答フラグ */
  anserDiv: boolean = false;
  /** 回答対象 */
  anserIndex = '';
  /** フォームプレスホルダーメッセージ */
  formPlaceholder = '質問はこちらに記入してください。'
  /** ボタンメッセージ */
  buttonMessage = '投稿する'

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
    .position().global().centerHorizontally().centerVertically()
  });
  loading = false;


  constructor(
    public _dialogRef: MatDialogRef<QuestionBoardComponent>,
    private service: QuestionBoardService,
    private apiGsiService: ApiGsiSerchService,
    private overlay: Overlay,
    public modal: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data:{
      serviceId: string,
      userId: string,
      userName: string,
      serviceType: string,
      slipAdmin: boolean
    }
  ) { }

  ngOnInit(): void {
    console.log('初期データ：'+this.data);
    console.log(this.data);
    this.adminDiv = this.data.slipAdmin;
    this.getDispData();
  }



  /**
   * 質問入力フォームが編集された際の監視イベント
   */
  sendMessageCheck() {
    if (this.sernderMessage != '') {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  /**
   * 質問、回答ボタン押下時イベント
   */
  onSubmit() {
    if(this.anserDiv) {
      this.sendAnser();
    } else {
      this.sendQuestion();
    }
  }

  /**
   * 回答した場合のイベント
   */
  onAnser(index: number) {
    console.log(index);
    this.anserIndex = String(index)
    console.log(this.questionList);
    console.log(this.questionList[index]);
    this.anserDiv = true;
    console.log(this.anserDiv);
    this.formPlaceholder = '回答はこちらに記入してください。'
    this.buttonMessage = '回答する'
  }

  /**
   * 回答を止めるボタン押下時
   */
  onStopAnser() {
    this.anserDiv = false;
    this.anserIndex = '';
    this.sernderMessage = '';
    this.formPlaceholder = '質問はこちらに記入してください。'
    this.buttonMessage = '投稿する'
  }

  /**
   * 質問を投稿するボタン
   */
  sendQuestion() {
    if (_isNil(this.sernderMessage) || this.sernderMessage == '') {
      // 空文字の場合登録しない
      return;
    }
    this.service.sernderQuestion(
      this.data.userId, this.data.userName, this.data.serviceId ,this.data.serviceType, this.sernderMessage)
    .subscribe(result => {
      if(result.ResponseMetadata.HTTPStatusCode === 200) {
        // 質問情報のクリア
        this.sernderMessage = '';
      } else {
        this.openMsgDialog(messageDialogMsg.AnResister, false);
      }
      // ローディング解除
      // this.overlayRef.detach();
      this.loading = false;
      this.getDispData()
    });
  }

  /**
   * 回答ボタン押下時
   * @returns
   */
  sendAnser() {
    if(this.anserIndex == '') {
      this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, false);
      this.onStopAnser();
      return;
    }
    if(this.sernderMessage == '') {
      this.openMsgDialog(messageDialogMsg.TextReq, false);
      return
    }
    const index = Number(this.anserIndex);
    this.questionList[index].anserText = this.sernderMessage;
    // ローディング開始
    // this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.service.anserQuestion(this.questionList[index]).subscribe(result => {
      if(result.ResponseMetadata.HTTPStatusCode == 200) {
        this.onStopAnser();
        this.getDispData();
      } else {
        this.openMsgDialog(messageDialogMsg.AnResister, false);
      }
      // ローディング解除
      // this.overlayRef.detach();
      this.loading = false;
    });
  }

  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }



  /***************** 以下内部処理 ************************/

  /**
   * 表示情報を取得する
   */
  private getDispData() {
    // ローディング開始
    // this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    // 表示情報取得
    this.apiGsiService.serchSlipQuestion(this.data.serviceId).subscribe(data => {
      if(data.length !== 0) {
        this.questionList = this.service.anserCheck(data);
        this.dispDiv = true;
      } else {
        this.dispDiv = false;
      }
      // ローディング解除
      // this.overlayRef.detach();
      this.loading = false;
    });
  }



  /**
   * メッセージダイアログ展開
   * @param msg
   * @param locationDiv
   */
  private openMsgDialog(msg:string, locationDiv: boolean) {
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
      if(locationDiv) {
        // this.router.navigate(["/main_menu"]);
      }
      console.log(result);
      // ローディング解除
      // this.overlayRef.detach();
      this.loading = false;
      return;
    });
}

}
