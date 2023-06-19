import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';
import {
  createServiceSelect,
  timeData,
  messageLevel,
  adminUserSelect,
} from '../service-create/service-create-option';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';

import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { ApiSlipProsessService } from 'src/app/page/service/api-slip-prosess.service';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';

import { user } from 'src/app/entity/user';
import { serviceContents, initServiceContent } from 'src/app/entity/serviceContents';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { serchCategoryData } from 'src/app/entity/serchCategory';
import { salesServiceInfo, defaulsalesService } from 'src/app/entity/salesServiceInfo';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';




/**
 * 再出品コンポーネント
 */
@Component({
  selector: 'app-service-relisted',
  templateUrl: './service-relisted.component.html',
  styleUrls: ['./service-relisted.component.scss']
})
export class ServiceRelistedComponent implements OnInit {

  /** タイトル */
  title = '';
  /** 再出品伝票 */
  relistedService: salesServiceInfo = defaulsalesService;
  /** 作成ユーザー情報 */
  userInfo?: user;

  /** 入力中データ情報 */
  inputData: serviceContents = initServiceContent;
  /** 入札方式選択状態初期値 */
  selected = '1';
  /** 地域情報選択状態初期値 */
  areaSelect = ''
  /** カテゴリー選択状態初期値 */
  categorySelect = '1';
  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  /** カテゴリー */
  categoryData = serchCategoryData
  /** 価格追跡 */
  formPrice = '';
  priceFormDiv = true;
  /** 価格プレスホルダー */
  pricePlace = '価格'
  // submitボタン活性制御
  invalid = true;
  /**  価格フォーム表示フラグ */
  /** 必須フラグ */
  titleDiv = true;
  areaDiv = true;
  priceDiv = true;
  explanationDiv = true;
  preferredDateDiv = true;
  timeDiv = true;
  /** エラーフラグ */
  errorFlg = false;
  errorDayFlg = false;
  /** エラーメッセージ */
  errormessage = '';
  /** エラーメッセージ日付 */
  errormessageDay = '';
  /** エラーメッセージ日付 */
  startDate = 0;
  /** 価格データ */
  priceSelectData: createServiceSelect[] = [];
  /** 価格セレクト */
  priceSelect = '';
  /** 作業場所データ */
  workAreaData: createServiceSelect[] = [];
  /** 作業場所セレクト */
  workAreaSelect = '';
  /** 対象車両 */
  vehcleData: createServiceSelect[] = [];
  /** 作業場所セレクト */
  vehcleSelect = '';
  /** 希望時間データ */
  timeData = timeData;
  /** 希望時間セレクト */
  timeSelect = '';
  /** メッセージレベルデータ */
  msgLvData = messageLevel;
  /** 希望時間セレクト */
  msgLvSelect = '';
  /** 管理ユーザー区分 */
  adminSelectDiv = false;
  /** 管理ユーザーデータ */
  adminUserData = adminUserSelect;
  /** 管理ユーザーセレクト */
  adminSelect = '';
  /** 管理ユーザー名 */
  adminUserName = '';
  /** イメージ */
  img: any = []
  /** ファイルリスト */
  fileList: any[] = []
  /** locationリスト */
  locationList: string[] = [];

