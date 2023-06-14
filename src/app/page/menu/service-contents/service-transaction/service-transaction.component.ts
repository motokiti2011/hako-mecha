import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ServiceTransactionService } from './service-transaction.service';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { salesServiceInfo, defaulsalesService } from 'src/app/entity/salesServiceInfo';
import { QuestionBoardComponent } from 'src/app/page/modal/question-board/question-board/question-board.component';
import { OpenLevelComponent } from 'src/app/page/modal/open-level/open-level/open-level.component';
import { TransactionMessageComponent } from './transaction-message/transaction-message/transaction-message.component';
import { MessagePrmReqComponent } from 'src/app/page/modal/message-prm-req/message-prm-req/message-prm-req.component';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { MessageSelectDaialogComponent } from 'src/app/page/modal/message-select-daialog/message-select-daialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { TransactionApprovalModalComponent } from 'src/app/page/modal/transaction-approval-modal/transaction-approval-modal/transaction-approval-modal.component';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { messageDialogMsg } from 'src/app/entity/msg';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';
import { TransactionRequestModalComponent } from 'src/app/page/modal/transaction-request-modal/transaction-request-modal.component';
import { user } from 'src/app/entity/user';
import { processStatus } from 'src/app/entity/processStatus';
import { slipRelation } from 'src/app/entity/slipRelation';

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
  slip: salesServiceInfo = defaulsalesService;
  /** 伝票タイプ */
  serviceType = '';
  /** 管理者ID */
  slipAdminCheckId = '';
  /** 工程 */
  processStatus = '0';
  /** 取引対象 */
  transactionTarget = false;
  /** 取引依頼情報 */
  tranReqList: serviceTransactionRequest[] = [];

  // アクセスユーザー情報
  userInfo?: user;
  /** 取引依頼済区分 */
  tranReqDiv = false;
  /** 取引完了ボタン区分 */
  tranCompBtnDiv = false;

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
      // 伝票取得
      this.service.getService(this.dispSlipId, this.serviceType).subscribe(data => {
        if(!data) {
          this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, true);
          return;
        }
        this.defaltDispSetting(data);
      });
    });
  }

  AfterViewChecked() {
    // メッセージメニュー画面の初期化
    this.child.onShow(this.dispSlipId, this.acsessUser.userId);
  }



    /**
   * 取引を完了するボタン押下イベント
   */
    onCompletedTransaction() {

      const msg = 'この取引を終了しますがよろしいですか？';
      this.selectMsgDialog(msg).subscribe(result => {
        if (!result) {
          return;
        }
        if(!this.slip) {
          this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, true);
          return;
        }
        this.service.completedTransaction(this.slip.slipNo, this.slip.serviceType, this.acsessUser.userId).subscribe(res => {
          if (res) {
            this.slip = res;
            // 完了済伝票の表示を行う
            // this.completionDisp();
          }
        });
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
      if(!this.slip) {
        this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, true);
        return;
      }
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
   * 取引依頼を確認するボタン押下イベント
   */
  onRequest() {
    this.requestApproval();
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
    // 取引依頼ダイアログを開く
    // ダイアログ表示（ログインしてください）し前画面へ戻る
    const dialogData: user = this.userInfo as user;
    // 確認ダイアログを表示
    const dialogRef = this.modal.open(TransactionRequestModalComponent, {
      width: '300px',
      height: '150px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.sendTransactionReq(result)
      }
      return;
    });
  }

  /**
   * 取引を承認するボタン押下イベント
   */
  onTransactionApproval() {
    const dialogRef = this.modal.open(TransactionApprovalModalComponent, {
      width: '400px',
      height: '450px',
      data: this.tranReqList
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        if (result !== null && result !== '') {
          if (result == undefined) {
            // TODO
            return;
          } else {
            this.service.approvalTransaction(result, this.slipAdminCheckId, this.serviceType).subscribe(res => {
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


  /************************ 以下内部処理 **************************************/

  /**
   * 基本の画面表示設定を行う
   * @param service
   */
  private defaltDispSetting(service: salesServiceInfo) {
    // 表示項目作成
    this.slip = service;
    this.dispTitle = service.title;
    this.dispYmd = String(service.completionDate);
    this.processStatus = service.processStatus;
    if (service.bidMethod == '1' || service.bidMethod == '41') {
      this.dispPrice = Number(service.price);
    }
    this.dispArea = this.service.areaNameSetting(service.areaNo1) + service.areaNo2;
    this.dispExplanation = service.explanation;
    this.serviceType = service.serviceType;

    if (service.processStatus == processStatus.EXHIBITING) {
      // 初期のメッセージエリア表示設定と管理者チェックを行う
      this.initChatArea(service);
    } else if(service.processStatus == processStatus.EXPIRED) {
      // 期限切れ表示設定
    } else {
      // 取引中表示設定
      this.transactionDispSetting();
    }
  }

  /**
   * チャットエリアの表示設定を行う
   */
  private initChatArea(slip: slipDetailInfo) {
    // 認証ユーザー情報取得
    const acceseUser = this.cognito.initAuthenticated();
    if (acceseUser !== null) {
      this.service.getSendName(acceseUser).subscribe(user => {
        if (user.length === 0) {
          this.apiAuth.authenticationExpired();
          // ローディング解除
          this.overlayRef.detach();
          this.loading = false;
          this.openMsgDialog(messageDialogMsg.LoginRequest, true);
          return;
        }
        this.userInfo = user[0];
        if(!this.slip) {
          this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, true);
          return;
        }
        // アクセス者の管理者チェック
        this.service.accessUserAdminCheck(this.slip.slipNo, acceseUser, this.serviceType).subscribe(res => {
          // 管理者区分に設定
          this.adminUserDiv = res;
          if (!res) {
            // 閲覧者設定を行う
            this.browseSetting(slip, acceseUser);
          } else {
            // 管理者の場合、取引依頼情報取得
            this.service.getTranReq(slip.slipNo).subscribe(re => {
              this.tranReqList = re;
              // ローディング解除
              this.overlayRef.detach();
              this.loading = false;
            });
          }
        })
      });
    } else {
      // 認証切れ
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
    // メッセージ公開レベルに応じた設定を行う
    if (slip.messageOpenLebel == '2') {
      // 一部公開の場合許可済みユーザーかを確認
      this.service.isSlipUserPermission(slip.slipNo, userId).subscribe(re => {
        if (!re) {
          // 未許可の場合　一時許可ボタンを表示
          this.openDiv = true;
        }
        this.transactionReqUserCheck();
      });
    } else if (slip.messageOpenLebel == '3') {
      // 非公開の場合　非公開表示をする
      this.privateDiv = true;
      this.transactionReqUserCheck();
    }
    // 取引依頼チェック
    this.sentTransactionReq();


  }

  /**
   * 取引依頼中ユーザーかを確認する
   */
  private transactionReqUserCheck() {
    // TODO 引数のServiceTypeはこのままで大丈夫かは後日検討要
    this.service.transactionReqUserCheck(this.dispSlipId, this.acsessUser.userId, this.serviceType).subscribe(res => {
      this.transactionTarget = res;
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
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
   * 取引表示設定
   */
  private transactionDispSetting() {
    // アクセス者チェック
    this.service.transactionCheck(this.slip.slipNo, this.slip.serviceType, this.acsessUser.userId).subscribe(result => {
      if (result === slipRelation.OTHERS) {
        this.openMsgDialog(messageDialogMsg.NotAuthorized, true);
        return;
      }
      // 取引完了ボタン表示
      this.tranCompBtnDiv = true;

      if (result === slipRelation.ADMIN) {
        // 管理者区分
        this.adminUserDiv = true;
        // 管理者表示設定
        this.transactionAdminDispSetting();
      } else if (result === slipRelation.TRADER) {
        // 取引者表示設定
        this.transactionTraderDispSetting();
      } else {
        this.openMsgDialog(messageDialogMsg.NotAuthorized, true);
      }
    });

  }

  /**
   * 取引中、管理者表示設定
   */
  transactionAdminDispSetting() {

  }

  /**
   * 取引中、依頼者表示設定
   */
  transactionTraderDispSetting() {

  }




  /**
   * 取引依頼を送信する
   * @param userSetviceType
   */
  private sendTransactionReq(userSetviceType: string) {
    if(!this.slip) {
      this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, true);
      return;
    }
    this.service.transactionReq(this.slip.slipNo, this.serviceType, this.acsessUser.userId, userSetviceType).subscribe(
      result => {
        console.log(result)
        if (result == 200) {
          this.openMsgDialog(messageDialogMsg.Sender, false);
          this.sentTransactionReq();
        } else {
          this.openMsgDialog(messageDialogMsg.ProblemOperation, false);
        }
        // TODO
        // メッセージダイアログ処理実装が必要
        this.loading = false;
        this.overlayRef.detach();
      });
  }

  /**
   * アクセス者が取引依頼を出しているかをチェック
   */
  private sentTransactionReq() {
    if(!this.slip) {
      this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, true);
      return;
    }
    this.service.sentTranReqCheck(this.slip.slipNo, this.acsessUser.userId).subscribe(res => {
      if (res) {
        this.tranReqDiv = true;
        console.log(res);
      }
    })
  }

  /**
   * 取引依頼承認モーダルを展開する
   */
  private requestApproval() {
    const dialogRef = this.modal.open(TransactionApprovalModalComponent, {
      width: '650px',
      height: '450px',
      data: this.tranReqList
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.approvalRequest(result);
      }
      return;
    });
  }



  /**
   * 取引依頼を承認する
   */
  private approvalRequest(request: serviceTransactionRequest) {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    if(!this.slip) {
      this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, true);
      return;
    }
    this.service.approvalRequest(request, this.acsessUser.userId, this.slip.serviceType).subscribe(result => {
      if (result == 200) {
        this.openMsgDialog(messageDialogMsg.TransactionStart, false);
        // 取引中伝票表示処理を行う
        // this.transactionDisp();
      } else {
        this.openMsgDialog(messageDialogMsg.ProblemOperation, false);
        this.loading = false;
        this.overlayRef.detach();
      }
    })
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



  /**
   * 確認メッセージモーダルを展開する
   * @param mgs
   */
  private selectMsgDialog(msg: string): Observable<boolean> {
    // 選択ダイアログ表示
    const dialogData: messageDialogData = {
      massage: msg,
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
    return dialogRef.afterClosed().pipe(map((res) => {
      if (res) {
        return res;
      }
      return false;
    })
    );
  }




}
