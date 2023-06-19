import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { LoginComponent } from '../../modal/login/login.component';
import { HeaderMenuService } from './header-menu.service';
import { loginUser } from 'src/app/entity/loginUser';
import { AuthUserService } from '../../auth/authUser.service';
import { CognitoService } from '../../auth/cognito.service';
import { ApiSerchService } from '../../service/api-serch.service';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogMsg } from 'src/app/entity/msg';
import { ApiAuthService } from '../../service/api-auth.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

  /** カテゴリー操作時のイベント */
  @Output() authCheck = new EventEmitter<boolean>();

  loginUser: loginUser = { userId: '', userName: 'ログイン', mechanicId: null, officeId: null };

  temporaryUserDiv = false;

  openMsg = false;

  login = {
    userName: '',
    passwd: '',
    selected: false,
    reissuePasswd: false,
    newResister: false
  }

  // 認証有無フラグ
  authUserDiv = false;

  /** ローディングオーバーレイ */
  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private router: Router,
    private service: HeaderMenuService,
    public modal: MatDialog,
    private cognito: CognitoService,
    private authUserService: AuthUserService,
    private apiService: ApiSerchService,
    private apiAuth: ApiAuthService,
    private overlay: Overlay,
  ) { }

  ngOnInit(): void {
    this.authenticated();
  }

  hakomecha() {
    this.router.navigate(["/main_menu"])
  }

  /**
   * ログイン状態確認
   */
  private authenticated() {
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      // ログイン状態の場合
      this.authUserDiv = true;
      // 認証済の場合表示するユーザー情報を取得
      this.setAuthUser(authUser);
    } else {
      this.authUserDiv = false;
    }
  }

  /**
   * 認証情報からユーザー情報を取得
   * @param authUser
   */
  private setAuthUser(userid: string) {
    // 認証済の場合表示するユーザー情報を取得
    this.apiService.getUser(userid).subscribe(data => {
      if (data[0]) {
        this.authCheck.emit(false);
        this.loginUser.userId = data[0].userId;
        this.loginUser.userName = data[0].userName;

        this.authUserService.login(this.loginUser);
        if (data[0].userName == undefined
          || data[0].userName == '') {
          // 仮登録ユーザーのためユーザー登録メッセージを表示
          this.temporaryUserDiv = true;
        } else {
          this.loginUser.userName = data.userName;
          this.temporaryUserDiv = false;
        }
      } else {
        // 認証切れの場合
        this.authUserDiv = false;
        this.authCheck.emit(true);
        this.authUserService.logout();
        this.loginUser.userName = 'ユーザー情報未設定'
      }
    });
  }

  /**
   * ユーザー認証(ログイン)を行う
   */
  onLogin() {
    const dialogRef = this.modal.open(LoginComponent, {
      width: '400px',
      height: '450px',
      data: this.login
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        if (result !== undefined) {
          this.login = result;
          // 画面遷移の結果でモーダルを閉じた場合、各画面に遷移する。
          if (this.login.reissuePasswd) {
            // パスワード画面に遷移
            this.router.navigate(["reissue_passwd_component"])
            return;
          }
          if (this.login.newResister) {
            // 新規登録画面に遷移
            this.router.navigate(["signup"])
            return;
          }
          if (this.login.userName) {
            // ユーザー情報を取得
            // ログイン状態を保持する。
            this.authenticated();
            return;
          }
        } else {
          this.authenticated();
          return;
        }
      }
    );
  }


  /**
   * ヘルプを展開する
   */
  onClickHelp() {
    this.router.navigate(["help"])
  }


  /**
   * ログアウト押下時
   */
  onLogout() {
    this.authUserDiv = false;
    this.apiAuth.authenticationExpired();
    // this.cognito.logout();
    this.authUserService.logout;
    this.loginUser.userName = 'ログイン';
    this.authCheck.emit(true);
    // ログアウトメッセージを表示
    this.openMsgDialog(messageDialogMsg.Logout, true);
    // this.authenticated();
  }

  /**
   * 新規登録ボタン押下時
   */
  onSinup() {
    this.router.navigate(["signup"]);
  }

  /**
   * ユーザー登録ボタン押下時
   */
  onUserResister() {
    this.router.navigate(["user-resister-component"]);
  }

  /**
   * マイページ押下時イベント
   */
  onMypage() {
    this.router.navigate(["my-menu-component"]);
  }


  /**
   * メッセージダイアログ展開
   * @param msg
   * @param locationDiv
   */
  private openMsgDialog(msg: string, locationDiv: boolean) {
    // ダイアログ表示
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
      // ローディング解除
      this.overlayRef.detach();

      return;
    });
  }




}
