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
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { messageDialogMsg } from 'src/app/entity/msg';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {


  /** 画像 */
  images: image[] = [];
  /** ユーザー情報 */
  user: string = '';
  /** サービスタイプ */
  serviceType = '';
  /** サービスID */
  serviceId: string = '';
  /** タイトル */
  serviceTitle: string = '';
  /** 日付 */
  dispYMD: string = '';
  // dispYMD:Date = new Date();
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
  /** 表示伝票情報 */
  dispContents: salesServiceInfo = defaulsalesService;
  /** 入札方式 */
  bidMethod: string = '';
  /** 再出品区分 */
  relistedDiv = false;
  /** サービスタイプ */
  serviceTypeName: string = '';
  /** サービス管理者情報 */
  serviceAdminInfo: { id: string, name: string | null } = { id: '', name: '' }
  /** 管理者区分 */
  adminDiv = false;

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
        this.dispContents = data;
        this.serviceType = data.targetService;
        // 表示内容に取得した伝票情報を設定
        this.serviceTitle = this.dispContents.title;
        // 表示サービスの管理者設定
        this.serviceAdminUserSetting();
        // 希望日を設定
        if (this.dispContents.preferredDate != undefined) {
          this.dispYMD = this.service.setDispYMDSt(this.dispContents.preferredDate);
          // console.log('日付フォーマット:'+formatDate(date, "yy/MM/dd", this.locale));
          // this.dispYMD = formatDate(date, "yy/MM/dd", this.locale)
          // this.dispYMD = date;
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
        this.dispWorkArea = this.service.setDispWorkArea(this.dispContents.workAreaInfo, this.dispContents.targetService);
        // 対象車両
        this.dispTargetVehicle = this.dispContents.targetVehicleName;
        if (this.dispContents.targetVehicleName || this.dispContents.targetVehicleName == '') {
          this.dispTargetVehicle = '車両情報登録なし'
        }
        // 説明
        this.dispExplanation = this.dispContents.explanation;
        // 画像
        this.images = this.service.setImages(this.dispContents.thumbnailUrl, this.dispContents.imageUrlList)
        if (this.dispContents.processStatus == '3') {
          this.relistedDiv = true;
        }
        this.getLoginUser();

      });
    });
  }


  /**
   * 認証状況確認
   */
  private getLoginUser() {
    // ログイン状態確認
    const authUser = this.cognito.initAuthenticated();
    if (authUser != null) {
      this.user = authUser;
      this.adminCheck(this.user);
    } else {
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    }
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
   * お気に入りに追加ボタン押下時の処理
   */
  onFavorite() {
    this.service.addFavorite(this.dispContents, this.user).subscribe(result => {
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
   * 取引状況確認ボタン押下時の処理
   */
  onTransactionStatus() {
    this.router.navigate(["service-transaction"],
      {
        queryParams: {
          slipNo: this.dispContents.slipNo,
          serviceType: this.serviceType,
          status: true
        }
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
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }

  /******** 以下内部処理 **********/

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
    // // ローディング解除
    // this.overlayRef.detach();
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
    let adminId = this.dispContents.slipAdminUserId;
    if (this.dispContents.targetService == '1' && this.dispContents.slipAdminMechanicId) {
      adminId = this.dispContents.slipAdminMechanicId;
    } else if (this.dispContents.targetService == '2' && this.dispContents.slipAdminOfficeId) {
      adminId = this.dispContents.slipAdminOfficeId;
    }
    this.service.acsessUserAdminCheck(adminId, this.dispContents.targetService, userId).subscribe(result => {
      this.adminDiv = result;
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }


}

