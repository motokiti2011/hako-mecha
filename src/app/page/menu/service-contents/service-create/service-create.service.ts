import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { nextActionButtonType } from 'src/app/entity/nextActionButtonType';
import { serviceContents } from 'src/app/entity/serviceContents';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { salesServiceInfo } from 'src/app/entity/salesServiceInfo';

import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { UploadService } from 'src/app/page/service/upload.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceCreateService {

  constructor(
    private apiUniqueService: ApiUniqueService,
    private s3: UploadService,
    private apiGsiService: ApiGsiSerchService,
  ) { }

  // 伝票情報を更新する
  public postSlip(contents: serviceContents): Observable<number> {

    const data = this.converSlipDetail(contents)
    return this.apiUniqueService.initPostSlip(data);
  }

  /**
   * 車両情報を取得する
   */
  public getVehicleList(id: string) {
    return this.apiGsiService.serchVehicle(id, '0');
  }

  /**
   * 販売サービス情報を更新する
   * @param contents
   * @returns
   */
  public postSalesService(contents: serviceContents): Observable<number> {
    const data = this.converSalesService(contents);
    return this.apiUniqueService.initPostSalesService(data);
  }

  /**
   * 伝票情報の更新情報を作成する
   * @param content
   * @returns
   */
  public converSlipDetail(content: serviceContents): slipDetailInfo {

    const imageData = this.imageSetting(content.imageUrlList);

    let vehicleName = '';
    let vehicleDiv = '';
    let vehicleInfo = null;
    if(content.targetVehcle) {
      vehicleName = content.targetVehcle.vehicleName
      vehicleDiv = content.targetVehcle.vehicleDiv;
      vehicleInfo = content.targetVehcle;
    }

    const result: slipDetailInfo = {
      // 伝票番号
      slipNo: '0',
      // 削除区分
      deleteDiv: '0',
      // サービスカテゴリー
      category: String(content.category),
      // 伝票管理者ユーザーID
      slipAdminUserId: content.userId,
      // 伝票管理者ユーザー名
      slipAdminUserName: '',
      // 管理者区分
      adminDiv: '0',
      // タイトル
      title: content.title,
      // サービス地域1
      areaNo1: String(content.area1),
      // サービス地域2
      areaNo2: content.area2,
      // 価格
      price: content.price,
      // 入札方式
      bidMethod: String(content.bidMethod),
      // 入札者ID
      bidderId: '0',
      // 入札終了日
      bidEndDate: content.preferredTime,
      // 説明
      explanation: content.explanation,
      // 表示区分
      displayDiv: '0',
      // 工程ステータス
      processStatus: '0',
      // 対象サービス内容
      serviceType: content.serviceType,
      // 対象車両ID
      targetVehicleId: '',
      // 対象車両名
      targetVehicleName: vehicleName ,
      // 対象車両区分
      targetVehicleDiv: vehicleDiv,
      // 対象車両情報
      targetVehicleInfo: vehicleInfo,
      // 作業場所情報
      workAreaInfo: content.workArea,
      // 希望日
      preferredDate: content.preferredDate,
      // 希望時間
      preferredTime: String(content.preferredTime),
      // 完了日
      completionDate: content.preferredDate,
      // 取引完了日
      transactionCompletionDate: 0,
      // サムネイルURL
      thumbnailUrl: imageData.samneil,
      // 画像URLリスト
      imageUrlList: imageData.urlList,
      // メッセージ公開レベル
      messageOpenLebel: content.msgLv,
      // 更新ユーザーID
      updateUserId: '0',
      // 登録年月日
      created: '0',
      // 更新日時
      updated: '0'
    }
    return result;
  }



  /**
   * 販売サービス情報の更新情報を作成する
   * @param content
   * @returns
   */
  public converSalesService(content: serviceContents): salesServiceInfo {

    const imageData = this.imageSetting(content.imageUrlList);

    let vehicleName = '';
    let vehicleDiv = '';
    let vehicleInfo = null;
    if(content.targetVehcle) {
      vehicleName = content.targetVehcle.vehicleName
      vehicleDiv = content.targetVehcle.vehicleDiv;
      vehicleInfo = content.targetVehcle;
    }

    const result: salesServiceInfo = {
      // 伝票番号
      slipNo: '0',
      // 削除区分
      deleteDiv: '0',
      // サービスカテゴリー
      category: String(content.category),
      // 伝票管理者ユーザーID
      slipAdminUserId: content.userId,
      // 伝票管理者ユーザー名
      slipAdminUserName: content.userName,
      // メカニックID
      slipAdminMechanicId: content.mechanicId,
      // メカニック名
      slipAdminMechanicName:  '',
      // 工場ID
      slipAdminOfficeId: content.officeId,
      // 工場名
      slipAdminOfficeName:  '',
      // 管理者区分
      adminDiv: content.serviceType,
      // タイトル
      title: content.title,
      // サービス地域1
      areaNo1: content.area1,
      // サービス地域2
      areaNo2: content.area2,
      // 価格
      price: content.price,
      // 入札方式
      bidMethod: String(content.bidMethod),
      // 入札者ID
      bidderId: '0',
      // 入札終了日
      bidEndDate: content.preferredTime,
      // 説明
      explanation: content.explanation,
      // 表示区分
      displayDiv: '0',
      // 工程ステータス
      processStatus: '0',
      // 対象サービス内容
      serviceType: content.serviceType,
      // 対象車両ID
      targetVehicleId: '',
      // 対象車両名
      targetVehicleName: vehicleName,
      // 対象車両区分
      targetVehicleDiv: vehicleDiv,
      // 対象車両情報
      targetVehicleInfo: vehicleInfo,
      // 作業場所情報
      workAreaInfo: content.workArea,
      // 希望日
      preferredDate: content.preferredDate,
      // 希望時間
      preferredTime: String(content.preferredTime),
      // 完了日
      completionDate: content.preferredDate,
      // 取引完了日
      transactionCompletionDate: 0,
      // サムネイルURL
      thumbnailUrl: imageData.samneil,
      // 画像URLリスト
      imageUrlList: imageData.urlList,
      // メッセージ公開レベル
      messageOpenLebel: content.msgLv,
      // 更新ユーザーID
      updateUserId: '0',
      // 登録年月日
      created: '0',
      // 更新日時
      updated: '0'
    }
    return result;
  }

  /**
   * 画像アップロードを行う
   * @param imgList
   */
  public imgUpload(imgList: any) {
    let uploadUrl = '';
    let uploadResult = '';
    if (imgList) {
      this.s3.onManagedUpload(imgList).then((data) => {
        if (data) {
          uploadUrl = data.Location;
          uploadResult = 'アップロードが完了しました。';
        }
      }).catch((err) => {
        uploadResult = 'アップロードが失敗しました。';
      });
      } else {
        uploadResult = 'ファイルが選択されていません。';
      }
  }

  /**
   * 画像情報を設定する
   * @param imageList
   * @returns
   */
  private imageSetting(imageList: string[]| null): {samneil:string, urlList:string[]} {
    // 画像情報を設定する
    let samneil = '';
    let urlList: string[] = [];
    if(imageList != null) {
      if(imageList.length == 1) {
        samneil = imageList[0];
      } else {
        let count = 0;
        imageList.forEach(img => {
          if(count == 0) {
            samneil = img;
          } else {
            urlList?.push(img);
          }
          count++
        });
      }
    }
    return {samneil: samneil, urlList: urlList}
  }



  /**
   * 画像アップロードを行う
   * @param imgList
   */
  public protoImgUpload(imgList: any): Promise<AWS.S3.ManagedUpload.SendData> {
    return this.s3.onManagedUpload(imgList);
  }


  /**
   * 遷移ルートを返却する
   * @param next
   * @returns
   */
  public nextNav(next: string): string {
    let nextLinc = '';
    if (next == nextActionButtonType.TOP) {
      nextLinc = 'main_menu';
    } else if (next == nextActionButtonType.MYMENU) {
      nextLinc = 'transaction_menu';
    } else if (next == nextActionButtonType.SERVICECREATE) {
      nextLinc = '99';
    } else if (next == nextActionButtonType.SERVICEDETAEL) {
      nextLinc = 'main_menu';
    }
    return nextLinc;
  }




}
