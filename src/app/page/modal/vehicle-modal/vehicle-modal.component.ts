import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userVehicle } from 'src/app/entity/userVehicle';
import { slipVehicle, initSlipVehicle } from 'src/app/entity/slipVehicle';
import {
  makerInfo,
  domesticVehicleMakerData,
  abroadBikeMakerData,
  domesticBikeMakerData,
  abroadVehicleMakerData,
  vehicleFormData, bikeFormData
} from 'src/app/entity/vehicleDataInfo';


@Component({
  selector: 'app-vehicle-modal',
  templateUrl: './vehicle-modal.component.html',
  styleUrls: ['./vehicle-modal.component.scss']
})


export class VehicleModalComponent implements OnInit {

  /** タイトル */
  title = '車両選択'
  /** 登録車両 */
  registerVehicle: userVehicle[] = [];
  /** 選択車両 */
  selectVehicle?: userVehicle;
  /** 対象サービス分類 */
  targetService: string = '';
  /** 結果データ */
  resultData: slipVehicle = initSlipVehicle;
  /** ユーザー情報 */
  acsessId: string | null = null;
  /** 車両名 */
  dispVehicleName: string = '';
  /** 車両区分 */
  dispVehicleDiv: string = '0';
  /** 車両区分データ */
  vehicleDivData = [
    { vehicleDiv: '0', value: '車' },
    { vehicleDiv: '1', value: 'バイク' },
    { vehicleDiv: '2', value: 'その他車両' },
    { vehicleDiv: '99', value: 'その他' }
  ];
  /** メーカー */
  dispVehicleMaker: string = '';
  /** メーカーデータ */
  makerData: string[] = [];
  makerDataGroupData: { key: string, items: makerInfo[] }[] = [];
  /** 車両形状データ */
  formData: { name: string; }[] = [];
  /** 車両形状 */
  dispVehicleForm: string = '';


  /** 指定なし区分 */
  unspecifiedDiv = false;


  constructor(
    public _dialogRef: MatDialogRef<VehicleModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: vehicleModalInput
  ) { }

  ngOnInit(): void {
    this.targetService = this.data.targetService;
    console.log(this.data);

    // ユーザー依頼の場合
    if (this.data.targetService == '0') {
      this.acsessId = this.data.acsessId;
      if (this.data.targetVehicle.length != 0) {
        // 初期表示に登録車両情報を表示
        this.registerVehicle = this.data.targetVehicle;
      }
    } else {
      // ユーザー車両設定の場合
      this.unspecifiedDiv = this.data.unspecifiedDiv; 
      if(this.unspecifiedDiv) {
        this.dispVehicleDiv = '99';
      }
    }
    this.makerDataSetting();
    this.formDataSetting();
    if (this.data.settingVehicleInfo != null) {
      this.setFormData(this.data.settingVehicleInfo)
    }

  }


  /**
   * 車両区分選択イベント
   * @param i
   */
  onSelectVehicleDiv(i: number) {
    console.log(this.vehicleDivData[i]);
    console.log(this.dispVehicleDiv);
    this.makerDataSetting();
    this.formDataSetting();
  }

  /**
   * 登録車両選択イベント
   */
  onSelectUserVehicle() {
    if (this.selectVehicle) {
      this.setVehicleResultData(this.selectVehicle);
      const data = {
        resultData: this.resultData,
        targetService: this.targetService,
        unspecifiedDiv: this.unspecifiedDiv
      }
      this._dialogRef.close(this.resultData);
    }
  }

  /**
   * 決定ボタン押下イベント
   */
  getResult() {
    this.inputVehicleInfo();

    const data = {
      resultData: this.resultData,
      targetService: this.targetService,
      unspecifiedDiv: this.unspecifiedDiv
    }
    this._dialogRef.close(data);
  }

