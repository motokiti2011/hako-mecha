import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { fcmcSerchResult, fcmcSerchData, initSerchData } from 'src/app/entity/fcmcSerchResult';
import {
  filter as _filter,
  find as _find,
  union as _union,
  pull as _pull
} from 'lodash';
import { officeInfo, connectionOfficeInfo, connectionMechanicInfo, adminSettingInfo } from 'src/app/entity/officeInfo';
import { roleData, role } from 'src/app/entity/role';
import { belongsData, belongs } from 'src/app/entity/belongs';
import { ApiSerchService } from '../../service/api-serch.service';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

/**
 * 工場管理者設定モーダル
 */
@Component({
  selector: 'app-factory-admin-setting-modal',
  templateUrl: './factory-admin-setting-modal.component.html',
  styleUrls: ['./factory-admin-setting-modal.component.scss']
})
export class FactoryAdminSettingModalComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<FactoryAdminSettingModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: officeInfo,
    private apiService: ApiSerchService,
    public modal: MatDialog,
    private overlay: Overlay,
  ) { }

  /** タイトル */
  title = '工場管理者設定';
  /** 表示データ */
  dispAdminData: adminSettingInfo[] = [];
  /** 所属メカニック情報 */
  connectionMechanic: connectionMechanicInfo[] = [];
  /** 一覧表示切替区分 */
  listDispSwitchDiv = false;
  /** 追加メカニック情報 */
  addMechanicInfo: connectionMechanicInfo[] = [];
  /** 決定区分 */
  resultDiv = true;
  /** 役割セレクトデータ */
  roleSelectData = roleData;
  /** 所属セレクトデータ */
  belongsSelectData = belongsData;

  /** ローディングオーバーレイ */
  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  ngOnInit(): void {
    // 管理者表示情報に管理者情報を設定
    this.dispAdminData = this.data.adminSettingInfo;
    // 所属メカニック情報から管理者登録情報を除いたものを設定
    const connectionMc = this.data.connectionMechanicInfo
    if (!connectionMc) {
      return;
    }
    connectionMc.forEach(mc => {
      if (_find(this.dispAdminData, data => data.mechanicId != mc.mechanicId)) {
        this.connectionMechanic.push(mc);
      }
    });
  }


  /**
   * メカニック表示非表示を切り替える
   */
  onSwitchListDiv() {
    console.log(this.listDispSwitchDiv);
  }


  /**
   * 決定する押下イベント
   */
  onResult() {
    if (this.adminDataCheck()) {
      this.openMsgDialog(messageDialogMsg.BelongsAndRoleSettingReq, false);
      return;
    }
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    let updateData = this.data;
    updateData.adminSettingInfo = this.dispAdminData;
    this.apiService.postOffice(updateData).subscribe(result => {
      if(result) {
        console.log(result);
      }
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });

  }

  /**
   * メカニック選択
   * @param serchData
   */
  onSelectMechanic(data: connectionMechanicInfo) {
    // とりあえず追加する
    this.addMechanicInfo.push(data)
  }


  /**
   * メカニック追加イベント
   */
  onAddMechanic() {
    const addData = _union(this.addMechanicInfo)
    addData.forEach(ad => {
      const addData: adminSettingInfo = {
        mechanicId: ad.mechanicId,
        mechanicName: ad.mechanicName,
        belongsDiv: '',
        belongs: '',
        role: '',
        roleDiv: ''
      }
      // 管理者データに追加
      this.dispAdminData.push(addData);
      // 所属メカニック情報から追加したデータを削除
      _pull(this.connectionMechanic, ad);
    });
    // 追加後選択データをクリア
    this.addMechanicInfo = [];
  }

  /**
   * ロール選択イベント
   */
  selectRole() {
    this.resultDiv = this.adminDataCheck();
  }

  /**
   * 所属選択イベント
   */
  selectBelongs() {
    this.resultDiv = this.adminDataCheck();
  }


  /**
   * 閉じる押下時イベント
   */
  closeModal() {
    this._dialogRef.close();
  }


  /************ 以下内部処理 *****************************/

  /**
   * 管理者データチェック
   */
  private adminDataCheck(): boolean {
    let checkDiv = false;
    this.dispAdminData.forEach(data => {
      if (data.belongsDiv == '' || data.roleDiv == '') {
        checkDiv = true;
      }
    });
    if (checkDiv) {
      return checkDiv;
    }
    return false;
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
        // this.router.navigate(["/main_menu"]);
      }
      console.log(result);
      // // ローディング解除
      // this.overlayRef.detach();
      return;
    });
}



}
