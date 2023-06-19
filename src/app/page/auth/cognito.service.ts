import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import { errorMsg } from 'src/app/entity/errorMsg';
import { MessageDialogComponent } from '../modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { MatDialog } from '@angular/material/dialog';
import { messageDialogMsg } from 'src/app/entity/msg';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  private userPool: CognitoUserPool;
  constructor(
    public modal: MatDialog,
  ) {
    AWS.config.region = environment.Auth.region;
    this.userPool = new CognitoUserPool({
      UserPoolId: environment.Auth.userPoolId,
      ClientId: environment.Auth.clientId,
    });
  }

  /**
   * ログイン
   * @param username
   * @param password
   * @returns
   */
  login(username: string, password: string): Promise<any> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool,
      Storage: localStorage
    });
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          // alert('ログインしました。');
          let msg = `Id token: ${result.getIdToken().getJwtToken()}\n`;
          msg += `Access token: ${result.getAccessToken().getJwtToken()}\n`;
          msg += `Refresh token: ${result.getRefreshToken().getToken()}`;
          resolve(msg);
        },
        onFailure: (err) => {
          this.openMsgDialog(messageDialogMsg.LoginFailure);
          reject(err);
        }
      });
    });
  }

  /**
   * 認証状態確認
   * @returns
   */
  isAuthenticated(): Promise<any> {
    const cognitoUser = this.userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      cognitoUser === null && resolve(cognitoUser);
      if (cognitoUser == null) {
        return;
      }
      cognitoUser.getSession((err: any, session: any) => {
        err ? reject(err) : (!session.isValid() ? reject(session) : resolve(session));
      });
    });
  }

  /**
   * 認証者情報を確認し取得できた場合その情報を取得する
   * @returns
   */
  initAuthenticated(): string | null {
    const cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser === null) {
      return null;
    }
    // ユーザー名を取得する
    return cognitoUser.getUsername();
  }

  /**
   * IDトークン取得
   * @returns
   */
  getCurrentUserIdToken(): any {
    const cognitoUser = this.userPool.getCurrentUser();
    let rslt = null;
    cognitoUser != null && cognitoUser.getSession((err: any, session: any) => {
      if (err) {
        alert(err);
      } else {
        rslt = session.getIdToken().getJwtToken();
      }
    });
    return rslt;
  }

  /**
   * パスワード変更
   * @param oldPasswd
   * @param newPasswd
   * @returns
   */
  changePassword(oldPasswd: string, newPasswd: string): any {
    const cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser == null) {
      return;
    }
    return new Promise<any>((resolve, err) => {
      cognitoUser.getSession(() => {
        cognitoUser.changePassword(oldPasswd, newPasswd, (error, result) => {
          resolve({ result, error });
        });
      });
    });
  }


  /**
   * パスワードリセット
   * @param email
   * @returns
   */
  forgotPassword(userId: string, email: string): any {
    const data = {
      UserPoolId: this.userPool.getUserPoolId,
      ClientId: this.userPool.getClientId
    }
    const cognitoUser = new CognitoUser({
      Username: userId,
      Pool: this.userPool,
      Storage: localStorage
    });
    cognitoUser.forgotPassword({
      onSuccess: function (result) {
        alert('Mail送信')
      },
      onFailure: function (err) {
        console.log(err)
      },
      inputVerificationCode() { }
    });
  }

  /**
   * パスワードリセット（確認コード、新パスワード設定）
   * @param verificationCode
   * @param newPassword
   */
  confirmPassword(userId: string, verificationCode: string, newPassword: string): any {

    const cognitoUser = new CognitoUser({
      Username: userId,
      Pool: this.userPool,
      Storage: localStorage
    });
    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onFailure: (err) => {
        console.log("onFailure:" + err);
      },
      onSuccess: (res) =>  {
        console.log("onSuccess:");
      },
    });
  }



  /**
   * ログアウト
   */
  logout() {
    const currentUser = this.userPool.getCurrentUser();
    currentUser && currentUser.signOut();
  }

  /**
   * 新規ユーザー登録
   * @param username
   * @param password
   * @param mail
   * @returns
   */
  signUp(username: string, password: string, mail: string): Promise<any> {
    const dataEmail = { Name: 'email', Value: mail };
    const attributeList: CognitoUserAttribute[] = [];
    const validationData: CognitoUserAttribute[] = [];
    attributeList.push(new CognitoUserAttribute(dataEmail));
    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, attributeList, validationData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * 確認コード入力
   * @param username
   * @param confirmation_code
   * @returns
   */
  confirmation(username: string, confirmation_code: string): Promise<any> {
    const userData = { Username: username, Pool: this.userPool };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmation_code, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getCredentials(): Promise<AWS.CognitoIdentityCredentials> {
    const cognitoUser = this.userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      if (cognitoUser === null) {
        reject(cognitoUser);
        return;
      }
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          reject(err);
        } else {
          const creds = this.buildCognitoCreds(session);
          AWS.config.credentials = creds;
          resolve(creds);
        }
      });
    });
  }

  buildCognitoCreds(session: any): AWS.CognitoIdentityCredentials {
    const logins: AWS.CognitoIdentity.LoginsMap = {};
    const url = `cognito-idp.${environment.Auth.region}.amazonaws.com/${environment.Auth.userPoolId}`;
    logins[url] = session.getIdToken().getJwtToken();
    return new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.Auth.identityPoolId,
      Logins: logins
    });
  }

  /**
   * メッセージダイアログ展開
   * @param msg
   * @param locationDiv
   */
  private openMsgDialog(msg: string) {
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
    dialogRef.afterClosed().subscribe(() => {
      return;
    });
  }



}
