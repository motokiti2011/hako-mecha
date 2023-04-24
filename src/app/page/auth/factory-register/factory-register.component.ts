import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ApiSerchService } from '../../service/api-serch.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { CognitoService } from '../cognito.service';
import { FormService } from '../../service/form.service';
import { officeInfo, employee, baseInfo, initOfficeInfo } from 'src/app/entity/officeInfo';
import { user, initUserInfo } from 'src/app/entity/user';
import { UploadService } from '../../service/upload.service';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { postSerchInfo } from 'src/app/entity/postCodeInfo';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash'
import { cityData } from 'src/app/entity/area1SelectArea2';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ApiAuthService } from '../../service/api-auth.service';

@Component({
  selector: 'app-factory-register',
  templateUrl: './factory-register.component.html',
  styleUrls: ['./factory-register.component.scss']
})
export class FactoryRegisterComponent implements OnInit {

  // 入力データ
  inputData = {
    // 事業所郵便番号
    officePostCode: '',
    // 事業所電話番号リスト
    officeTel: [],
    // 営業時間
    businessHours: '',
    // 事業所PR
    officePR: '',
    // 事業所PR画像URL
    officePRimageURL: ''
  }
  // 事業所情報
  officeInfo: officeInfo = initOfficeInfo;

  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  areaSelect = '';

  // 工場名
  officeName = new FormControl('', [
    Validators.required
  ]);

