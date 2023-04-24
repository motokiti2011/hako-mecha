import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { user, initUserInfo } from 'src/app/entity/user';
import { mechanicInfo, initMechanicInfo } from 'src/app/entity/mechanicInfo';
import { officeInfo, initOfficeInfo } from 'src/app/entity/officeInfo';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { MechanicMenuComponent } from '../mechanic-menu/mechanic-menu.component';
import { FactoryMenuComponent } from '../factory-menu/factory-menu.component';
import { FactoryMechanicImpletionComponent } from '../factory-mechanic-impletion/factory-mechanic-impletion.component';
import { FactoryMechanicContentsManagementComponent } from '../factory-mechanic-contents-management/factory-mechanic-contents-management.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { MatDialog } from '@angular/material/dialog';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';

@Component({
  selector: 'app-factory-mechanic-menu',
  templateUrl: './factory-mechanic-menu.component.html',
  styleUrls: ['./factory-mechanic-menu.component.scss']
})
export class FactoryMechanicMenuComponent implements OnInit {

  /** 子コンポーネントを読み込む */
  @ViewChild(FactoryMenuComponent) child!: FactoryMenuComponent;

  /** 現在のタブ */
  currentTab: any;
  /** 表示タブ */
  displayTab: any;
  /** acceseUser */
  acceseUser?: user;

  /** タブメニューデータ */
  tabs = [
    { name: 'メカニック情報', contents: MechanicMenuComponent, current: true },
    { name: '工場情報', contents: FactoryMenuComponent, current: false },
    { name: '出品中商品一覧', contents: FactoryMechanicContentsManagementComponent, current: false },
    { name: '評価', contents: FactoryMechanicImpletionComponent, current: false },
  ];


  // ユーザー情報
  user: user = initUserInfo;
  // メカニック情報
  mechanicInfo: mechanicInfo = initMechanicInfo;
  // 工場情報
  officeInfo: officeInfo = initOfficeInfo;
  /** 工場登録有無区分 */
  factoryResistDiv = false;


  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private activeRouter: ActivatedRoute,
    private location: Location,
    private apiService: ApiSerchService,
    private router: Router,
    private cognito: CognitoService,
    private overlay: Overlay,
    public modal: MatDialog,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.activeRouter.queryParams.subscribe(params => {
      if (params['mechanicId'] != '') {
        const mechanicId = params['mechanicId'];
        // 初回表示画面をセット
        this.currentTab = MechanicMenuComponent;
        this.getMechanicInfo(mechanicId);
      } else {
        this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, true);
      }
    });

    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        console.log(user);
        this.user = user[0];
        if (this.user.officeId != '0' && this.user.officeId != null) {
          // 工場登録ある場合表示
          this.factoryResistDiv = true;
        }
        // ローディング解除
        this.overlayRef.detach();
        this.loading = false;
      });
    } else {
      this.apiAuth.authenticationExpired();
      // this.openMsgDialog(messageDialogMsg.LoginRequest, true);
      // ローディング解除
      this.overlayRef.detach();
      // this.openMsgDialog(messageDialogMsg.LoginRequest, true);
    }
  }

  /**
   * タブ選択状態により表示するコンポーネントを切り替える
   */
  private migrationDisplay(): void {

    if (_isNil(this.displayTab)) {
      this.displayTab = _find(this.tabs, { current: true });
    }

    switch (this.displayTab.contents) {
      case MechanicMenuComponent:
        this.currentTab = MechanicMenuComponent;
        break;
      case FactoryMenuComponent:
        this.currentTab = FactoryMenuComponent;
        break;
      case FactoryMechanicContentsManagementComponent:
        this.currentTab = FactoryMechanicContentsManagementComponent;
        break;
      case FactoryMechanicImpletionComponent:
        this.currentTab = FactoryMechanicImpletionComponent;
        break;
    }
  }



  /**
   * ボタンがクリックされた時のイベントハンドラ
   * @param {any} $event イベント情報
   * @memberof SwitchTabComponent
   */
  onClick($event: any) {
    // 表示方式情報とタブ選択情報により遷移先を変更
    // const selectTab = _find(this.tabs , {name:$event.target.innerHTML});
    this.displayTab = _find(this.tabs, { name: $event.target.innerHTML });

    // 選択状態フラグを切替える
    this.tabs.forEach((tab) => {
      if (tab.name === this.displayTab.name) {
        tab.current = true;
      } else {
        tab.current = false;
      }
    });
    this.migrationDisplay();
  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * 工場登録（本所属工場新規登録）
   */
  onFactoryResister() {
    this.router.navigate(["/factory-register"]);
  }

  /**
   * 商品一覧はこちらボタン押下イベント
   */
  onFcMcServiceList() {
    this.router.navigate(["fcmc-manegement"],
      { queryParams: { serviceId: '2' } });
  }

  /**
   * 評価はこちらボタン押下イベント
   */
  onFcMcInpulaetion() {
    this.router.navigate(["fcmc-implaetion"],
      { queryParams: { serviceId: '2' } });
  }




  /************  以下内部処理 ****************/


  /**
   * メカニック情報を取得する
   * @param mechanicId
   */
  private getMechanicInfo(mechanicId: string) {
    this.apiService.getMecha(mechanicId).subscribe(result => {
      // メカニック情報取得後企業コードをチェック
      if (result[0] != undefined || result[0] != null) {
        this.mechanicInfo = result[0];
        if (this.mechanicInfo.officeId != null) {
          if (this.mechanicInfo.officeId !== '0') {
            this.getOfficeInfo(this.mechanicInfo.officeId);
          }
        }
        // ローディング解除
        this.overlayRef.detach();
        this.loading = false;
      } else {
        this.openMsgDialog(messageDialogMsg.AnSerchAgainOperation, true);
        return;
      }
    })
  }

  /**
   * 工場情報を取得する
   * @param officeId
   */
  private getOfficeInfo(officeId: string) {
    this.apiService.getOfficeInfo(officeId).subscribe(result => {
      if (result[0] != undefined || result[0] != null) {
        this.officeInfo = result[0];
        // 工場名が未設定の場合
        if (this.officeInfo.officeName == ''
          || this.officeInfo == null) {
          // 登録画面、所属工場情報のボタンを表示
          this.factoryResistDiv = true;
        } else {
          this.factoryResistDiv = false;
        }
      }
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
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
