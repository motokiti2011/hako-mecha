import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { officeInfo, connectionMechanicInfo } from 'src/app/entity/officeInfo';
import { ApiSerchService } from '../../service/api-serch.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { userMyList, requestInfo } from 'src/app/entity/userMyList';
import { belongsData, belongs } from 'src/app/entity/belongs';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import {
  filter as _filter,
  find as _find,
  union as _union,
  pull as _pull
} from 'lodash';

/**
 * 関連メカニックコンポーネント
 */
@Component({
  selector: 'app-connection-mechanic-modal',
  templateUrl: './connection-mechanic-modal.component.html',
  styleUrls: ['./connection-mechanic-modal.component.scss']
})
export class ConnectionMechanicModalComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<ConnectionMechanicModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: officeInfo,
    private apiService: ApiSerchService,
    private uniqueService: ApiUniqueService,
    private overlay: Overlay,
  ) { }

  /** モーダルタイトル */
  title = '関連メカニック設定画面';
  /** 表示関連メカニックリスト */
  dispMechanicList: connectionMechanicInfo[] = [];
  /** 未許可メカニックリスト */
  unauthorizedMechanicList: requestInfo[] = [];
  /** 所属セレクトデータ */
  belongsSelectData = belongsData;
  /** 事業所名 */
  officeName = '';
  /** ローディングオーバーレイ */
  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;


  ngOnInit(): void {
    this.officeName = this.data.officeName;
    // 表示関連メカニックリストに現在の情報を格納
    if (this.data.connectionMechanicInfo) {
      this.dispMechanicList = this.data.connectionMechanicInfo;
    }
    // 申請中のメカニック情報を取得する
    this.getRequestMechanic();
  }

  /**
   * 紐づけ解消ボタン押下イベント
   */
  onLiftConnection(data: connectionMechanicInfo) {
    const result = _pull(this.dispMechanicList, data)
    this.data.connectionMechanicInfo = result;
    this.dispMechanicList = result;
  }

  /**
   * 紐づけ追加ボタン押下イベント
   * @param data
   */
  onAddConnection(data: requestInfo) {
    const addData: connectionMechanicInfo = {
      // メカニックID
      mechanicId: data.requestTargetId,
      // メカニック名
      mechanicName: data.requestTargetName,
      // 所属区分
      belongsDiv: null,
      // 所属
      belongs: null
    }
    // 所属メカニックに追加
    this.dispMechanicList.push(addData);
    // 申請中リストから削除
    _pull(this.unauthorizedMechanicList, data);
  }

  selectBelongs() {

  }

  /**
   * 決定ボタン押下イベント
   */
  onResult() {
    this.updateOfficeInfo(this.data);
  }


  /**
   * 閉じる押下時イベント
   */
  closeModal() {
    this._dialogRef.close();
  }




  /************** 以下内部処理 ***********************/

  /**
   * 申請中のリクエストメカニック情報を取得する
   */
  private getRequestMechanic() {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.uniqueService.getRequestMechanicInfo(this.data.officeId).subscribe(data => {
      if (data) {
        this.unauthorizedMechanicList = data;
      }
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }

  private updateOfficeInfo(officeData: officeInfo) {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.apiService.postOffice(officeData).subscribe(result => {
      if (result) {
        // 無事に更新できた場合データ更新
        this.data = officeData;
        if (this.data.connectionMechanicInfo) {
          this.dispMechanicList = this.data.connectionMechanicInfo;
        }
      }
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }


}
