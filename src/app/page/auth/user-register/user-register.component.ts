import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { user, initUserInfo } from 'src/app/entity/user';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApiSerchService } from '../../service/api-serch.service';
import { UploadService } from '../../service/upload.service';
import { FormService } from '../../service/form.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { cityData } from 'src/app/entity/area1SelectArea2';
import { MatDialog } from '@angular/material/dialog';
import { SingleImageModalComponent } from 'src/app/page/modal/single-image-modal/single-image-modal.component';
import { imgFile } from 'src/app/entity/imgFile';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { ApiAuthService } from '../../service/api-auth.service';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

  // ユーザー情報
  user: user = initUserInfo;

  authExpiredDiv = false;

  /** フォームコントロール */
  name = new FormControl('', [
    Validators.required
  ]);

  mail = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  telNo1 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  telNo2 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  telNo3 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  postCode1 = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(3)
  ]);

  postCode2 = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  /** フォームグループオブジェクト */
  groupForm = this.builder.group({
    name: this.name,
    // mail: this.mail,
    telNo1: this.telNo1,
    telNo2: this.telNo2,
    telNo3: this.telNo3,
    postCode1: this.postCode1,
    postCode2: this.postCode2
  })

  /** その他インプットデータ */
  inputData = {
    areaNo1: '',
    areaNo2: '',
    adress: '',
    introduction: '',
  }

  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  areaSelect = '';

  /** 地域２（市町村）データ */
  areaCityData: cityData[] = []
  /** 地域２（市町村）選択 */
  citySelect = '';
  /** イメージ */
  imageFile: imgFile[] = []


  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private location: Location,
    private apiService: ApiSerchService,
    private router: Router,
    private s3: UploadService,
    private builder: FormBuilder,
    private form: FormService,
    private cognito: CognitoService,
    private overlay: Overlay,
    public modal: MatDialog,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    const user = this.cognito.initAuthenticated();
    if (user == null) {
      // ユーザー情報が取得できない場合
      this.authExpiredDiv = true;
      this.openMsgDialog(messageDialogMsg.LoginRequest, true);
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
      return;
    }
    console.log(user);
    this.apiService.getUser(user).subscribe(data => {
      this.user.userId = data[0].userId;
      // 初回はメールアドレスしかないので格納する
      this.mail.setValue(data[0].mailAdress);
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * 地域選択イベント
   */
  selectArea() {
    console.log('県名選択：' + this.inputData.areaNo1);
    this.inputData.areaNo1 = this.areaSelect;
    this.getCityInfo();
  }

  /**
   * 市町村選択イベント
   */
  onSelectCity() {
    this.inputData.areaNo2 = this.citySelect;
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
   * アップロードファイル選択時イベント
   * @param event
   */
  onInputChange(event: any) {
    const file = event.target.files[0];
    console.log(file);
    this.imageFile = file;
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
   * 登録ボタン押下時イベント
   */
  onResister() {
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    if (this.imageFile != null && this.imageFile.length > 0) {
      this.setImageUrl();
    } else {
      this.userResister();
    }
  }


  /************  以下内部処理 ****************/

  /**
   * イメージを設定する
   */
  private setImageUrl() {
    this.s3.onManagedUpload(this.imageFile[0].file).then((data) => {
      if (data) {
        console.log(data);
        this.user.profileImageUrl = data.Location;
        this.userResister();
      }
    }).catch((err) => {
      console.log(err);
      this.openMsgDialog(messageDialogMsg.AnResister, false)
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }

  /**
   * ユーザー情報を登録する
   */
  private userResister() {
    console.log(this.inputData);
    if (_isNil(this.inputData.areaNo1) || this.inputData.areaNo1 == '') {
      this.openMsgDialog(messageDialogMsg.Required, false);
    } else {
      this.user.userId = this.user.userId;
      this.user.userValidDiv = '0';
      this.user.corporationDiv = '0';
      this.user.userName = this.name.value;
      this.user.mailAdress = this.mail.value;
      this.user.TelNo1 = this.form.setTelNo(this.telNo1.value, this.telNo2.value, this.telNo3.value);
      this.user.areaNo1 = this.areaSelect;
      this.user.areaNo2 = this.inputData.areaNo2;
      this.user.adress = this.inputData.adress;
      this.user.postCode = this.form.setPostCode(this.postCode1.value, this.postCode2.value);
      this.user.introduction = this.inputData.introduction;

      this.apiService.postUser(this.user).subscribe(result => {
        if (result == undefined) {
          this.openMsgDialog(messageDialogMsg.AnResister, false);
        } else {
          this.openMsgDialog(messageDialogMsg.Resister, true);
        }
      });
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
          this.inputData.areaNo1 = areaCode.code;
          // 地域2(市町村)
          this.inputData.areaNo2 = postCodeConectData.city;
          this.citySelect = postCodeConectData.city;
          this.getCityInfo();
          // 地域3(その他)
          this.inputData.adress = postCodeConectData.town;
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
        // ローディング解除
        this.overlayRef.detach();
        this.loading = false;
        if (this.authExpiredDiv) {
          this.apiAuth.authenticationExpired();
        }
        this.router.navigate(["/main_menu"])
      }
      console.log(result);
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
      return;
    });
  }

}
