import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { serchCategoryData } from 'src/app/entity/serchCategory';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { serviceContents, initServiceContent } from 'src/app/entity/serviceContents';
import { ModalData, nextActionButtonTypeMap } from 'src/app/entity/nextActionButtonType';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { monthMap } from 'src/app/entity/month';
import { nextActionButtonType, nextActionMessageType, nextActionTitleType } from 'src/app/entity/nextActionButtonType';
import { ServiceCreateService } from './service-create.service';
import { NextModalComponent } from 'src/app/page/modal/next-modal/next-modal/next-modal.component';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ServiceCreateModalComponent } from 'src/app/page/modal/service-create-modal/service-create-modal.component';
import { ImageModalComponent } from 'src/app/page/modal/image-modal/image-modal.component';
import { VehicleModalComponent, vehicleModalInput } from 'src/app/page/modal/vehicle-modal/vehicle-modal.component';
import { userVehicle } from 'src/app/entity/userVehicle';
import { officeInfo } from 'src/app/entity/officeInfo';

import { CognitoService } from 'src/app/page/auth/cognito.service';
import { user, initUserInfo } from 'src/app/entity/user';
import { imgFile } from 'src/app/entity/imgFile';
import {
  createServiceSelect,
  timeData,
  userWorkArea,
  mechanicWorkArea,
  userTargetVehcle,
  mechanicTargetVehcle,
  userPrice,
  mechanicPrice,
  messageLevel,
  adminUserSelect,
} from './service-create-option';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { cityData } from 'src/app/entity/area1SelectArea2';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.scss']
})


export class ServiceCreateComponent implements OnInit {

  /** 画面タイトル */
  dispTitle = '';

  // タイトル
  title = new FormControl('', [
    Validators.required
  ]);

