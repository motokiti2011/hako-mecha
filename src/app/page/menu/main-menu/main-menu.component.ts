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
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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

  // 認証有無フラグ
  authUserDiv = false;

  // メカニック区分
  mechanicDiv = false;

  // 工場区分
  officeDiv = false;

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
    this.onmenu();
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
    this.router.navigate(["service_serchConditions_component"])
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
    console.log("マイページ")
    this.router.navigate(["my-menu-component"]);
  }

  /**
   * 新規登録ボタン押下時
   */
  onSinup() {
    this.router.navigate(["sign-up-component"]);
  }



  onmenu() {
    console.log('マイメニュー画面区分値チェック')
    console.log('authUserDiv:' + this.authUserDiv)
    console.log('temporaryUserDiv:' + this.temporaryUserDiv)
  }

  /*************** 内部処理  ************************/

  /**
   * ログイン状態確認
   */
  private authenticated() {
    console.log('main動く')
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
    // 認証済の場合表示するユーザー情報を取得
    this.apiService.getUser(userid).subscribe(data => {
      console.log(data[0]);
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

        if (user.mechanicId !== undefined && user.mechanicId !== '' && user.mechanicId !== null) {
          this.mechanicDiv = true;
        }
        if (user.officeId !== undefined && user.officeId !== '' && user.officeId !== null) {
          this.officeDiv = true;
        }
      } else {
        this.loginUser.userName = 'ユーザー情報未設定'
      }
      // // ローディング解除
      // this.overlayRef.detach();
      // this.onmenu();
    });
  }




  /**
   * ユーザー認証(ログイン)を行う
   */
  onLogin() {
    console.log('user-login');

    const dialogRef = this.loginModal.open(LoginComponent, {
      width: '400px',
      height: '450px',
      data: this.login
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
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
            console.log("newResister");
            this.router.navigate(["sign-up-component"])
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
