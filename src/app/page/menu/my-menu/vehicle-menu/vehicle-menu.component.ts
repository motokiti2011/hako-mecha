import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { user, initUserInfo } from 'src/app/entity/user';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { userVehicle } from 'src/app/entity/userVehicle';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MessageSelectDaialogComponent } from 'src/app/page/modal/message-select-daialog/message-select-daialog.component';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';

@Component({
  selector: 'app-vehicle-menu',
  templateUrl: './vehicle-menu.component.html',
  styleUrls: ['./vehicle-menu.component.scss']
})
export class VehicleMenuComponent implements OnInit {

  /** ユーザー情報　*/
  user: user = initUserInfo;
  /** 車両リスト　*/
  vehicleList: userVehicle[] = [];

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private cognito: CognitoService,
    private apiService: ApiSerchService,
    private apiGsiService: ApiGsiSerchService,
    private router: Router,
    public modal: MatDialog,
    private overlay: Overlay,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        if (user.length > 0) {
          console.log(user);
          this.user = user[0];
          this.user.userId = authUser;
          this.getVehicleList();
        } else {
          this.apiAuth.authenticationExpired();
          // ローディング解除
          this.overlayRef.detach();
          this.openMsgDialog(messageDialogMsg.LoginRequest, true);
        }
      });
    } else {
      this.apiAuth.authenticationExpired();
      // ローディング解除
      this.overlayRef.detach();
      this.openMsgDialog(messageDialogMsg.LoginRequest, true);
    }
  }

  /**
  * ご登録の車両情報はこちらボタン押下イベント
  */
  onVehcleInfo() {
    this.router.navigate(["/vehicle-register"]);
    console.log('vehicle-register')
  }

  /**
   * 車両選択イベント
   * @param id
   */
  onVehicleSelect(id: string) {
    console.log(id);
    // 選択されたIDをキーに車両詳細画面に遷移する
    this.router.navigate(["edit-vehicle"],
      {
        queryParams: { vehicleId: id }
      });
  }


  /**
   * 履歴ボタン押下イベント
   * @param id
   */
  onHistory(id: string) {
    // 車両履歴モーダルを展開
  }

  /**
   * 削除ボタン押下イベント
   * @param id
   */
  onDeleteVehicle(id: string) {
    // 削除前にダイアログ表示
    this.vheicleDeleteSelect(messageDialogMsg.ToDelete, id);

  }

  /****************** 以下内部処理 *************************/
  /**
   * 車両情報を取得する
   */
  private getVehicleList() {
    this.apiGsiService.serchVehicle(this.user.userId, '0').subscribe(result => {
      if (result) {
        this.vehicleList = result;
        this.setDispData();
      }
      // ローディング解除
      this.loading = false;
      this.overlayRef.detach();
    });
  }

  /**
   * 取得した車両情報を表示用に整える
   */
  private setDispData() {
    this.vehicleList.forEach(vehicle => {
      // ナンバー表示変更
      vehicle.vehicleNo = vehicle.vehicleNoAreaName + ' ' + vehicle.vehicleNoClassificationNum
        + ' ' + vehicle.vehicleNoKana + ' ' + vehicle.vehicleNoSerialNum;
      vehicle.inspectionExpirationDate = this.setInspectionData(vehicle.inspectionExpirationDate);
    });
  }


  /**
   * 車検満了日と現在の日付から表示内容を設定する。
   * @param date
   * @returns
   */
  private setInspectionData(date: string): string {
    let result = '未設定です。'
    if (date) {
      return date;
    }
    return result;
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
      this.loading = false;
      this.overlayRef.detach();
      if (locationDiv) {
        this.router.navigate(["/main_menu"]);
      } else {
        // データ再取得
        this.getVehicleList();
      }
      console.log(result);
      return;
    });
  }

  /**
   * 車両削除のダイアログ表示
   * @param msg
   * @param id
   */
  private vheicleDeleteSelect(msg: string, id: string) {
    // ダイアログ表示（ログインしてください）し前画面へ戻る
    const dialogData: messageDialogData = {
      massage: msg,
      closeFlg: false,
      closeTime: 0,
      btnDispDiv: true
    }
    const dialogRef = this.modal.open(MessageSelectDaialogComponent, {
      width: '300px',
      height: '150px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vheicleDelete(id);
      }
      this.overlayRef.detach();
      return;
    });
  }

  /**
   * 車両情報削除
   * @param id
   */
  private vheicleDelete(id: string) {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.apiService.deleteUserVehicle(id, this.user.userId).subscribe(result => {
      console.log(result);
      if (result === 200) {
        this.openMsgDialog(messageDialogMsg.DeleteSucsess, false);
      } else {
        this.openMsgDialog(messageDialogMsg.ProblemOperation, false);
      }
    })
  }
}
