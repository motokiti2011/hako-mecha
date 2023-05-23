import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ServiceTransactionService } from './service-transaction.service';
import { slipDetailInfo, defaultSlip } from 'src/app/entity/slipDetailInfo';
import { QuestionBoardComponent } from 'src/app/page/modal/question-board/question-board/question-board.component';
import { OpenLevelComponent } from 'src/app/page/modal/open-level/open-level/open-level.component';
import { TransactionMessageComponent } from './transaction-message/transaction-message/transaction-message.component';
import { MessagePrmReqComponent } from 'src/app/page/modal/message-prm-req/message-prm-req/message-prm-req.component';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { TransactionApprovalModalComponent } from 'src/app/page/modal/transaction-approval-modal/transaction-approval-modal/transaction-approval-modal.component';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { messageDialogMsg } from 'src/app/entity/msg';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';

@Component({
  selector: 'app-service-transaction',
  templateUrl: './service-transaction.component.html',
  styleUrls: ['./service-transaction.component.scss']
})
export class ServiceTransactionComponent implements OnInit {

  /** 子コンポーネントを読み込む */
  @ViewChild(TransactionMessageComponent) child!: TransactionMessageComponent;

  /** 表示伝票番号 */
  dispSlipId: string = '';
  /** 伝票タイトル */
  dispTitle = '';
  /** 伝票日付 */
  dispYmd = '';
  /** 伝票価格 */
  dispPrice = 0;
  /** 伝票地域 */
  dispArea = '';
  /** 伝票説明 */
  dispExplanation = '';
  /** 管理者フラグ */
  adminUserDiv: boolean = false;
  /** 一部公開フラグ */
  openDiv: boolean = false;
  /**  非公開フラグ　*/
  privateDiv: boolean = false;
  /** 許可済ユーザー */
  parmUserDiv = false;
  /** アクセスユーザー情報 */
  acsessUser = { userId: '', userName: '', mechanicId: '', officeId: '' }
  /** 伝票情報 */
  slip: slipDetailInfo = defaultSlip;
  /** 伝票タイプ */
  serviceType = '';
  /** 取引依頼 */
  tranReq: serviceTransactionRequest[] = [];
  /** 管理者ID */
  slipAdminCheckId = '';
  /** 取引対象 */
  transactionTarget = false;

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private service: ServiceTransactionService,
    public questionBoardModal: MatDialog,
    public modal: MatDialog,
    private cognito: CognitoService,
    private overlay: Overlay,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    // 伝票表示情報取得反映
    this.route.queryParams.subscribe(params => {
      this.dispSlipId = params['slipNo'];
      this.serviceType = params['serviceType'];
      console.log('serviceTypeX:' + this.serviceType);
      this.service.getService(this.dispSlipId, this.serviceType).subscribe(data => {
        this.slip = data;
        this.dispTitle = this.slip.title;
        this.dispYmd = String(this.slip.completionDate);
        if (this.slip.bidMethod == '1' || this.slip.bidMethod == '41') {

          this.dispPrice = Number(this.slip.price);
        }
        this.dispArea = this.service.areaNameSetting(this.slip.areaNo1) + this.slip.areaNo2;
        this.dispExplanation = this.slip.explanation;
        this.serviceType = this.slip.targetService;
        this.initChatArea(this.slip);
      });
    });
  }

  AfterViewChecked() {
    // メッセージメニュー画面の初期化
    this.child.onShow(this.dispSlipId, this.acsessUser.userId);
  }

  /**
   * チャットエリアの表示設定を行う
   */
  private initChatArea(slip: slipDetailInfo) {
    // 認証ユーザー情報取得
    const user = this.cognito.initAuthenticated();
    if (user !== null) {
      // this.setAcsessUser();
      this.acsessUser.userId = user;
      this.service.getSendName(user).subscribe(user => {
        if (user.length === 0) {
          this.apiAuth.authenticationExpired();
          // ローディング解除
          this.overlayRef.detach();
          this.loading = false;
          this.openMsgDialog(messageDialogMsg.LoginRequest, true);
          return;
        }
        this.acsessUser.userName = user[0].userName;
        this.acsessUser.mechanicId = user[0].mechanicId;
        this.acsessUser.officeId = user[0].officeId;
        // 管理者判定
        this.slipAdminCheckId = this.acsessUser.userId;
        if (this.serviceType == '1') {
          this.slipAdminCheckId = this.acsessUser.officeId;
        } else if (this.serviceType == '2') {
          this.slipAdminCheckId = this.acsessUser.mechanicId;
        }
        this.service.slipAuthCheck(this.dispSlipId, this.slipAdminCheckId, this.serviceType).subscribe(result => {
          // 取得できない場合
          if (result.length === 0) {
            // 閲覧者設定を行う
            this.browseSetting(slip, user);
          } else {
            // 管理者区分ON
            this.adminUserDiv = true;
            // 取引依頼情報取得
            this.service.getTranReq(slip.slipNo).subscribe(re => {
              this.tranReq = re;
              // ローディング解除
              this.overlayRef.detach();
              this.loading = false;
              // // メッセージメニュー画面の初期化
              // this.child.onShow(this.dispSlipId, this.acsessUser.userId);
            });
          }
        });
      });
    } else {
      this.apiAuth.authenticationExpired();
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
      this.openMsgDialog(messageDialogMsg.LoginRequest, true);
    }
  }

  /**
   * 閲覧者設定
   */
  private browseSetting(slip: slipDetailInfo, userId: string) {
    if (slip.messageOpenLebel == '2') {
      // 一部公開の場合許可済みユーザーかを確認
      this.service.isSlipUserPermission(slip.slipNo, userId).subscribe(re => {
        if (re) {
          // 許可済みユーザーの場合チャット許可する
        } else {
          // 未許可の場合　一時許可ボタンを表示
          this.openDiv = true;
          // チャット未許可表示を行う
        }
        this.transactionReqUserCheck();
        // ローディング解除
        this.overlayRef.detach();
        this.loading = false;
      });
    } else if (slip.messageOpenLebel == '3') {
      // 非公開の場合　非公開表示をする
      this.privateDiv = true;
      this.transactionReqUserCheck();
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    }
  }

  /**
   * 取引依頼中ユーザーかを確認する
   */
  private transactionReqUserCheck() {
    // TODO 引数のServiceTypeはこのままで大丈夫かは後日検討要
    this.service.transactionReqUserCheck(this.dispSlipId, this.acsessUser.userId, this.serviceType).subscribe(res => {
      this.transactionTarget = res;
    });
  }

  /**
   * 取引中ユーザーかを確認する
   */
  private transactionUserCheck() {
    this.service.transactionUserCheck(this.dispSlipId, this.acsessUser.userId, this.serviceType).subscribe(res => {
      this.transactionTarget = res;
    });
  }


  /**
   * 質問モーダルを展開する
   */
  onQuestion() {
    console.log('サービスタイプ:' + this.serviceType)
    this.questionBoardModal.open(QuestionBoardComponent, {
      width: '600px',
      height: '800px',
      data: {
        serviceId: this.dispSlipId,
        userId: this.acsessUser.userId,
        userName: this.acsessUser.userName,
        serviceType: this.serviceType,
        slipAdmin: this.adminUserDiv
      }
    });
  }

  /**
   * メッセージ公開レベルを設定する(伝票管理者用)
   */
  onOpenLevelSet() {
    const dialogRef = this.modal.open(OpenLevelComponent, {
      width: '50vh',
      height: '50vh',
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {
      this.service.postMessageLevel(this.slip, String(result)).subscribe(data => {
        console.log(data.messageOpenLebel)
      });
    });
  }

  /**
   * メッセージ許可申請を行う(伝票閲覧者用)
   */
  onMsgPrmReq() {
    // 許可済ユーザーまたは申請中の場合キャンセル確認を行う
    // 取得
    let title = '';
    if (this.parmUserDiv) {
      title = '申請を取り消しますか？'
    }
    const dialogRef = this.modal.open(MessagePrmReqComponent, {
      width: '400px',
      height: '200px',
      data: this.parmUserDiv
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        // メッセージ許可ユーザーの更新をおこなう（取消、追加はサーバーサイドでおこなう）
        if (result) {
          this.service.messagePrmReq(this.acsessUser.userId, this.acsessUser.userName, this.dispSlipId);
        }
      }
      console.log(result);
    });
  }

  /**
   * 詳細画面に戻る
   */
  onReturn() {
    this.location.back();
  }

  /**
   * 一覧画面に遷移する。
   */
  onServiceList() {
    this.router.navigate(["service_list"],
      { queryParams: { areaNum: 0, category: 0 } });
  }


  /**
   * 取引依頼するボタン押下イベント
   */
  onTransactionRequest() {
    console.log(this.slip);
    this.service.transactionReq(this.slip, this.acsessUser.userId, this.acsessUser.userName, this.serviceType).subscribe(
      result => {
        console.log(result)
      });
  }

  /**
   * 取引を承認するボタン押下イベント
   */
  onTransactionApproval() {
    const dialogRef = this.modal.open(TransactionApprovalModalComponent, {
      width: '400px',
      height: '450px',
      data: this.tranReq
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        if (result !== null && result !== '') {
          if (result == undefined) {
            // TODO
            return;
          } else {
            this.service.approvalTransaction(result, this.slipAdminCheckId).subscribe(res => {
              console.log(res);
            })
          }
        } else {
          // 戻るボタンまたはモーダルが閉じられたのでなにもしない
          return;
        }
      }
    );
  }



  /**
   * メッセージモーダルを展開する
   * @param mgs
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
      console.log(result);
      if (locationDiv) {
        this.loading = false;
        this.overlayRef.detach();
        this.router.navigate(["/main_menu"]);
      }
      return;
    });
  }



}
