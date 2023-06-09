import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { loginUser } from 'src/app/entity/loginUser';
import { AuthUserService } from '../../auth/authUser.service';
import { CognitoService } from '../../auth/cognito.service';
import { ApiSerchService } from '../../service/api-serch.service';
import { LoginComponent } from '../../modal/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private cognito: CognitoService,
    private authUserService: AuthUserService,
    private apiService: ApiSerchService,
    public loginModal: MatDialog,
    private overlay: Overlay,
  ) { }

  /** 子コンポーネントを読み込む */
  @ViewChild(HeaderMenuComponent) child!: HeaderMenuComponent;

  temporaryUserDiv = false;

  loginUser: loginUser = { userId: '', userName: 'ログイン', mechanicId: null, officeId: null };

  /** 認証有無フラグ  */
  authUserDiv = false;
  /** メカニック区分 */
  mechanicDiv = false;

  /** 工場区分 */
  officeDiv = false;

  /** メニューローディング区分 */
  menuLoadingDiv = false;

  login = {
    userName: '',
    passwd: '',
    selected: false,
    reissuePasswd: false,
    newResister: false
  }

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  ngOnInit(): void {
    this.authenticated();
    this.child.ngOnInit();
  }

  /**
   * サービスを依頼する
   */
  serviceReqest() {
    this.router.navigate(["service_create"],
      { queryParams: { serviceType: '0' } });
  }

  /**
   * サービスを出品する
   */
  serviceExhibit(select: string) {
    this.router.navigate(["service_create"],
      { queryParams: { serviceType: select } });
  }

  /**
   * サービス一覧
   */
  serviceSerch() {
    this.router.navigate(["service_list"])
  }

  /**
   * サービス検索条件
   */
  serviceSerchConditions() {
    this.router.navigate(["serchconditions"])
  }


  /**
   * 取引メニュー
   */
  serviceDealings() {
    this.router.navigate(["transaction_menu"])
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
   * 新規登録ボタン押下時
   */
  onSinup() {
    this.router.navigate(["signup"]);
  }


  /*************** 内部処理  ************************/

  /**
   * ログイン状態確認
   */
  private authenticated() {
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      this.authUserDiv = true;
      // ログイン状態の場合
      const log = this.cognito.getCurrentUserIdToken();
      console.log(log);
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
    // // ローディング開始
    // this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.menuLoadingDiv = true;
    // 認証済の場合表示するユーザー情報を取得
    this.apiService.getUser(userid).subscribe(data => {
      if (data[0]) {
        const user = data[0];
        // this.loginUser.userId = data[0].userId;
        // this.loginUser.userName = data[0].userName;

        this.authUserService.login(this.loginUser);
        if (user.userName !== undefined && user.userName !== '') {
          this.temporaryUserDiv = true;
        } else {
          // 仮登録ユーザーのためユーザー登録メッセージを表示
          this.temporaryUserDiv = false;
        }

        if (user.mechanicId && user.mechanicId !== '0') {
          this.mechanicDiv = true;
        }
        if (user.officeId && user.officeId !== '0') {
          this.officeDiv = true;
        }
      } else {
        this.loginUser.userName = 'ユーザー情報未設定'
      }
      // 処理完了にてローディング解除
      this.menuLoadingDiv = false;
      // this.overlayRef.detach();
      // this.onmenu();
    });
  }




  /**
   * ユーザー認証(ログイン)を行う
   */
  onLogin() {
    const dialogRef = this.loginModal.open(LoginComponent, {
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
   * ログアウト押下時
   */
  onLogout() {
    this.authUserDiv = false;
    this.cognito.logout();
    this.authUserService.logout;
    this.loginUser.userName = 'ログイン';
    this.authenticated();
  }


}