  /** サービスタイプ */
  serviceType = '';


  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private overlay: Overlay,
    private location: Location,
    private activeRouter: ActivatedRoute,
    private cognito: CognitoService,
    private apiService: ApiSerchService,
    private apiUniqueService: ApiUniqueService,
    private apiSlipService: ApiSlipProsessService,
    public modal: MatDialog,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    // ログイン状態確認
    const authUser = this.cognito.initAuthenticated();
    if (authUser == null) {
      this.openMsgDialog(messageDialogMsg.LoginRequest, true);
    } else {
      // ユーザー情報を取得する
      this.apiService.getUser(authUser).subscribe(user => {
        if (user.length == 0) {
          // ローディング解除
          this.overlayRef.detach();
          this.loading = false;
          this.apiAuth.authenticationExpired();
          this.openMsgDialog(messageDialogMsg.LoginRequest, true);
          return;
        } else {
          this.userInfo = user[0];
        }
        // サービスタイプ取得
        this.activeRouter.queryParams.subscribe(params => {
          // 再出品対象の伝票情報を取得
          const serviceType = params['serviceType'];
          this.serviceType = serviceType;
          const slipNo = params['slipNo'];
          if (serviceType == '0') {
            this.getslipDetial(slipNo);
          } else {
            this.getserviceContents(slipNo);
          }
        });
      });
    }
    // ローディング解除
    this.overlayRef.detach();
    this.loading = false;
  }

  /**
   * 伝票情報を取得し表示
   * @param slipNo
   */
  private getslipDetial(slipNo: string) {
    this.apiUniqueService.getSlip(slipNo).subscribe(result => {
      // 伝票情報取得
      this.relistedService = result[0]
    });
  }

  /**
   * サービス商品情報を取得し表示
   * @param slipNo
   */
  private getserviceContents(slipNo: string) {
    this.apiUniqueService.getServiceContents(slipNo).subscribe(result => {
      // 伝票情報取得
      this.relistedService = result[0]
    });
  }




  inputTitle() {

  }

  inputPrice() {

  }

  selectBidMethod() {

  }


  inputExplanation() {

  }

  inputPreferredDate(event: any) {
  }


  selectTime() {

  }


  inputWorkArea() {

  }


  onChangeDragAreaInput(event: any) {

  }


  /**
   * アップロードファイル選択時イベント
   * @param event
   */
  onInputChange(event: any) {
    const files = event.target.files[0];
  }


  dragOver(event: DragEvent) {
    // ブラウザで画像を開かないようにする
    event.preventDefault();
  }
  drop(event: DragEvent) {
    // ブラウザで画像を開かないようにする
    event.preventDefault();
    if (event.dataTransfer == null) {
      return;
    }
    const file = event.dataTransfer.files;
    this.fileList.push(file[0])
    const fileList = Object.entries(file).map(f => f[1]);
    fileList.forEach(f => {
      let reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => {
        this.img.push(reader.result);
      };
    });
  }

  /**
   * 決定押下イベント
   */
  getResult() {
    const updateService: salesServiceInfo = this.createData();

    this.apiSlipService.relistedService(this.serviceType, updateService).subscribe(res => {
      console.log(res);
    })
  }

  /**
   * 更新データ作成
   * @returns
   */
  private createData(): salesServiceInfo {
    let mechanicId = '0';
    let officeId = '0';
    if (this.serviceType != '0') {
      if (this.relistedService.slipAdminMechanicId) {
        mechanicId = this.relistedService.slipAdminMechanicId
      }
      if (this.relistedService.slipAdminOfficeId) {
        officeId = this.relistedService.slipAdminOfficeId
      }
    }
    return  {
      slipNo: this.relistedService.slipNo, // 伝票番号
      deleteDiv: this.relistedService.deleteDiv, // 削除区分
      category: this.relistedService.category, // サービスカテゴリー
      slipAdminUserId: this.relistedService.slipAdminUserId, // 伝票管理者ユーザーID
      slipAdminUserName: '', // 伝票管理者ユーザー名
      slipAdminOfficeId: officeId, // 伝票管理事業所ID
      slipAdminOfficeName: '', // 伝票管理事業所名
      slipAdminMechanicId: mechanicId, // 伝票管理メカニックID
      slipAdminMechanicName: '', // 伝票管理メカニック名
      adminDiv: this.relistedService.adminDiv, // 管理者区分
      title: this.relistedService.title, // タイトル
      areaNo1: this.relistedService.areaNo1, // サービス地域1
      areaNo2: this.relistedService.areaNo2, // サービス地域2
      price: this.relistedService.price, // 価格
      bidMethod: this.relistedService.bidMethod, // 入札方式
      bidderId: this.relistedService.bidderId, // 入札者ID
      bidEndDate: this.relistedService.bidEndDate, // 入札終了日
      explanation: this.relistedService.explanation, // 説明
      displayDiv: this.relistedService.displayDiv, // 表示区分
      processStatus: this.relistedService.processStatus, // 工程ステータス
      serviceType: this.relistedService.serviceType, // 対象サービス内容
      targetVehicleId: this.relistedService.targetVehicleId, // 対象車両ID
      targetVehicleDiv: this.relistedService.targetVehicleDiv,
      targetVehicleName: this.relistedService.targetVehicleName, // 対象車両名
      targetVehicleInfo: this.relistedService.targetVehicleInfo, // 対象車両情報
      workAreaInfo: this.relistedService.workAreaInfo, // 作業場所情報
      preferredDate: this.relistedService.preferredDate, // 希望日
      preferredTime: this.relistedService.preferredTime, // 希望時間
      completionDate: this.relistedService.completionDate, // 完了日
      transactionCompletionDate: this.relistedService.transactionCompletionDate, // 取引完了日
      thumbnailUrl: this.relistedService.thumbnailUrl, // サムネイルURL
      imageUrlList: this.relistedService.imageUrlList, // 画像URLリスト
      messageOpenLebel: this.relistedService.messageOpenLebel, // メッセージ公開レベル
      updateUserId: '', // 更新ユーザーID
      created: this.relistedService.created, // 登録年月日
      updated: '' // 更新日時
    }
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
        // ローディング解除
        this.overlayRef.detach();
        this.loading = false;
        this.location.back();
        // this.router.navigate(["/main_menu"]);
      }
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
      return;
    });
}


}
