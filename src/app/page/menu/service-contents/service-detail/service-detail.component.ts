import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ServiceDetailService } from './service-detail.service';
import { salesServiceInfo, defaulsalesService } from 'src/app/entity/salesServiceInfo';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { image } from 'src/app/entity/image';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { TransactionRequestModalComponent } from 'src/app/page/modal/transaction-request-modal/transaction-request-modal.component';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { messageDialogMsg } from 'src/app/entity/msg';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';
import { processStatus } from 'src/app/entity/processStatus';
import { slipRelation } from 'src/app/entity/slipRelation';
import { user } from 'src/app/entity/user';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';
import { TransactionApprovalModalComponent } from 'src/app/page/modal/transaction-approval-modal/transaction-approval-modal/transaction-approval-modal.component';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {


  /** 画像 */
  images: image[] = [];

  /** サービスタイプ */
  serviceType = '';
  /** サービスID */
  serviceId: string = '';
  /** タイトル */
  serviceTitle: string = '';
  /** 日付 */
  dispYMD: string = '';
  /** 希望時間 */
  dispTime: string = '';
  /** 価格 */
  dispPrice: number = 0;
  /** 場所 */
  dispArea: string = '';
  /** 作業場所 */
  dispWorkArea: string = '';
  /** 対象車両 */
  dispTargetVehicle: string = '';
  /** 説明 */
  dispExplanation: string = ''
  /** 入札方式 */
  bidMethod: string = '';
  /** 再出品区分 */
  relistedDiv = false;
  /** サービスタイプ */
  serviceTypeName: string = '';
  /** サービス管理者情報 */
  serviceAdminInfo: { id: string, name: string | null } = { id: '', name: '' }

  /** ログイン有無 */
  isLogin = false;
  /** 管理者区分 */
  adminDiv = false;
  /** 取引依頼済区分 */
  tranReqDiv = false;
  /** アクセスユーザー情報 */
  acceseUserInfo?: user;
  /** アクセスユーザーID */
  acceseUserId: string = '';
  /** ユーザー名 */
  userName: string = '';
  /** 表示伝票情報 */
  dispContents: salesServiceInfo = defaulsalesService;
  /** 取引依頼情報 */
  tranReqList: serviceTransactionRequest[] = [];

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  dlocale = this.locale;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private service: ServiceDetailService,
    public dialog: MatDialog,
    private router: Router,
    private config: NgbCarouselConfig,
    private overlay: Overlay,
    private cognito: CognitoService,
    private apiAuth: ApiAuthService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    config.interval = 0;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.route.queryParams.subscribe(params => {
      console.log(params['serviceId']);
      const serviceId: string = params['serviceId'];
      const serviceType = params['searchTargetService'];
      this.setServiceTypeName();
      // サービスIDから伝票情報を取得し表示する
      this.service.getService(serviceId, serviceType).subscribe(data => {
        if (!data) {
          this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, true);
          return;
        }
        this.dispContents = data;
        if (this.dispContents.processStatus == processStatus.EXHIBITING) {
          // 出品中伝票の表示を行う
          this.exhibitingDisp();
        } else {
          // その他は取引中表示を行う
          this.transactionDisp()
        }
      });
    });
  }


  /**
   * 認証状況確認
   */
  private getLoginUser(): string | null {
    // ログイン状態確認
    return this.cognito.initAuthenticated();
  }


  /**
   * 取引するボタン押下時の処理
   */
  onTransaction() {
    console.log('serviceType1:' + this.serviceType)
    this.router.navigate(["service-transaction"],
      {
        queryParams: {
          slipNo: this.dispContents.slipNo,
          serviceType: this.serviceType,
          status: false
        }
      });
  }

  /**
   * 取引を依頼するボタン押下イベント
   */
  onTransactionRequest() {
    // 取引依頼ダイアログを開く
    TransactionRequestModalComponent
    // ダイアログ表示（ログインしてください）し前画面へ戻る
    const dialogData: user = this.acceseUserInfo as user;
    console.log(dialogData + ':取引モーダルデータ')
    // 確認ダイアログを表示
    const dialogRef = this.dialog.open(TransactionRequestModalComponent, {
      width: '400px',
      height: '350px',
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
   * お気に入りに追加ボタン押下時の処理
   */
  onFavorite() {
    this.service.addFavorite(this.dispContents, this.acceseUserId).subscribe(result => {
      let modalData: messageDialogData = {
        massage: '',
        closeFlg: true,
        closeTime: 400,
        btnDispDiv: false
      };
      if (result === 200) {
        modalData.massage = messageDialogMsg.AddMyList
      } else {
        modalData.massage = messageDialogMsg.AnAddMyList
      }
      const dialogRef = this.dialog.open(MessageDialogComponent, {
        width: '300px',
        height: '100px',
        data: modalData
      })
    });
  }


  /**
   * 再出品ボタン押下イベント
   */
  onRelisted() {
    this.router.navigate(["service-relisted"],
      {
        queryParams: {
          slipNo: this.dispContents.slipNo,
          serviceType: this.serviceType
        }
      });
  }

  /**
   * サービス編集ボタン押下イベント
   */
  onServiceEdit() {
    this.router.navigate(["service-edit"],
      {
        queryParams: {
          slipNo: this.dispContents.slipNo,
          serviceType: this.serviceType
        }
      });
  }


  /**
   * 管理者情報ページに遷移する
   * @param id
   */
  onServiceAdmin(id: string) {
    console.log(id);
    this.router.navigate(["service-admin-reference"],
      {
        queryParams: {
          id: id,
          serviceType: this.serviceType,
          serviceId: this.dispContents.slipNo
        }
      });
  }

  /**
   * 取引依頼を確認するボタン押下イベント
   */
  onRequest() {
    this.requestApproval();
  }



  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }

  /******** 以下内部処理 **********/

  /**
   * 出品中状態の表示設定を行う
   */
  private exhibitingDisp() {
    this.defaltDispSetting();
    const user = this.getLoginUser();
    if (user) {
      // 管理者チェックを行う
      this.adminCheck(user)
      this.acceseUserId = user;
      this.isLogin = true;
      this.setAccessUserSetting(user);

    }
  }

  /**
   * 取引中伝票の表示設定を行う
   */
  private transactionDisp() {
    const user = this.getLoginUser();
    if (user) {
      this.setAccessUserSetting(user);
      this.sentTransactionReq();
      // アクセス者判定
      this.service.transactionCheck(this.dispContents.slipNo, this.dispContents.serviceType, user).subscribe(result => {
        if (result === slipRelation.OTHERS) {
          this.openMsgDialog(messageDialogMsg.NotAuthorized, true);
          return;
        }
        if (result === slipRelation.ADMIN) {
          // 管理者表示設定
          this.transactionAdminDispSetting();
        } else if (result === slipRelation.TRADER) {
          // 取引者表示設定
          this.transactionTraderDispSetting();
        } else {
          this.openMsgDialog(messageDialogMsg.NotAuthorized, true);
        }
      });
    } else {
      this.openMsgDialog(messageDialogMsg.NotAuthorized, true);
    }
  }

  /**
   * 取引中管理者表示設定
   */
  private transactionAdminDispSetting() {

  }

  /**
   * 取引中取引者表示設定
   */
  private transactionTraderDispSetting() {

  }

  /**
   * アクセス者が取引依頼を出しているかをチェック
   */
  private sentTransactionReq() {
    this.service.sentTranReqCheck(this.dispContents.slipNo, this.acceseUserId).subscribe(res => {
      if (res) {
        this.tranReqDiv = true;
        console.log(res);
      }
    })
  }


  /**
   * 標準の表示設定を行う
   */
  private defaltDispSetting() {
    this.serviceType = this.dispContents.serviceType;
    // 表示内容に取得した伝票情報を設定
    this.serviceTitle = this.dispContents.title;
    // 表示サービスの管理者設定
    this.serviceAdminUserSetting();
    // 希望日を設定
    if (this.dispContents.preferredDate != undefined) {
      this.dispYMD = this.service.setDispYMDSt(this.dispContents.preferredDate);
    }
    // 希望時間
    this.dispTime = this.dispContents.preferredTime;
    // 入札方式
    this.bidMethod = this.dispContents.bidMethod;
    // 表示価格
    this.dispPrice = this.dispContents.price;
    // 地域
    this.dispArea = this.service.setDispArea(this.dispContents.areaNo1, this.dispContents.areaNo2);
    // 作業場所
    this.dispWorkArea = this.service.setDispWorkArea(this.dispContents.workAreaInfo, this.dispContents.serviceType);
    // 対象車両
    this.dispTargetVehicle = this.dispContents.targetVehicleName;
    if (this.dispContents.targetVehicleName || this.dispContents.targetVehicleName == '') {
      this.dispTargetVehicle = '車両情報登録なし'
    }
    // 説明
    this.dispExplanation = this.dispContents.explanation;
    // 画像
    this.images = this.service.setImages(this.dispContents.thumbnailUrl, this.dispContents.imageUrlList)
  }



  /**
   * サービス管理者情報を設定する
   */
  private serviceAdminUserSetting() {
    if (this.serviceType == '0') {
      this.serviceAdminInfo.id = this.dispContents.slipAdminUserId;
      this.serviceAdminInfo.name = this.dispContents.slipAdminUserName;
      console.log(this.serviceAdminInfo);
    } else if (this.serviceType == '1' && this.dispContents.slipAdminOfficeId) {
      this.serviceAdminInfo.id = this.dispContents.slipAdminOfficeId;
      this.serviceAdminInfo.name = this.dispContents.slipAdminOfficeName;
      console.log(this.serviceAdminInfo);
    } else if (this.serviceType == '2' && this.dispContents.slipAdminMechanicId) {
      this.serviceAdminInfo.id = this.dispContents.slipAdminMechanicId;
      this.serviceAdminInfo.name = this.dispContents.slipAdminMechanicName;
      console.log(this.serviceAdminInfo);
    } else {
      // これはあり得ないが…
      this.serviceAdminInfo.id = '';
      this.serviceAdminInfo.name = '';
      console.log(this.serviceAdminInfo);
    }

  }


  /**
   * サービスタイプ表示を設定
   */
  private setServiceTypeName() {
    if (this.serviceType == '0') {
      this.serviceTypeName = '依頼';
    } else {
      this.serviceTypeName = 'サービス';
    }

  }

  /**
   * 伝票管理者かをチェックする
   * @param userId
   */
  private adminCheck(userId: string) {
    this.service.accessUserAdminCheck(this.dispContents.slipNo, userId, this.dispContents.serviceType).subscribe(result => {
      this.adminDiv = result;
      if (result) {
        // 管理者の場合取引依頼を取得
        this.service.getTranRequest(this.dispContents.slipNo).subscribe(res => {
          this.tranReqList = res;
        });
      } else if(!result && this.dispContents.processStatus == processStatus.EXHIBITING) {
        // 出品中で管理者以外の場合取引依頼チェック
        this.sentTransactionReq();
      }
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }

  /**
   * アクセスユーザー情報を設定
   * @param userId 
   */
  private setAccessUserSetting(userId: string) {
    this.service.getAccessUser(userId).subscribe(res => {
      this.acceseUserInfo = res[0];
      if (this.acceseUserInfo) {
        this.userName = this.acceseUserInfo.userName;
      }
    });
  }


  /**
   * 取引依頼を送信する
   * @param userSetviceType
   */
  private sendTransactionReq(userSetviceType: string) {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.service.transactionReq(this.dispContents.slipNo, this.serviceType, this.acceseUserId, userSetviceType).subscribe(
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
   * 取引依頼承認モーダルを展開する
   */
  private requestApproval() {
    const dialogRef = this.dialog.open(TransactionApprovalModalComponent, {
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
    this.service.approvalRequest(request, this.acceseUserId, this.dispContents.serviceType).subscribe(result => {
      if (result == 200) {
        // 取引中伝票表示処理を行う
        this.transactionDisp();
      } else {
        this.openMsgDialog(messageDialogMsg.ProblemOperation, false);
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
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '300px',
      height: '150px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (locationDiv) {
        this.loading = false;
        this.overlayRef.detach();
        this.location.back();
      }
      return;
    });
  }





}