  /**
   * 指定なしチェック押下時
   */
  onUnspecified() {
    console.log(this.unspecifiedDiv);
    if(this.unspecifiedDiv) {
      this.dispVehicleName = '指定なし';
      this.dispVehicleDiv = '99';
    } else {
      // 指定なし解除時
      this.dispVehicleName = '';
      // とりあえず初期表示状態に戻す
      this.dispVehicleDiv = '0';
    }
  }



  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }

  /**
   * メーカーセレクト操作時
   */
  onSelectMaker() {
    console.log(this.dispVehicleMaker)

  }

  /**
   * 車両形状操作時
   */
  onSelectForm() {
    console.log(this.dispVehicleForm)
  }

  /**
   * 車両選択イベント
   */
  onSelectVehicle(vehicle: userVehicle) {
    this.dispVehicleName = vehicle.vehicleName;
    if(vehicle.vehicleDiv != null && vehicle.vehicleDiv != undefined && vehicle.vehicleDiv != '') {
      this.dispVehicleDiv = vehicle.vehicleDiv;
    }
    if(vehicle.maker != null) {
      this.dispVehicleMaker = vehicle.maker;
    }
    if(vehicle.form != null) {
      this.dispVehicleForm = vehicle.form;
    }
  }



  /************************************** 内部処理 ************************************/

  /**
   * 選択された車両情報を格納する
   */
  private setVehicleResultData(vehicleInfo: userVehicle) {
    // 車両名、分類、車両区分,カラーのみ伝票情報に格納
    this.resultData.vehicleName = vehicleInfo.vehicleName;
    // 分類番号　ユーザー依頼（車両あり）
    this.resultData.slipVehicleClassDiv = '0';
    this.resultData.vehicleDiv = vehicleInfo.vehicleDiv;
    this.resultData.coler = vehicleInfo.coler;
  }

  /**
   * 入力された車両情報を返却データに格納する
   */
  private inputVehicleInfo() {
    // 名称,車両区分,メーカー,車両形状を入力
    this.resultData.vehicleName = this.dispVehicleName;
    this.resultData.vehicleDiv = this.dispVehicleDiv;
    this.resultData.vehicleMaker = this.dispVehicleMaker;
    this.resultData.vehicleForm = this.dispVehicleForm;
  }

  /**
   * メーカーセレクトデータの設定
   */
  private makerDataSetting() {
    // 初期化
    this.makerDataGroupData = [];
    let domesticData: makerInfo[] = [];
    let abroadData: makerInfo[] = [];
    if (this.dispVehicleDiv == '0') {
      // 自動車の場合
      domesticData = domesticVehicleMakerData;
      abroadData = abroadVehicleMakerData;
      // 工場、メカニック依頼時
      if (this.data.targetService != '0') {
        domesticData.push({ id: '000', name: '指定なし' });
        abroadData.push({ id: '000', name: '指定なし' });
      }
      this.makerDataGroupData.push({ key: '国内メーカー', items: domesticData })
      this.makerDataGroupData.push({ key: '外国メーカー', items: abroadData })
      console.log(this.makerDataGroupData);
    } else if (this.dispVehicleDiv == '1') {
      // バイク指定の場合
      domesticData = domesticBikeMakerData;
      abroadData = abroadBikeMakerData;
      // 工場、メカニック依頼時
      if (this.data.targetService != '0') {
        domesticData.push({ id: '000', name: '指定なし' });
        abroadData.push({ id: '000', name: '指定なし' });
      }
      this.makerDataGroupData.push({ key: '国内メーカー', items: domesticData });
      this.makerDataGroupData.push({ key: '外国メーカー', items: abroadData });
    } else {
      this.makerData = [];
    }
  }

  /**
   * 車両形状セレクトデータの設定
   */
  private formDataSetting() {
    // 初期化
    this.formData = [];
    if (this.dispVehicleDiv == '0') {
      this.formData = vehicleFormData;
    } else if (this.dispVehicleDiv == '1') {
      this.formData = bikeFormData;
    }

  }

  /**
   * 画面表示に現在設定されているデータを設定する
   * @param settingVehicleInfo 
   */
  private setFormData(settingVehicleInfo: slipVehicle) {
    this.unspecifiedDiv = this.data.unspecifiedDiv;
    const name = settingVehicleInfo.vehicleName;
    const vehicleDiv = settingVehicleInfo.vehicleDiv;
    const form = settingVehicleInfo.vehicleForm;
    const maker = settingVehicleInfo.vehicleMaker;
    this.dispVehicleName = name;
    if(vehicleDiv != null && vehicleDiv != undefined && vehicleDiv != '') {
      this.dispVehicleDiv = vehicleDiv;
    }
    if(maker != null) {
      this.dispVehicleMaker = maker;
    }
    if(form != null) {
      this.dispVehicleForm = form;
    }
  }



}




/** モーダルインプットデータ */
export interface vehicleModalInput {
  targetVehicle: userVehicle[],
  targetService: string,
  acsessId: string | null,
  settingVehicleInfo: slipVehicle | null,
  unspecifiedDiv: boolean
}




