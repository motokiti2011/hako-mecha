import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { cityData } from 'src/app/entity/area1SelectArea2';
import { fcmcSerchResult, fcmcSerchData, initSerchData } from 'src/app/entity/fcmcSerchResult';
import { officeAssociation, officeAssociationData } from 'src/app/entity/officeAssociation';

import {
  filter as _filter,
  find as _find,
} from 'lodash';
import { officeInfo, connectionOfficeInfo } from 'src/app/entity/officeInfo';
import { ApiSerchService } from '../../service/api-serch.service';
import { ApiGsiSerchService } from '../../service/api-gsi-serch.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

/**
 * 関連工場コンポーネント
 */
@Component({
  selector: 'app-connection-factory-modal',
  templateUrl: './connection-factory-modal.component.html',
  styleUrls: ['./connection-factory-modal.component.scss']
})
export class ConnectionFactoryModalComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<ConnectionFactoryModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: officeInfo,
    private builder: FormBuilder,
    private gsiService: ApiGsiSerchService,
    private uniqueService: ApiUniqueService,
    private overlay: Overlay,
    private apiService: ApiSerchService,
  ) { }

  /** タイトル */
  title = '関連工場情報';
  /** 検索条件 */
  serchInfo: fcmcSerchData = initSerchData;
  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  /** 地域情報選択状態初期値 */
  areaSelect = ''
  /** 地域２（市町村）データ */
  areaCityData: cityData[] = []
  /** 地域２（市町村）選択 */
  citySelect = '';
  /** 表示情報リスト */
  dispData: connectionOfficeInfo[] = [];
  /** 検索結果 */
  serchResult: fcmcSerchResult[] = [];
  /** 検索結果選択中データ */
  selectData?: fcmcSerchResult;
  /** 検索切替フラグ */
  serchAreaSwitchDiv = true;
  /** 事業所関係性セレクトデータ */
  officeAssociationData: officeAssociation[] = officeAssociationData;
  /** 事業所関係性セレクト */
  officeAssociationSelect = '';
  /** 更新区分 */
  updateDiv = false;
  // 地域１
  formArea1 = new FormControl('', [
    Validators.required,
  ]);
  // 地域２
  formArea2 = new FormControl('', [
    Validators.required,
  ]);

  // 電話番号
  telNo = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
  ]);

  requiredForm = this.builder.group({
    formArea1: this.formArea1,
    formArea2: this.formArea2,
    telNo: this.telNo,
  });

  /** ローディングオーバーレイ */
  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;


  ngOnInit(): void {
    // 現在登録中の関連工場情報を設定
    if (this.data.connectionOfficeInfo) {
      this.dispData = this.data.connectionOfficeInfo;
    }
  }

  /**
   * 地域選択イベント
   */
  onSelectArea() {
    this.serchInfo.area1 = this.areaSelect;
    this.formArea1.setValue(this.areaSelect);
    // 地域2選択中のものをクリア
    if (this.citySelect != '') {
      this.citySelect = '';
      this.formArea2.setValue(this.citySelect);
    }
    console.log(this.areaSelect)
    this.getCityInfo();
  }

  /**
   * 地域2選択イベント
   */
  onSelectCity() {
    this.serchInfo.area2 = this.citySelect;
    this.formArea2.setValue(this.citySelect);
    console.log(this.serchInfo.area2);
  }

  /**
   * 検索ボタン押下イベント
   */
  onSerch() {
    console.log(this.serchAreaSwitchDiv);
    // console.log(this.serchInfo);
  }

  /**
   * 工場関係性編集イベント
   */
  selectAssociation() {

  }

  /**
   * 決定する
   */
  onSerchResult() {
    if (!this.selectData) {
      return;
    }
    // 対象工場を参照モーダルで展開する

  }


  /**
   * 検索対象選択
   * @param office
   */
  onSerchOffice(office: fcmcSerchResult) {
    console.log(office);
    if (office) {
      this.selectData = office;
    } else {
      this.selectData = undefined;
    }
  }

  /**
   * 工場選択イベント
   * @param office
   */
  onSelectOffice(office: connectionOfficeInfo) {
    console.log(office);
  }


  /**
   * 関連工場ステータス変更イベント
   * @param connectionOffice
   */
  onStatusEdit(connectionOffice: connectionOfficeInfo) {
    // this.statusEditConnection(connectionOffice).subscribe(data => {
    //   this.updateDiv = true;
    //   // 更新結果を最新化したデータとして返却データにセット
    //   this.data.connectionMechanicInfo =
    // })
  }


  /**
   * 決定ボタン押下イベント
   */
  onResister() {
    // this.statusEditConnection(connectionOffice).subscribe(data => {
    //   this.updateDiv = true;
    //   // 更新結果を最新化したデータとして返却データにセット
    //   this.data.connectionMechanicInfo =
    // })
  }



  /**
   * 閉じる押下時イベント
   */
  closeModal() {
    this._dialogRef.close();
  }


  /************** 内部処理 ****************/

  /**
   * 工場情報検索
   * @param serchInfo
   */
  private serchFcMcInfo(): Observable<fcmcSerchResult[]> {
    this.serchInfo.telNo = this.telNo.value;
    return this.uniqueService.serchFcMcInfo(this.serchInfo, '2');
  }


  /**
   * 関連工場ステータス編集を行う
   */
  private statusEditConnection(connectionOffice: connectionOfficeInfo[]): Observable<connectionOfficeInfo> {
    return this.uniqueService.editConnectionOfficeStatus(this.data.officeId, connectionOffice);
  }

  /**
   * 都道府県から市町村データを取得し設定する
   */
  private getCityInfo() {
    const areaa = _find(this.areaData, data => data.code === this.areaSelect);
    console.log(areaa)
    if (areaa) {
      this.apiService.serchArea(areaa.prefectures)
        .subscribe(data => {
          // console.log(data);
          // console.log(data.response);
          console.log(data.response.location);
          if (data.response.location.length > 0) {
            this.areaCityData = data.response.location;
          }
        });
    }
  }



}
