import { Component, OnInit } from '@angular/core';
import { officeInfo, initOfficeInfo } from 'src/app/entity/officeInfo';
import { UploadService } from 'src/app/page/service/upload.service';
import { Router } from '@angular/router';
import { user } from 'src/app/entity/user';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { FormService } from 'src/app/page/service/form.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { filter as _filter } from 'lodash'
import { find as _find } from 'lodash'
import { postSerchInfo } from 'src/app/entity/postCodeInfo';
import { imgFile } from 'src/app/entity/imgFile';
import { SingleImageModalComponent } from 'src/app/page/modal/single-image-modal/single-image-modal.component';
import { cityData } from 'src/app/entity/area1SelectArea2';
import { ConnectionFactoryModalComponent } from 'src/app/page/modal/connection-factory-modal/connection-factory-modal.component';
import { ConnectionMechanicModalComponent } from 'src/app/page/modal/connection-mechanic-modal/connection-mechanic-modal.component';
import { FactoryAdminSettingModalComponent } from 'src/app/page/modal/factory-admin-setting-modal/factory-admin-setting-modal.component';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';
@Component({
  selector: 'app-factory-menu',
  templateUrl: './factory-menu.component.html',
  styleUrls: ['./factory-menu.component.scss']
})
export class FactoryMenuComponent implements OnInit {

  /** イメージ */
  imageFile: imgFile[] = []
  /** ユーザー情報 */
  user?: user
  //編集モード区分
  editModeDiv = false;
  // 会社情報のデータ
  officeInfo?: officeInfo;
  // 表示情報
  dispInfo: officeInfo = initOfficeInfo;
  // 工場情報登録区分
  fcRegisDiv = false;
  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  areaSelect = '';
  /** 地域２（市町村）データ */
  areaCityData: cityData[] = []
  /** 地域２（市町村）選択 */
  citySelect = '';

  // 工場名
  officeName = new FormControl('', [
    Validators.required
  ]);

