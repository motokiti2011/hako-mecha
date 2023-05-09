import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { user, initUserInfo } from 'src/app/entity/user';
import { mechanicInfo, initMechanicInfo } from 'src/app/entity/mechanicInfo';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { imgFile } from 'src/app/entity/imgFile';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';
import { ApiSerchService } from '../../service/api-serch.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { CognitoService } from '../cognito.service';
import { UploadService } from '../../service/upload.service';
import { SingleImageModalComponent } from '../../modal/single-image-modal/single-image-modal.component';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { ApiAuthService } from '../../service/api-auth.service';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-mechanic-register',
  templateUrl: './mechanic-register.component.html',
  styleUrls: ['./mechanic-register.component.scss']
})
export class MechanicRegisterComponent implements OnInit {


  // ユーザー情報
  user: user = initUserInfo;
  // メカニック情報
  mechanicInfo: mechanicInfo = initMechanicInfo;

  // 保有資格情報
  qualification = '';
  // 保有資格情報配列
  qualificationList: string[] = [];

  // 工場区分
  officeDiv = false;

  // 管理アドレス区分
  adminAdress = '0';

  // 事業所紐付き区分
  officeConnectionDiv = '0';
  qualificationOne = '';

  /** フォームコントロール */
  // メカニック名
  mechanicName = new FormControl('', [
    Validators.required
  ]);
  // 管理メールアドレス
  mailAdress = new FormControl('', [
    Validators.required,
    // Validators.email // 要検討
  ]);

  /** 必須フォームグループオブジェクト */
  requiredForm = this.builder.group({
    mechanicName: this.mechanicName,
    mailAdress: this.mailAdress,
  })



  // 入力データ
  inputData = {
    // メカニックID
    mechanicId: '',
    // 管理ユーザーID
    adminUserId: '',
    // 管理アドレス区分
    adminAddressDiv: '',
    // 事業所紐づき区分
    officeConnectionDiv: '0',
    // 事業所ID
    officeId: '',
    // 事業所名
    officeName: null,
    // 保有資格情報
    qualification: [''],
    // 得意作業
    specialtyWork: null,
    // プロフィール画像URL
    profileImageUrl: '',
    // 紹介文
    introduction: ''
  }

  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  areaSelect = '';
  /** 画像情報 */
  imageFile: imgFile[] = []

  public form!: FormGroup;  // テンプレートで使用するフォームを宣言

  loading = false;

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  authExpiredDiv = false;

  constructor(
    private location: Location,
    private apiService: ApiSerchService,
    private apiUniqueService: ApiUniqueService,
    private router: Router,
    private builder: FormBuilder,
    private cognito: CognitoService,
    private s3: UploadService,
    public modal: MatDialog,
    private apiAuth: ApiAuthService,
    private overlay: Overlay,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        if(!user) {
          // ユーザー情報が取得できない場合
          this.authExpiredDiv = true;
          this.openMsgDialog(messageDialogMsg.LoginRequest, true);
          return;
        }
        console.log(user);
        this.inputData.adminUserId = user[0].userId;
        this.user = user[0];
        this.initForm();
      });
    } else {
      this.authExpiredDiv = true;
      this.openMsgDialog(messageDialogMsg.LoginRequest, true);
    }
  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }



  /**
   * 登録するボタン押下イベント
   */
  onResister() {
    if (this.imageFile != undefined
      && this.imageFile != null
      && this.imageFile.length > 0) {
      this.setImageUrl();
    } else {
      this.mechanicResister();
    }
  }

  /**
   * ユーザー登録情報と合わせるボタン押下時イベント
   * @param e
   */
  onSomeUserInfo(e: string) {
    if (e === '1') {
      // 名称を設定
      this.mechanicName.setValue(this.user.userName);
    } else if (e === '3') {
      // アドレスを設定
      this.mailAdress.setValue(this.user.mailAdress);
    } else if (e === '4') {
      // 紹介文を設定
      if (this.user.introduction) {
        this.inputData.introduction = this.user.introduction;
      }
    }

  }

  /**
   * 工場を検索する
   */
  onSerchFactory() {
    const one = '1'
    this.inputData.officeId = one;
  }



  // FormBuilderを使って初期フォームを作成します。フォームの塊のFormGroupとしています。
  initForm() {
    this.form = this.builder.group({
      name: [''],
      options: this.builder.array([])
    });
    this.loading = false;
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
    this.setQualification();
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





  /************  以下内部処理 ****************/

  /**
   * イメージを設定する
   */
  private setImageUrl() {
    this.s3.onManagedUpload(this.imageFile[0].file).then((data) => {
      if (data) {
        console.log(data);
        this.inputData.profileImageUrl = data.Location;
        this.mechanicResister();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * メカニック登録
   */
  private mechanicResister() {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.setQualification();
    this.inputCheck();
    this.apiUniqueService.postMechanic(this.mechanicInfo, this.officeDiv).subscribe(result => {
      if (result != 200) {
        this.openMsgDialog(messageDialogMsg.AnResister, false)
        this.loading = false;
        this.overlayRef.detach();
      } else {
        this.openMsgDialog(messageDialogMsg.Resister, true)
      }
    });
  }


  /**
   * 資格情報をデータに格納する
   */
  private setQualification() {
    console.log(this.qualificationOne);
    const qualificationArray = this.options.value as { name: string }[];
    const result: string[] = []
    // 資格情報を格納
    const qualificationForm = this.qualificationOne.replace(/\s+/g, '');
    if (qualificationForm != '' && qualificationForm != null) {
      result.push(this.qualificationOne);
    }
    // 追加入力した資格情報を格納
    if (qualificationArray.length > 0) {
      qualificationArray.forEach(s => {
        // 空白削除
        const qualification = s.name.replace(/\s+/g, '');
        if (qualification != '' && qualification != null) {
          result.push(s.name)
        }
      });
    }
    this.inputData.qualification = result;
  }

  /**
   * 入力チェック
   */
  private inputCheck() {
    let message: string[] = []
    if (this.inputData.introduction == '' || this.inputData.introduction == null) {
      message.push('紹介文')
    }
    this.mechanicInfo.mechanicId = '0'
    this.mechanicInfo.validDiv = '0'
    this.mechanicInfo.mechanicName = this.mechanicName.value;
    this.mechanicInfo.adminUserId = this.inputData.adminUserId;
    this.mechanicInfo.adminAddressDiv = this.adminAdress;
    this.mechanicInfo.mailAdress = this.mailAdress.value;
    this.mechanicInfo.areaNo1 = this.user.areaNo1;
    this.mechanicInfo.areaNo2 = this.user.areaNo2;
    this.mechanicInfo.officeConnectionDiv = this.officeConnectionDiv
    this.mechanicInfo.officeId = this.inputData.officeId;
    this.mechanicInfo.qualification = this.inputData.qualification;
    this.mechanicInfo.specialtyWork = this.inputData.specialtyWork;
    this.mechanicInfo.profileImageUrl = this.inputData.profileImageUrl;
    this.mechanicInfo.introduction = this.inputData.introduction;
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
        if(this.authExpiredDiv) {
          this.apiAuth.authenticationExpired();
        }
        this.router.navigate(["/main_menu"]);
      }
      return;
    });
  }



}