  // 事業所メールアドレス
  officeMailAdress = new FormControl('', [
    Validators.required,
    // Validators.email // TODO
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


  // 事業所所在地(地域)
  officeArea1 = '';

  // 事業所所在地（市町村）
  officeArea = '';

  // 事業所所在地（住所その他）
  officeAdress = new FormControl('', [
    Validators.required
  ]);


  /** フォームグループオブジェクト */
  groupForm = this.builder.group({
    officeName: this.officeName,
    officeMailAdress: this.officeMailAdress,
    officeAdress: this.officeAdress,
    postCode1: this.postCode1,
    postCode2: this.postCode2,
    telNo1: this.telNo1,
    telNo2: this.telNo2,
    telNo3: this.telNo3,
  })

  // 管理設定ユーザー
  adminSettingUser = '';
  // 従業員リスト
  employeeList: employee[] = [];
  // 拠点情報リスト
  baseInfoList: baseInfo[] = [];
  // 営業時間（開始）businessHours
  businessHoursStart = ''
  // 営業時間（終了）
  businessHoursEnd = ''
  // 休憩時間(開始)
  restHoursStart = '';
  // 休憩時間(開始)
  restHoursEnd = '';
  // 作業内容
  workContentsOne = '';
  // 業務内容
  businessContentList: string[] = [];
  // ユーザー情報
  user: user = initUserInfo;
  // 画像情報
  imageFile: any = null;
  // テンプレートで使用するフォームを宣言
  public form!: FormGroup;
  /** 地域２（市町村）データ */
  areaCityData: cityData[] = []
  /** 地域２（市町村）選択 */
  citySelect = '';

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private builder: FormBuilder,
    private apiService: ApiSerchService,
    private apiUniqueService: ApiUniqueService,
    private router: Router,
    private cognito: CognitoService,
    private location: Location,
    private s3: UploadService,
    private formService: FormService,
    public modal: MatDialog,
    private overlay: Overlay,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        console.log(user);
        this.user = user[0];
        this.initForm();
      });
    } else {
      // ダイアログ表示（ログインしてください）し前画面へ戻る
      const dialogData: messageDialogData = {
        massage: messageDialogMsg.LoginRequest,
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
        this.apiAuth.authenticationExpired();
        console.log(result);
        // ローディング解除
        this.overlayRef.detach();
        this.router.navigate(["/main_menu"]);
        return;
      });
    }
    this.initForm();
  }


  // FormBuilderを使って初期フォームを作成します。フォームの塊のFormGroupとしています。
  initForm() {
    this.form = this.builder.group({
      name: [''],
      // フォームを追加したり、削除したりするために、FormArrayを設定しています。
      options: this.builder.array([])
    });
    // ローディング解除
    this.overlayRef.detach();
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


  test1() {
    this.setbusinessContent();
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
   * ユーザー登録情報と合わせるボタン押下時イベント
   * @param e
   */
  onSomeUserInfo(e: string) {
    if (e === '1') {
      // 名称を設定
      this.officeName.setValue(this.user.userName);
    } else if (e === '2') {
      // 電話番号を設定
      const telNo = this.formService.splitTelNo(this.user.TelNo1);
      this.telNo1.setValue(telNo.tel1);
      this.telNo2.setValue(telNo.tel2);
      this.telNo3.setValue(telNo.tel3);
    } else if (e === '3') {
      // アドレスを設定
      this.officeMailAdress.setValue(this.user.mailAdress);
    } else if (e === '4') {
      // 所在地情報を設定
      this.officeArea1 = this.user.areaNo1;
      this.areaSelect = this.officeArea1;
      this.getCityInfo();
      if (this.user.areaNo2) {
        this.officeArea = this.user.areaNo2;
        this.citySelect = this.officeArea;
      }
      if (this.user.adress) {
        this.officeAdress.setValue(this.user.adress);
      }
      if (this.user.postCode) {
        const post = this.formService.splitPostCode(this.user.postCode);
        this.postCode1.setValue(post.post1);
        this.postCode2.setValue(post.post2);
      }
    }

  }

  /**
   * 登録するボタン押下イベント
   */
  onRegister() {
    if (this.imageFile != null) {
      this.setImageUrl();
    } else {
      this.officeResister();
    }
  }

  /**
   * 地域選択イベント
   */
  selectArea() {
    console.log('地域')
    console.log(this.areaSelect)
    this.officeArea1 = this.areaSelect;
    this.getCityInfo();
  }

  /**
   * 市町村選択イベント
   */
  onSelectCity() {
    this.officeArea = this.citySelect;
    // console.log(this.inputData.area2);
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
      this.getPostCode(post)

      // if (postCodeConectData) {
      //   // 地域1(都道府県名)
      //   this.areaSelect = postCodeConectData.prefecturesCode;
      //   this.officeArea1 = postCodeConectData.prefecturesCode;
      //   // 地域2(市町村)
      //   this.officeArea = postCodeConectData.municipality;
      //   this.getCityInfo();
      //   this.citySelect = postCodeConectData.municipality;
      //   // 地域3(その他)
      //   this.officeAdress.setValue(postCodeConectData.townArea);
      // }
    }
  }

  goBack() {
    this.location.back();
  }


  /************  以下内部処理 ****************/

  /**
   * イメージを設定する
   */
  private setImageUrl() {
    this.s3.onManagedUpload(this.imageFile).then((data) => {
      if (data) {
        console.log(data);
        this.inputData.officePRimageURL = data.Location;
        this.officeResister();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * 工場登録
   */
  private officeResister() {
    // 業務内容情報を設定
    this.setbusinessContent();
    // 更新データ設定
    this.officeInfo.officeName = this.officeName.value;
    this.officeInfo.officeTel = this.inputData.officeTel;
    this.officeInfo.officeMailAdress = this.officeMailAdress.value;
    this.officeInfo.officeArea1 = this.officeArea1;
    this.officeInfo.officeArea = this.officeArea;
    this.officeInfo.officeAdress = this.officeAdress.value;
    this.officeInfo.officePostCode = this.formService.setPostCode(this.postCode1.value, this.postCode2.value);
    this.officeInfo.workContentList = this.businessContentList;
    this.officeInfo.officeTel.push(this.formService.setTelNo(this.telNo1.value, this.telNo2.value, this.telNo3.value))

    // TODO
    this.officeInfo.businessHours = [];
    this.officeInfo.connectionOfficeInfo = [];
    this.officeInfo.connectionMechanicInfo = [];
    this.officeInfo.officePR = this.inputData.officePR;
    this.officeInfo.officePRimageURL = this.inputData.officePRimageURL;
    let mechanicId = '';
    if (this.user.mechanicId) {
      mechanicId = this.user.mechanicId;
    }

    this.apiUniqueService.postFactory(this.officeInfo, this.user.userId, mechanicId).subscribe(result => {
      console.log(result);
      let resultMsg = '';
      if (result == 200) {
        this.openMsgDialog(messageDialogMsg.Resister, true);
      } else {
        this.openMsgDialog(messageDialogMsg.AnResister, false);
      }
    });
  }


  /**
   * 業務内容情報をデータに格納する
   */
  private setbusinessContent() {
    const businessContentArray = this.options.value as { name: string }[];
    const result: string[] = []

    // 資格情報を格納
    const contents = this.workContentsOne.replace(/\s+/g, '');
    if (contents != '' && contents != null) {
      result.push(this.workContentsOne);
    }
    // 追加入力した資格情報を格納
    if (businessContentArray.length > 0) {
      businessContentArray.forEach(s => {
        // 空白削除
        const businessContent = s.name.replace(/\s+/g, '');
        if (businessContent != '' && businessContent != null) {
          result.push(s.name)
        }
      });
    }
    console.log(result)
    this.businessContentList = result;
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
          this.officeArea1 = areaCode.code;
          // 地域2(市町村)
          this.officeArea = postCodeConectData.city;
          this.citySelect = postCodeConectData.city;
          this.getCityInfo();
          // 地域3(その他)
          this.officeAdress.setValue(postCodeConectData.town);
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
        this.location.back();
        // this.router.navigate(["/main_menu"]);
      }
      console.log(result);
      // ローディング解除
      this.overlayRef.detach();
      return;
    });
  }

}
