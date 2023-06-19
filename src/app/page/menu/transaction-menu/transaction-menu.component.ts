import { Component, OnInit } from '@angular/core';
import { find as _find, isNil as _isNil } from 'lodash';
import { Router } from '@angular/router';
import { TransactionMenuService } from './transaction-menu.service';
import { BrowsingHistoryComponent } from './browsing-history-tab/browsing-history-detail/browsing-history/browsing-history.component';
import { TansactionCompleteComponent } from './transaction-complete-tab/tansaction-complete.component';
import { TransactionListComponent } from './transaction/transaction-list/transaction-list.component';
import { FavoriteComponent } from './favorite-tab/favorite/favorite.component';
import { MyListComponent } from './mylist-tab/mylist-detail/my-list/my-list.component';
import { AuthUserService } from '../../auth/authUser.service';
import { CognitoService } from '../../auth/cognito.service';
import { loginUser } from 'src/app/entity/loginUser';
import { user } from 'src/app/entity/user';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { MatDialog } from '@angular/material/dialog';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';

@Component({
  selector: 'app-transaction-menu',
  templateUrl: './transaction-menu.component.html',
  styleUrls: ['./transaction-menu.component.scss']
})
export class TransactionMenuComponent implements OnInit {

  /**  */
  displayMethod = false;
  /**  */
  selected = 'listDisplay';
  /** 現在のタブ */
  currentTab: any;
  /** 表示タブ */
  displayTab: any;
  /** acceseUser */
  acceseUser?: user;

  /** タブメニューデータ */
  tabs = [
    { name: 'お知らせ', contents: MyListComponent, current: true },
    { name: 'お気に入り', contents: FavoriteComponent, current: false },
    { name: '閲覧履歴', contents: BrowsingHistoryComponent, current: false },
    { name: '取引中', contents: TransactionListComponent, current: false },
    { name: '取引終了分', contents: TansactionCompleteComponent, current: false },
  ];
  /** 表示方法切替セレクト */
  data = [
    { label: '一覧表示', value: 'listDisplay', disabled: false },
    { label: '詳細表示', value: 'detailDisplay', disabled: false },
  ];

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private router: Router,
    private service: TransactionMenuService,
    private cognito: CognitoService,
    private auth: AuthUserService,
    private overlay: Overlay,
    public modal: MatDialog,
    private apiAuth: ApiAuthService,

  ) { }

  ngOnInit(): void {
    this.initDisplay();
    this.authUserSetting();
    // 初回表示画面をセット
    this.currentTab = MyListComponent;
  }

  /**
   * アクセスユーザー情報の取得設定を行う
   */
  private authUserSetting() {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    // ログイン検証
    const authUser = this.cognito.initAuthenticated();
    if(authUser == null) {
      this.apiAuth.authenticationExpired();
      this.openMsgDialog(messageDialogMsg.LoginRequest, true);
      return;
    }
    this.service.getUser(authUser).subscribe(result => {
      if(result[0] != null) {
        this.acceseUser = result[0];
        const acceseUser:loginUser = {
          userId: authUser,
          userName: result[0].userName,
          mechanicId: result[0].mechanicId,
          officeId: result[0].officeId
        }
        // Subjectにユーザー情報をセットする。
        this.auth.login(acceseUser);
        // ローディング解除
        this.overlayRef.detach();
      } else {
        this.apiAuth.authenticationExpired();
        this.openMsgDialog(messageDialogMsg.LoginRequest, true);
        return;
      }
    });
  }


  /**
   * 表示方式の初期設定を行う
   */
  private initDisplay() {
    if (this.selected === 'listDisplay') {
      this.displayMethod = true;
    }
    this.migrationDisplay();
  }


  /**
   * 表示方式の切り替えを行う
   */
  changeDisplay() {
    if (this.selected === 'listDisplay') {
      this.displayMethod = true;
    } else {
      this.displayMethod = false;
    }

    this.migrationDisplay();
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
   * タブ選択状態により表示するコンポーネントを切り替える
   */
  private migrationDisplay(): void {

    if (_isNil(this.displayTab)) {
      this.displayTab = _find(this.tabs, { current: true });
    }

    switch (this.displayTab.contents) {
      case MyListComponent:
        this.currentTab = MyListComponent;
        break;
      case FavoriteComponent:
        this.currentTab = FavoriteComponent;
        break;
      case BrowsingHistoryComponent:
        this.currentTab = BrowsingHistoryComponent;
        break;
      case TransactionListComponent:
        this.currentTab = TransactionListComponent;
        break;
      case TansactionCompleteComponent:
        this.currentTab = TansactionCompleteComponent;
        break;
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
        this.router.navigate(["/main_menu"]);
      }
      // ローディング解除
      this.overlayRef.detach();
      return;
    });
}

}