  // 事業所メールアドレス
  officeMailAdress = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  // 電話番号１
  telNo1 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 電話番号２
  telNo2 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 電話番号３
  telNo3 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 郵便番号１
  postCode1 = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(3)
  ]);

  // 郵便番号２
  postCode2 = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 営業時間（開始1）
  businessHoursStart1 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  // 営業時間（開始2）
  businessHoursStart2 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  // 営業時間（終了1）
  businessHoursEnd1 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);
  businessHoursEnd2 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  breakTimeStart1 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  breakTimeStart2 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  breakTimeEnd1 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  breakTimeEnd2 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  // 事業所所在地(地域)
  officeArea1 = new FormControl('', [
    Validators.required
  ]);


  /** フォームグループオブジェクト */
  groupForm = this.builder.group({
    officeName: this.officeName,
    officeMailAdress: this.officeMailAdress,
    telNo1: this.telNo1,
    telNo2: this.telNo2,
    telNo3: this.telNo3,
    postCode1: this.postCode1,
    postCode2: this.postCode2,
    businessHoursStart1: this.businessHoursStart1,
    businessHoursStart2: this.businessHoursStart2,
    businessHoursEnd1: this.businessHoursEnd1,
    businessHoursEnd2: this.businessHoursEnd2,
    breakTimeStart1: this.breakTimeStart1,
    breakTimeStart2: this.breakTimeStart2,
    breakTimeEnd1: this.breakTimeEnd1,
    breakTimeEnd2: this.breakTimeEnd2,
  });

  // 作業内容
  workContentsOne = '';

  // テンプレートで使用するフォームを宣言
  public form!: FormGroup;

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private s3: UploadService,
    private router: Router,
    private cognito: CognitoService,
    private overlay: Overlay,
    private builder: FormBuilder,
    private apiService: ApiSerchService,
    private formService: FormService,
    public modal: MatDialog,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        this.user = user[0];
        if (this.user) {
          if (this.user.officeId != '0' && this.user.officeId != null) {
            // 工場登録ある場合表示
            this.fcRegisDiv = false;
            this.officeSetting();
            this.initForm();
          } else {
            // 登録がない場合、登録ボタンのみ表示
            this.fcRegisDiv = true;
            // ローディング解除
            this.overlayRef.detach();
            this.loading = false;
          }
        } else {
          // ローディング解除
          this.overlayRef.detach();
          this.openMsgDialog(messageDialogMsg.ProblemOperation, true);
        }
      });
    } else {
      this.apiAuth.authenticationExpired();
      this.openMsgDialog(messageDialogMsg.LoginRequest, true);
    }
  }


  // FormBuilderを使って初期フォームを作成します。フォームの塊のFormGroupとしています。
  initForm() {
    this.form = this.builder.group({
      name: [''],
      // フォームを追加したり、削除したりするために、FormArrayを設定しています。
      options: this.builder.array([])
    });
  }

  // 追加ボタンがおされたときに追加したいフォームを定義しています。returnでFormGroupを返しています。
  get optionForm(): FormGroup {
    return this.builder.group({
      name: [''],
    });
  }

  // FormのOption部分を取り出しています。
  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  // 追加ボタンがクリックされたときに実行する関数です。
  addOptionForm() {
    this.options.push(this.optionForm);
  }

  // removeAtでインデックスを指定することで、FormArrayのフォームを削除します。
  removeOptionForm(idx: number) {
    this.options.removeAt(idx);
  }

  show(info: officeInfo, editFlg: boolean) {
    this.editModeDiv = editFlg;
    this.dispInfo = info;
  }

  /**
   * アップロードファイル選択時イベント
   * @param event
   */
  onInputChange(event: any) {
    const file = event.target.files[0];
    console.log(file);
    this.imageFile = file;
  }

  /**
   * 登録ボタン押下イベント
   */
  onRegister() {
    if (this.imageFile != null) {
      this.setImageUrl();
    } else {
      this.officeResister();
    }
  }

  /**
   * 工場情報を変更を登録する
   */
  private officeResister() {
    this.setRegisterWorkContents();
    this.setBusinessHour()
    this.dispInfo.officeName = this.officeName.value;
    this.dispInfo.officeTel[0] = this.formService.setTelNo(this.telNo1.value, this.telNo2.value, this.telNo3.value)
    this.dispInfo.officeMailAdress = this.officeMailAdress.value;
    this.dispInfo.officeArea1 = this.officeArea1.value;
    this.dispInfo.officePostCode = this.formService.setPostCode(this.postCode1.value, this.postCode2.value);
    this.dispInfo.officePR = this.officeName.value;
    this.apiService.postOffice(this.dispInfo).subscribe(res => {
      if (res == 200) {
        this.openMsgDialog(messageDialogMsg.Resister, false);
      } else {
        this.openMsgDialog(messageDialogMsg.AnResister, false);
      }
    });
  }


  /**
   * 工場登録はこちらからボタン押下イベント
   */
  onInitFactory() {
    this.router.navigate(["factory-register"]);
  }

  /**
   * 郵便番号入力時イベント
   */
  onPostCodeSerch() {
    const post1 = this.postCode1.value.replace(/\s+/g, '');
    const post2 = this.postCode2.value.replace(/\s+/g, '');
    const post = post1 + post2;
    // 郵便番号1,2の入力が行われた場合に郵便番号から地域検索を行う
    if (post1 != '' && post2 != '') {
      this.getPostCode(post);
    }
  }



  /**
   * 画像を添付するボタン押下イベント
   */
  onImageUpload() {
    // 画像添付モーダル展開
    const dialogRef = this.modal.open(SingleImageModalComponent, {
      width: '750px',
      height: '600px',
      data: this.imageFile
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        // 返却値　無理に閉じたらundifind
        console.log('画像モーダル結果:' + result)
        if (result != undefined && result != null) {
          if (result.length != 0) {
            this.imageFile = result;
          }
        }
      }
    );
  }


  /**
   * 都道府県選択イベント
   */
  onSelectArea1() {
    this.areaSelect = this.dispInfo.officeArea1;
    this.getCityInfo();
  }


  /**
   * 市町村選択イベント
   */
  onSelectCity() {
    this.dispInfo.officeArea = this.citySelect;
    // console.log(this.inputData.area2);
  }



  /**
   * 下部ボタン操作イベント
   * @param e
   */
  onButtonAction(e: string) {
    if (e == '0') {
      // 関連工場設定
      this.factoryConnect();
    } else if (e == '1') {
      // 関連メカニック設定
      this.mechanicConnect();
    } else if (e == '2') {
      // 工場管理設定
      this.factoryAdmiSetting();
    }

  }




  /************  以下内部処理 ****************/


  /**
   * 工場情報を取得する
   */
  private officeSetting() {
    if (!this.user?.officeId) {
      return;
    }
    this.apiService.getOfficeInfo(this.user.officeId).subscribe(res => {
      console.log(res);
      if (!res[0]) {
        this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, true);
        return
      }
      this.initSetting(res[0]);

    });

    // ローディング解除
    this.overlayRef.detach();
    this.loading = false;
  }

  /**
   * 工場情報の初期表示設定を行う
   * @param info
   */
  private initSetting(info: officeInfo) {
    this.officeInfo = info;
    this.dispInfo.officeId = info.officeId;
    this.officeArea1.setValue(info.officeArea1);
    this.areaSelect = info.officeArea1;
    console.log(this.areaSelect);
    this.dispInfo.officeArea = info.officeArea;
    this.dispInfo.officeAdress = info.officeAdress;
    this.citySelect = this.dispInfo.officeArea;
    this.dispInfo.officePR = info.officePR;
    this.dispInfo.created = info.created;
    this.officeName.setValue(info.officeName);
    this.officeMailAdress.setValue(info.officeMailAdress);
    const tel = this.formService.splitTelNo(info.officeTel[0]);
    this.telNo1.setValue(tel.tel1);
    this.telNo2.setValue(tel.tel2);
    this.telNo3.setValue(tel.tel3);
    if (info.officePostCode) {
      const post = this.formService.splitPostCode(info.officePostCode);
      this.postCode1.setValue(post.post1);
      this.postCode2.setValue(post.post2);
    }

    if (info.businessHours.length > 0) {
      this.businessHoursStart1.setValue(info.businessHours[0])
      this.businessHoursStart2.setValue(info.businessHours[1])
      this.businessHoursEnd1.setValue(info.businessHours[2])
      this.businessHoursEnd2.setValue(info.businessHours[3])
      this.breakTimeStart1.setValue(info.businessHours[4])
      this.breakTimeStart2.setValue(info.businessHours[5])
      this.breakTimeEnd1.setValue(info.businessHours[6])
      this.breakTimeEnd2.setValue(info.businessHours[7])
    }
    // 業務内容の設定
    if (info.workContentList.length > 0) {
      this.setWorkContents(info.workContentList);
    }
    this.getCityInfo();
  }

  /**
   * 作業内容を設定する
   * @param workContents
   */
  private setWorkContents(workContents: string[]) {
    let count = 0;
    workContents.forEach(l => {
      if (count == 0) {
        this.workContentsOne = l;
      } else {
        const quForm = this.builder.group({
          name: [l],
        });
        this.options.push(quForm);
      }
      count++;
    });

  }

  /**
   * イメージを設定する
   */
  private setImageUrl() {
    this.s3.onManagedUpload(this.imageFile[0].file).then((data) => {
      if (data) {
        console.log(data);
        this.officeResister();
      }
    }).catch((err) => {
      console.log(err);
    });
  }


  /**
   * 資格情報をデータに格納する
   */
  private setRegisterWorkContents() {
    const contentsArray = this.options.value as { name: string }[];
    const result: string[] = []
    // 資格情報を格納
    const contentsForm = this.workContentsOne.replace(/\s+/g, '');
    if (contentsForm != '' && contentsForm != null) {
      result.push(this.workContentsOne);
    }
    // 追加入力した資格情報を格納
    if (contentsArray.length > 0) {
      contentsArray.forEach(s => {
        // 空白削除
        const contents = s.name.replace(/\s+/g, '');
        if (contents != '' && contents != null) {
          result.push(s.name)
        }
      });
    }
    this.dispInfo.workContentList = result;
  }


  /**
   * 営業時間、休憩時間データを登録データに設定する
   */
  private setBusinessHour() {
    const hourList = [];
    hourList.push(this.businessHoursStart1.value)
    hourList.push(this.businessHoursStart2.value)
    hourList.push(this.businessHoursEnd1.value)
    hourList.push(this.businessHoursEnd2.value)
    hourList.push(this.breakTimeStart1.value)
    hourList.push(this.breakTimeStart2.value)
    hourList.push(this.breakTimeEnd1.value)
    hourList.push(this.breakTimeEnd2.value)
    this.dispInfo.businessHours = hourList;
  }

  /**
   * 関連工場設定モーダルを開く
   */
  private factoryConnect() {
    const data = this.officeInfo;

    // 関連工場モーダル展開
    const dialogRef = this.modal.open(ConnectionFactoryModalComponent, {
      width: '750px',
      height: '600px',
      data: data
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        // 返却値　無理に閉じたらundifind
        console.log('画像モーダル結果:' + result)
        if (result != undefined && result != null) {
          this.officeInfo = result;
        }
      }
    );
  }

  /**
   * 関連メカニック設定モーダルを開く
   */
  private mechanicConnect() {
    const data = this.officeInfo;
    // 関連メカニックモーダル展開
    const dialogRef = this.modal.open(ConnectionMechanicModalComponent, {
      width: '750px',
      height: '600px',
      data: data
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        // 返却値　無理に閉じたらundifind
        console.log('画像モーダル結果:' + result)
        if (result != undefined && result != null) {
          this.officeInfo = result;
        }
      }
    );

  }


  /**
   * 工場管理者設定モーダルを開く
   */
  private factoryAdmiSetting() {
    const data = this.officeInfo;
    // 工場管理者設定モーダル展開
    const dialogRef = this.modal.open(FactoryAdminSettingModalComponent, {
      width: '750px',
      height: '600px',
      data: data
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        // 返却値　無理に閉じたらundifind
        console.log('画像モーダル結果:' + result)
        if (result != undefined && result != null) {
          this.officeInfo = result;
        }
      }
    );
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
          console.log(data.response.location);
          if (data.response.location.length > 0) {
            this.areaCityData = data.response.location;
          }
        });
    }
  }


  /**
   * 都道府県から市町村データを取得し設定する
   */
  private getPostCode(postCode: string) {
    this.apiService.serchPostCode(postCode)
      .subscribe(data => {
        console.log(data.response.location);
        if (data.response.location.length > 0) {
          const postCodeConectData = data.response.location[0];
          const areaCode = _find(this.areaData, area => area.prefectures === postCodeConectData.prefecture);
          if (!areaCode) {
            console.log('no-area');
            return;
          }
          // 地域1(都道府県名)
          this.areaSelect = areaCode.code;
          this.officeArea1.setValue(areaCode.code);
          // 地域2(市町村)
          this.dispInfo.officeArea = postCodeConectData.city;;
          this.citySelect = postCodeConectData.city;
          this.getCityInfo();
          // 地域3(その他)
          this.dispInfo.officeAdress = postCodeConectData.town;
        }
      });
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
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
      return;
    });
  }



}
