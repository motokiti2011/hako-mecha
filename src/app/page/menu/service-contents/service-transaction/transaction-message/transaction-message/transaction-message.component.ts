import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionMessageService } from './transaction-message.service';
import { dispSlipComment } from 'src/app/entity/slipMessageInfo';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { isNil as _isNil, find as _find } from 'lodash';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { Overlay } from '@angular/cdk/overlay';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';

@Component({
  selector: 'app-transaction-message',
  templateUrl: './transaction-message.component.html',
  styleUrls: ['./transaction-message.component.scss']
})
export class TransactionMessageComponent implements OnInit {

  /** メッセージ公開レベル */
  dispDiv = false;
  /** 非公開時メッセージ */
  privateMessage = 'このメッセージは非公開となってます';
  /** 投稿メッセージ */
  sernderMessage = '';
  /** 投稿ボタン活性フラグ */
  isDisabled = true;
  /** 伝票メッセージリスト */
  dispMessageList: dispSlipComment[] = [];
  /** 宛先選択状態初期値 */
  adressSelect = '';
  /** 宛先選択情報 */
  adressData: { sendId: string, name: string }[] = [];
  /** 宛先情報 */
  adressId: string = '';
  /** 管理者区分 */
  adminDiv = false;
  /** サービスID */
  serviceId = '';
  /** アクセスユーザー */
  acceseUser = '';
  /** アクセスユーザー */
  acceseUserInfo = { userId: '', userName: '' };

  /** ローディングオーバーレイ */
  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  // /** 伝票番号 */
  // @Input() dispSlipId: string = '';
  /** 管理者ユーザーフラグ */
  // @Input() adminUserDiv: boolean = false;
  // /** アクセスユーザー情報 */
  // @Input() acsessUser = { userId: '', userName: '' };

  constructor(
    private auth: AuthUserService,
    private cognito: CognitoService,
    private route: ActivatedRoute,
    private service: TransactionMessageService,
    private overlay: Overlay,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.loading = true;
    // 認証ユーザー情報取得
    const acsessUser = this.cognito.initAuthenticated();
    if (acsessUser !== null) {
      this.acceseUser = acsessUser;
      this.service.getUser(acsessUser).subscribe(data => {
        if (data.length == 0) {
          // ローディング開始
          this.loading = false;
          this.apiAuth.authenticationExpired();
          // ユーザーが取得できない場合処理を停止(親compornentで戻る)
          return;
        }
        this.acceseUserInfo.userId = data[0].userId;
        this.acceseUserInfo.userName = data[0].userName;
        // 伝票表示情報取得反映
        this.route.queryParams.subscribe(params => {
          this.serviceId = params['slipNo'];
          const serviceType = params['serviceType'];
          // 管理者判定
          let slipAdminCheckId = data[0].userId;
          if (serviceType == '1' && data[0].officeId) {
            slipAdminCheckId = data[0].officeId;
          } else if (serviceType == '2' && data[0].mechanicId) {
            slipAdminCheckId = data[0].mechanicId;
          }
          this.service.slipAuthCheck(this.serviceId, slipAdminCheckId, serviceType).subscribe(result => {
            this.dispDiv = true;
            this.service.checkAdminSlip(this.serviceId, this.acceseUser).subscribe(check => {
              this.adminDiv = check
              // 伝票メッセージ情報を取得
              this.setDispMessage();
              this.setAdress();
            });
          });
        });
      });
    } else {
      // ローディング開始
      this.loading = false;
      this.apiAuth.authenticationExpired();
      // ユーザーが取得できない場合処理を停止(親compornentで戻る)
      return;
    }
  }

  /**
   * 表示処理
   * @param serviceId
   * @param acceseUser
   */
  onShow(serviceId: string, acceseUser: string) {
    // ローディング開始
    // this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.dispDiv = true;
    this.serviceId = serviceId;
    this.acceseUser = acceseUser;
    // this.service.getSlipMessage(serviceId).subscribe(data => {
    //   console.log(data);
    this.service.checkAdminSlip(serviceId, acceseUser).subscribe(check => {
      this.adminDiv = check
      // 伝票メッセージ情報を取得
      this.setDispMessage();
    });
    // });
    this.setAdress();
  }

  /**
   * 表示メッセージを作成する
   */
  private setDispMessage() {
    // ローディング開始
    this.loading = true;
    this.service.getSlipMessage(this.serviceId).subscribe(data => {
      if (this.acceseUser) {
        this.dispMessageList = this.service.adminDispSetting(data, this.acceseUserInfo.userId)
      } else {
        this.dispMessageList = this.service.gestDispSetting(data, this.acceseUserInfo.userId)
      }
      console.log(this.dispMessageList);
      // ローディング解除
      this.loading = false;
    });
  }

  /**
   * メッセージ非表示設定
   */
  onHidden() {
    this.privateMessage = 'メッセージは非表示となってます。'
    this.dispDiv = false;
  }

  /**
   * 宛先情報を設定する
   */
  private setAdress() {
    if (!this.adminDiv) {
      this.adressData = this.service.sendAdressSetting();
      // ローディング解除
      // this.overlayRef.detach();
      this.loading = false;
      return;
    }
    // ローディング開始
    this.loading = true;
    this.service.getSendAdress(this.serviceId).subscribe(data => {
      this.adressData = this.service.setAdminAdress(this.acceseUser, data[0]);
      // ローディング解除
      // this.overlayRef.detach();
      this.loading = false;
    });
  }

  /**
   *　宛先変更イベント
   */
  selectAdress() {
    console.log(this.adressSelect)
    const adress = _find(this.adressData, data => data.sendId == this.adressSelect)
    if (adress != undefined) {
      this.adressId = adress.sendId;
    }
  }

  /**
   * 送信メッセージイベント
   */
  sendMessage() {
    if (this.sernderMessage != '') {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  /**
   * 送信メッセージイベント
   */
  onSendMessage() {
    if (_isNil(this.sernderMessage) || this.sernderMessage == '') {
      // 空文字の場合登録しない
      return;
    }
    if (this.acceseUserInfo.userId == '') {
      return;
    }
    if (!_isNil(this.acceseUserInfo.userId)) {
      this.service.sernderMessage(
        this.acceseUserInfo.userId,
        this.acceseUserInfo.userName,
        this.serviceId,
        this.adressId,
        this.sernderMessage)
        .subscribe(data => {
          if (data.ResponseMetadata.HTTPStatusCode === 200) {
            // 連続投稿防止のためメッセージ初期化
            this.sernderMessage = '';
            this.isDisabled = true;
            // 再読み込みを実施
            this.setDispMessage();
          } else {
            console.log('メッセージ登録失敗です。')
          }
        });
    }


  }

}