  // 価格
  formPrice = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
  ]);

  // 説明
  explanation = new FormControl('', [
    Validators.required
  ]);

  /** 必須フォームグループオブジェクト */
  requiredForm = this.builder.group({
    title: this.title,
    formPrice: this.formPrice,
    explanation: this.explanation,
  })

  /** 入力中データ情報 */
  inputData: serviceContents = initServiceContent;
  /** 入札方式選択状態初期値 */
  selected = '1';
  /** カテゴリー選択状態初期値 */
  categorySelect = '1';
  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  /** 地域情報選択状態初期値 */
  areaSelect = ''
  /** 地域２（市町村）データ */
  areaCityData: cityData[] = []
  /** 地域２（市町村）選択 */
  citySelect = '';
  /** カテゴリー */
  categoryData = serchCategoryData
  /** 価格プレスホルダー */
  pricePlace = '価格'
  // submitボタン活性制御
  invalid = true;
  /**  価格フォーム表示フラグ */
  priceFormDiv = true;
  /** 必須フラグ */
  titleDiv = true;
  workAreaDiv = true;
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
  /** 作成ユーザー情報 */
  userInfo: user = initUserInfo;
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
  img: imgFile[] = []
  /** ファイルリスト */
  fileList: any[] = []
  /** locationリスト */
  locationList: string[] = [];
  /** ユーザー登録車両情報 */
  userVehicle: userVehicle[] = [];
  /** 指定なし区分 */
  unspecifiedDiv = false;
  /** サービスタイプ */
  serviceType = '';
  /** 工場情報 */
  office?: officeInfo

  /** ローディングオーバーレイ */
  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private location: Location,
    private service: ServiceCreateService,
    public modal: MatDialog,
    private router: Router,
    private auth: AuthUserService,
    private apiService: ApiSerchService,
    private cognito: CognitoService,
    private activeRouter: ActivatedRoute,
    private overlay: Overlay,
    private builder: FormBuilder,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    this.refreshForm();
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
        if (user[0] == null) {
          this.apiAuth.authenticationExpired();
          this.openMsgDialog(messageDialogMsg.LoginRequest, true);
          return;
        } else {
          this.userInfo = user[0];
          this.inputData.userId = this.userInfo.userId;
          this.inputData.userName = this.userInfo.userName;
          // ローディング解除
          this.overlayRef.detach();
          this.loading = false;
        }
        this.activeRouter.queryParams.subscribe(params => {
          this.serviceType = params['serviceType'];
          if (params['serviceType'] == '1') {
            if (this.userInfo.mechanicId !== '' && this.userInfo.mechanicId !== null) {
              // メカニックタイプの出品画面表示する
              this.mechenicDisp();
            } else {
              // ローディング解除
              this.overlayRef.detach();
              this.loading = false;
              this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, false);
              return;
            }
          } else if (params['serviceType'] == '2') {
            if (this.userInfo.officeId !== '' && this.userInfo.officeId !== null) {
              // 工場タイプの出品画面表示する
              this.officeDisp();
              // ローディング解除
              this.overlayRef.detach();
              this.loading = false;
            } else {
              // ローディング解除
              this.overlayRef.detach();
              this.loading = false;
              this.openMsgDialog(messageDialogMsg.AnFactoryResister, true);
              return;
            }
          } else {
            this.serviceSelect();
          }
        });
      });
    }
  }

  /**
   *  変更監視
   */
  cangeMonitoring() {
    // タイトル変更監視
    if (_isNil(this.title.value)
      || this.title.value === '') {
      this.titleDiv = true;
    } else {
      this.titleDiv = false;
    }

    // 地域選択状況変更監視
    if (_isNil(this.inputData.area1)
      || this.inputData.area1 === '') {
      this.areaDiv = true;
    } else {
      this.areaDiv = false;
    }

    // // 価格選択状況変更監視
    // 価格のイベント処理でおこなう


    // 説明選択状況変更監視
    if (_isNil(this.explanation.value)
      || this.explanation.value === '') {
      this.explanationDiv = true;
    } else {
      this.explanationDiv = false;
    }

    if (!this.titleDiv && !this.areaDiv
      && !this.priceDiv && !this.explanationDiv && !this.preferredDateDiv
      && !this.timeDiv) {
      // 確定ボタン活性
      this.invalid = false;
    } else {
      // 確定ボタン非活性
      this.invalid = true;
    }

  }

  /************** 画面操作イベント *****************************/
  /**
   * タイトル変更イベント
   */
  inputTitle() {
    console.log(this.title.value);
    this.cangeMonitoring();
  }

  /**
   * 作業場所変更イベント
   */
  inputWorkArea() {
    // 登録住所、登録作業場所の場合、登録住所を設定する
    if (this.workAreaSelect == '1' || this.workAreaSelect == '21') {
      // 登録住所を設定
      if (this.serviceType !== '2') {
        this.inputData.area1 = this.userInfo.areaNo1;
        this.areaSelect = this.userInfo.areaNo1;
        if (this.areaSelect != '') {
          this.getCityInfo();
        }
        if (this.userInfo.areaNo2) [
          this.citySelect = this.userInfo.areaNo2
        ]
        this.inputData.area2 = this.userInfo.areaNo2;
      } else {
        if (this.office) {
          this.inputData.area1 = this.office.officeArea1;
          this.areaSelect = this.office.officeArea1;
          if (this.areaSelect != '') {
            this.getCityInfo();
          }
          if (this.userInfo.areaNo2) [
            this.citySelect = this.office.officeArea
          ]
          this.inputData.area2 = this.office.officeArea;
        }
      }
    }
    this.inputData.workArea = this.workAreaSelect;
  }

  /**
   * 価格変更イベント
   */
  inputPrice() {
    // エラー情報の初期化
    this.priceDiv = true;
    this.errorFlg = false;
    this.errormessage = '';

    // 不要な空白を除去する。
    const tr = this.formPrice.value.trim();
    // 数値変換
    const numCheck = Number(tr);

    // 半角数値以外変換できないので以下で判定
    if (isNaN(numCheck)) {
      console.log('価格には「半角数値を入力してください」');
      // this.formPrice.value('');
      this.priceDiv = true;
      this.errorFlg = true;
      this.errormessage = '「半角数値を入力してください」';
    } else {
      console.log('OK');
      if (tr === '0') {
        this.errormessage = '「1円以上で入力してください」';
        // this.formPrice.value('');
        this.priceDiv = true;
        this.errorFlg = true;
      } else {
        // 少数チェック
        if (Number.isInteger(numCheck)) {
          this.inputData.price = numCheck;
          this.priceDiv = false;
        } else {
          this.errormessage = '「整数で入力してください」';
          // this.formPrice.value('1');
          this.priceDiv = true;
          this.errorFlg = true;
        }
      }
    }
    console.log(this.inputData.price);
    this.cangeMonitoring();
  }

  /**
   * 説明変更イベント
   */
  inputExplanation() {
    console.log(this.inputData.explanation);
    this.cangeMonitoring();
  }

  /**
   * 入札方式選択イベント
   */
  selectBidMethod() {
    // 選択状態を反映する
    console.log('入札方式選択状態2：' + this.inputData.bidMethod);

    // 選択状態によって価格のフォーム表示を切り替える
    if (this.inputData.bidMethod === '1' || this.inputData.bidMethod === '41') {
      this.pricePlace = '価格'
      this.priceFormDiv = true;
      if (this.inputData.price === 0) {
        this.priceDiv = true;
      }
    } else {
      this.priceFormDiv = false;
      this.priceDiv = false;
      this.errorFlg = false;
    }
    console.log(this.priceFormDiv);
    this.cangeMonitoring();
  }

  /**
   * カテゴリー選択時イベント
   */
  selectCategory() {
    this.cangeMonitoring();
  }

  /**
   * 地域選択イベント
   */
  onSelectArea() {

    this.inputData.area1 = this.areaSelect;
    console.log(this.areaSelect)
    this.getCityInfo();
  }

  /**
   * 地域2選択イベント
   */
  onSelectCity() {
    this.inputData.area2 = this.citySelect;
    console.log(this.inputData.area2);
  }

  /**
   * 希望日入力イベント
   */
  inputPreferredDate(event: MatDatepickerInputEvent<any>) {
    this.errorDayFlg = false;
    this.errormessage = ''
    // 入力不正値の場合は処理終了しデフォルト値のクリア
    if (_isNil(event.value)) {
      if (this.inputData.preferredDate >= 0) {
        this.preferredDateDiv = true;
        this.inputData.preferredDate = 0;
        this.errorDayFlg = true;
        this.errormessageDay = '日付の入力が不正です。'
      }
      return;
    }

    const str = String(event.value);
    const result = str.split(' ');

    // 日付をyyyymmdd形式にする
    const mon = _find(monthMap, month => month.month === result[1]);
    console.log(result[1]);
    console.log(mon);
    // 日付を設定する
    this.inputData.preferredDate = Number(result[3] + mon?.monthNum + result[2]);
    // 必須を非表示
    this.preferredDateDiv = false;

    const dayStr = String(new Date())
    const day = dayStr.split(' ');
    const d = _find(monthMap, month => month.month === day[1]);
    // 今日の日付yyymmdd形式
    const today = Number(day[3] + d?.monthNum + day[2])

    // 本日または過去日指定の場合
    if (this.inputData.preferredDate <= today) {
      this.inputData.preferredDate = 0;
      this.preferredDateDiv = true;
      this.errorDayFlg = true;
      this.errormessageDay = '日付は未来日を設定してください。'
    }
    this.cangeMonitoring();
  }

  /**
   * 希望時間入力イベント
   */
  selectTime() {
    console.log(this.timeSelect);
    const ti = _find(this.timeData, data => data.label === String(this.timeSelect));
    if (_isNil(ti)) {
      this.inputData.preferredTime = 0;
      this.timeDiv = true;
      // 確定ボタン活性
      this.invalid = true;
      return;
    }
    this.inputData.preferredTime = Number(ti.id);
    this.timeDiv = false;
    this.cangeMonitoring();
  }



  /**
   * 確定処理
   */
  getResult() {
    if (this.img.length != 0) {
      this.fileUp();
    } else {
      this.postSlip();
    }
  }



  /**
   * 画像を添付するボタン押下イベント
   */
  onImageUpload() {
    // 画像添付モーダル展開
    const dialogRef = this.modal.open(ImageModalComponent, {
      width: '750px',
      height: '600px',
      data: this.img
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        // 返却値　無理に閉じたらundifind
        console.log('画像モーダル結果:' + result)
        if (result != undefined && result != null) {
          this.img = result;
        }
      }
    );
  }


  /**
   * 車両を選択するボタン押下イベント
   */
  onVehicleSelect() {
    let acsessId = '';
    if (this.inputData.targetService == '0') {
      acsessId = this.inputData.userId;
    } else if (this.inputData.targetService == '1') {
      acsessId = this.inputData.mechanicId as string;
    } else {
      acsessId = this.inputData.officeId as string;
    }
    let settingVehicle = null;
    if (this.inputData.targetVehcle) {
      // 一度設定された場合はここで格納しモーダルに飛ばす
      settingVehicle = this.inputData.targetVehcle;
    }

    const modalData: vehicleModalInput = {
      targetVehicle: this.userVehicle,
      targetService: this.inputData.targetService,
      acsessId: acsessId,
      settingVehicleInfo: settingVehicle,
      unspecifiedDiv: this.unspecifiedDiv
    }

    // 画像添付モーダル展開
    const dialogRef = this.modal.open(VehicleModalComponent, {
      width: '500px',
      height: '600px',
      data: modalData
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        // 返却値　無理に閉じたらundifind
        console.log('画像モーダル結果:' + result)
        if (result != undefined && result != null) {
          console.log(result);
          this.unspecifiedDiv = result.unspecifiedDiv
          if (!result.unspecifiedDiv) {
            this.inputData.vehicleDiv = result.resultData.vehicleDiv;
            this.inputData.targetVehcle = result.resultData;
            console.log(this.inputData);
          }
        }
      }
    );
  }



  /************************ 以下内部処理 ************************************/



  /**
   * 伝票情報登録を行う
   */
  private postSlip() {
    // 更新パラメータにセット
    this.inputData.title = this.title.value;
    this.inputData.price = this.formPrice.value;
    this.inputData.explanation = this.explanation.value;
    // console.log('確定反応')
    console.log(this.inputData);

    // 工場、メカニックとして依頼する場合
    if (this.inputData.targetService !== '0') {
      // サービス商品として更新を行う
      this.service.postSalesService(this.inputData).subscribe(result => {
        // 登録結果からメッセージを表示する
        if (result === 200) {
          this.openMsgDialog(messageDialogMsg.Resister, false);
        } else {
          this.openMsgDialog(messageDialogMsg.AnResister, false);
        }
      });
    } else {
      // 伝票情報の更新を行う
      this.service.postSlip(this.inputData).subscribe(result => {
        // 登録結果からメッセージを表示する
        if (result === 200) {
          this.openMsgDialog(messageDialogMsg.Resister, false);
        } else {
          this.openMsgDialog(messageDialogMsg.AnResister, false);
        }
      });
    }
  }

  /**
   * 入力内容をリセットする
   * @returns
   */
  private refreshForm() {
    this.inputData.id = '0';
    this.title.setValue('');
    this.inputData.price = 0;
    // this.inputData.area1 = '0';
    // this.inputData.category = '0';
    this.inputData.explanation = '';
    this.inputData.preferredDate = 0;
    this.inputData.preferredTime = 0;

    this.selected = '1';
    this.formPrice.setValue('0');
    this.timeSelect = '';
    this.startDate = 0;
    /** カテゴリー選択状態初期値 */
    // this.areaSelect = ''
    // this.categorySelect = '';
    // 確定ボタン非活性
    this.invalid = true;
    if (this.serviceType == '0') {
      this.inputData.bidMethod = '1';
    } else {
      this.inputData.bidMethod = '41';
    }
  }


  /**
   *　ユーザー用画面設定を行う
   */
  private userDisp() {
    // 画面表示設定
    this.dispTitle = 'サービスを依頼する'
    this.workAreaData = userWorkArea;
    this.vehcleData = userTargetVehcle;
    this.priceSelectData = userPrice;
    // セレクトボックス初期値設定
    this.workAreaSelect = this.workAreaData[0].id;
    this.categorySelect = this.categoryData[0].id;
    this.inputData.category = this.categorySelect;
    this.vehcleSelect = this.vehcleData[0].id;
    this.priceSelect = this.priceSelectData[0].id;
    this.msgLvSelect = this.msgLvData[0].id;
    // データ設定
    this.inputData.workArea = this.workAreaSelect;
    this.inputData.targetService = '0';
    this.adminSelectDiv = false;
    this.adminUserName = this.userInfo.userName;
    this.inputData.area1 = this.userInfo.areaNo1;
    this.areaSelect = this.userInfo.areaNo1;
    if (this.areaSelect != '') {
      this.getCityInfo();
    }
    if (this.userInfo.areaNo2) [
      this.citySelect = this.userInfo.areaNo2
    ]
    this.inputData.area2 = this.userInfo.areaNo2;
    // 車両情報取得
    this.service.getVehicleList(this.userInfo.userId).subscribe(data => {
      if (data) {
        this.userVehicle = data;
      }
    });
    // 入札方式
    this.inputData.bidMethod = '1';
    // ローディング解除
    this.overlayRef.detach();
    this.loading = false;
  }

  /**
   * メカニック用画面表示設定を行う
   */
  private mechenicDisp() {
    // 画面表示設定
    this.dispTitle = 'メカニックとしてサービス・商品を出品する'
    this.workAreaData = mechanicWorkArea;
    this.vehcleData = mechanicTargetVehcle;
    this.priceSelectData = mechanicPrice;
    // セレクトボックス初期値設定
    this.workAreaSelect = this.workAreaData[0].id;
    this.categorySelect = this.categoryData[0].id;
    this.inputData.category = this.categorySelect;
    this.vehcleSelect = this.vehcleData[0].id;
    this.priceSelect = this.priceSelectData[0].id;
    this.msgLvSelect = this.msgLvData[0].id;
    // データ設定
    this.inputData.workArea = this.workAreaSelect;
    this.inputData.mechanicId = this.userInfo.mechanicId;
    this.inputData.targetService = '2';
    this.inputData.area1 = this.userInfo.areaNo1;
    this.areaSelect = this.userInfo.areaNo1;
    if (this.areaSelect != '') {
      this.getCityInfo();
    }
    if (this.userInfo.areaNo2) [
      this.citySelect = this.userInfo.areaNo2
    ]
    this.inputData.area2 = this.userInfo.areaNo2;
    // 入札方式
    this.inputData.bidMethod = '41';

    // ローディング解除
    this.overlayRef.detach();
    this.loading = false;
  }

  /**
   * 工場用画面表示設定を行う
   */
  private officeDisp() {
    // 画面表示設定
    this.dispTitle = '工場としてサービス・商品を出品する'
    this.workAreaData = mechanicWorkArea;
    this.vehcleData = mechanicTargetVehcle;
    this.priceSelectData = mechanicPrice;
    // セレクトボックス初期値設定
    this.workAreaSelect = this.workAreaData[0].id;
    this.categorySelect = this.categoryData[0].id;
    this.vehcleSelect = this.vehcleData[0].id;
    this.priceSelect = this.priceSelectData[0].id;
    this.msgLvSelect = this.msgLvData[0].id;
    // データ設定
    this.inputData.workArea = this.workAreaSelect;
    this.inputData.mechanicId = this.userInfo.mechanicId;
    this.inputData.officeId = this.userInfo.officeId;
    this.inputData.targetService = '1';
    this.adminSelectDiv = true;
    // 入札方式
    this.inputData.bidMethod = '41';
    // 工場情報取得
    if (!this.userInfo.officeId) {
      return;
    }
    const officeId = this.userInfo.officeId;
    this.apiService.getOfficeInfo(officeId).subscribe(data => {
      if (data) {
        this.office = data[0];
        this.inputData.area1 = data[0].officeArea1;
        this.areaSelect = data[0].officeArea1;
        if (this.areaSelect != '') {
          this.getCityInfo();
        }
        if (this.userInfo.areaNo2) {
          this.citySelect = data[0].officeArea;
        }
        this.inputData.area2 = data[0].officeArea;


      }
    });


    // ローディング解除
    this.overlayRef.detach();
    this.loading = false;
  }


  /**
   * ファイルアップロードを行い画像URLを取得する
   */
  private fileUp() {
    let count = 0;
    if (this.img.length != 0) {
      this.img.forEach(file => {
        this.service.protoImgUpload(file.file).then((data) => {
          count++;
          if (data) {
            this.locationList.push(data.Location);
            console.log(data);
          }
          if (count == this.img.length) {
            console.log('処理完了');
            console.log(this.locationList);
            this.inputData.imageUrlList = this.locationList;
            this.postSlip();
          }
        }).catch((err) => {
          console.log(err);
        });
      });
    } else {
      console.log('不動！');
    }
  }


  /**
   * 次の作業を選択し選択画面へ遷移する
   *
   */
  private next() {
    const data: ModalData = {
      title: nextActionTitleType.SUCSESSMESSAGE,
      message: nextActionMessageType.NEXTMESSAGE,
      nextActionList: [
        { nextId: nextActionButtonType.TOP, nextAction: nextActionButtonTypeMap[0] },
        { nextId: nextActionButtonType.MYMENU, nextAction: nextActionButtonTypeMap[1] },
        { nextId: nextActionButtonType.SERVICECREATE, nextAction: nextActionButtonTypeMap[2] },
        { nextId: nextActionButtonType.SERVICEDETAEL, nextAction: nextActionButtonTypeMap[3] }
      ],
      resultAction: ''
    }

    const dialogRef = this.modal.open(NextModalComponent, {
      width: '500px',
      height: '500px',
      data: data
    });
    // 次の操作モーダルを表示
    dialogRef.afterClosed().subscribe(nextAction => {
      console.log(nextAction);
      if (nextAction !== undefined) {
        const linc = this.service.nextNav(nextAction.resultAction);
        if (linc == '99') {
          this.refreshForm();
        } else {
          // モーダル返却値から遷移先へ飛ぶ
          this.router.navigate([linc]);
        }
      } else {
        this.location.back();
      }
    });
  }


  /**
   * 画面表示を判定し、選択の必要がある場合モーダルを展開する
   */
  private serviceSelect() {
    if (this.userInfo.mechanicId == null || this.userInfo.mechanicId == '') {
      // ユーザー依頼画面への表示
      this.userDisp();
    } else {
      // ユーザー情報にメカニック情報が存在する場合モーダルを開く
      const dialogRef = this.modal.open(ServiceCreateModalComponent, {
        width: '400px',
        height: '450px',
        data: {
          userId: this.userInfo.userId,
          mechanicId: this.userInfo.mechanicId,
          officeId: this.userInfo.officeId,
        }
      });
      // モーダルクローズ後
      dialogRef.afterClosed().subscribe(
        result => {
          console.log('クリエイトモーダル:' + result)
          if (!(_isNil(result)) && result !== '') {
            if (result == '0') {
              this.userDisp();
            } else if (result == '1') {
              this.mechenicDisp();
            } else {
              this.officeDisp();
            }
            // ローディング解除
            this.overlayRef.detach();
            this.loading = false;
          } else {
            // ローディング解除
            this.overlayRef.detach();
            this.loading = false;
            // 戻るボタン押下時の動き
            this.location.back();
            return;
          }
        }
      );
    }
  }

  /**
   * 都道府県から市町村データを取得し設定する
   */
  private getCityInfo() {
    const areaa = _find(this.areaData, data => data.code === this.areaSelect);
    console.log(areaa)
    if (areaa) {
      this.apiService.serchArea(areaa.prefectures)
        .subscribe(data => {
          // console.log(data);
          // console.log(data.response);
          console.log(data.response.location);
          if (data.response.location.length > 0) {
            this.areaCityData = data.response.location;
          }
        });
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
        // ローディング解除
        this.overlayRef.detach();
        this.loading = false;
        this.router.navigate(["/main_menu"]);
      }
      console.log(result);
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
      if (msg == messageDialogMsg.Resister) {
        this.next();
      }
      return;
    });
  }


}
