import { Injectable } from '@angular/core';
import { Observable, pipe, map, mergeMap, of} from 'rxjs';
import { salesServiceInfo } from 'src/app/entity/salesServiceInfo';
import { userFavorite } from 'src/app/entity/userFavorite';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { ApiCheckService } from 'src/app/page/service/api-check.service';
import { ApiSlipProsessService } from 'src/app/page/service/api-slip-prosess.service';
import { image } from 'src/app/entity/image';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import {
  find as _find,
} from 'lodash';
import { userWorkArea, mechanicWorkArea } from '../service-create/service-create-option';
import { slipRelation } from 'src/app/entity/slipRelation';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';
import { monthMap } from 'src/app/entity/month';


@Injectable({
  providedIn: 'root'
})
export class ServiceDetailService {

  constructor(
    private apiService: ApiSerchService,
    private apiUniqueService: ApiUniqueService,
    private apiCheckService: ApiCheckService,
    private apiSlipService: ApiSlipProsessService,
    private apiGsiService: ApiGsiSerchService,
  ) { }

  /**
   * 詳細表示する伝票情報を取得する
   * @param slipNo
   * @returns
   */
  public getService(slipNo: string, serviceType: string): Observable<any> {
    if (serviceType !== '0') {
      return this.apiUniqueService.getServiceContents(slipNo);
    }
    return this.apiUniqueService.getSlip(slipNo);
  }

  /**
   * 画像に番号を振り、表示用リストに格納する。
   * @param thumbnailUrl
   * @param imageList
   * @returns
   */
  public setImages(thumbnailUrl: string, imageList: string[]): image[] {

    let resultList: image[] = [];
    // サムネイル画像が存在しない場合画像はなし
    if (thumbnailUrl == '' || thumbnailUrl == null) {
      const noImage: image = {
        imageNo: '', src: 'assets/images/noimage.png'
      }
      resultList.push(noImage);
      return resultList;
    } else {
      const item: image = {
        imageNo: String(0), src: thumbnailUrl
      }
      resultList.push(item);
    }

    if (imageList.length == 0) {
      const noImage: image = {
        imageNo: '', src: 'assets/images/noimage.png'
      }
      resultList.push(noImage)
    }
    let count = 0;
    imageList.forEach(image => {
      const item: image = {
        imageNo: String(count), src: image
      }
      resultList.push(item);
      count++;
    });
    return resultList;
  }




  /**
   * お気に入り情報を追加する
   * @param service
   * @param userId
   * @returns
   */
  public addFavorite(service: salesServiceInfo, userId: string): Observable<any> {
    const favorite: userFavorite = {
      id: '', // ID
      userId: userId, // ユーザーID
      slipNo: service.slipNo, // 伝票番号
      title: service.title, // タイトル
      price: service.price, // 価格
      whet: '', // 期間
      serviceType: service.serviceType, // サービスタイプ
      endDate: service.completionDate, // 終了日
      imageUrl: service.thumbnailUrl, // 画像url
      created: '',// 作成日時
      updated: '',      // 更新日時
    }
    return this.apiService.postFavorite(favorite);
  }

  /**
   * サービス情報の日付データから画面表示用に加工する。
   * @param ymd
   */
  public setDispYMD(ymd: string): Date {
    // 年月日を取得
    console.log(ymd);
    const ymdst = String(ymd);
    const year = ymdst.slice(0, 4)
    const month = ymdst.slice(5, 6)
    const day = ymdst.slice(7, 9)
    console.log('year:' + year)
    console.log('month:' + month)
    console.log('day:' + day)
    return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0); // 2022年5月5日6時35分20.333秒を設定


    return new Date(2022, 5 - 1, 5, 6, 35, 20, 333); // 2022年5月5日6時35分20.333秒を設定
  }

  /**
   * サービス情報の日付データから画面表示用に加工する。
   * @param ymd
   */
  public setDispYMDSt(ymd: number): string {
    // 年月日を取得
    console.log(ymd);

    const ymdst = String(ymd);
    const stYear = ymdst.slice(0, 4)
    const stMonth = ymdst.slice(5, 6)
    const stDay = ymdst.slice(6, 9)
    console.log('year:' + stYear)
    console.log('month:' + stMonth)
    console.log('day:' + stDay)
    // 月、日付は先頭0の場合があるので一旦数値型に戻す
    const month = Number(stMonth);
    const day = Number(stDay);

    return stYear + '年' + String(month) + '月' + String(day) + '日'


    // return new Date(2022, 5 - 1, 5, 6, 35, 20, 333); // 2022年5月5日6時35分20.333秒を設定
  }

  /**
   * 表示用地域情報を設定する
   * @param areaNo1
   * @param areaNo2
   */
  public setDispArea(areaNo1: string, areaNo2: string | null): string {
    const area1Data = _find(prefecturesCoordinateData, data => data.code == areaNo1);
    if (area1Data) {

      return area1Data.prefectures + ' ' + areaNo2;
    }
    return '';
  }

  /**
   * 作業場所情報を設定する
   * @param workAreaInfo
   * @param serviceType
   */
  public setDispWorkArea(workAreaInfo: string, serviceType: string): string {
    let result = '';
    if (serviceType == '0') {
      const workArea = _find(userWorkArea, data => data.id == workAreaInfo);
      if (workArea) {
        result = workArea.viewDisp;
      }
    } else {
      const workArea = _find(mechanicWorkArea, data => data.id == workAreaInfo);
      if (workArea) {
        result = workArea.viewDisp;
      }
    }
    return result;
  }



  /**
   * アクセスユーザーが伝票管理者かをチェックする
   * @param accessId
   */
  public acsessUserAdminCheck(adminId: string, serviceType: string, accessId: string): Observable<any> {
    return this.apiCheckService.checkAcceseAdmin(adminId, serviceType, accessId);
  }

  /**
   * アクセスユーザーと伝票の関係性をチェックする
   */
  public accessUserAdminCheck(slipNo: string, accessUserId: string, serviceType: string): Observable<boolean> {
    return this.apiCheckService.checkAccessUserSlip(slipNo, accessUserId, serviceType)
  }

  /**
   * 取引依頼中ユーザーかを判定する
   * @param slipNo
   * @param requestUserId
   * @param serviceType
   * @returns
   */
  public transactionReqUserCheck(slipNo: string, requestUserId: string, serviceType: string): Observable<boolean> {
    return this.apiCheckService.checkTransactionReq(slipNo, requestUserId, serviceType);
  }

  /**
   * 取引中伝票情報に対してのアクセスチェックを行う
   * @param slipNo
   * @param serviceType
   * @param userId
   */
  public transactionCheck(slipNo: string, serviceType: string, userId: string): Observable<string> {
    // 管理者チェック
    return this.accessUserAdminCheck(slipNo, userId, serviceType).pipe(
      mergeMap((res: boolean) => {
        if (res) {
          // 伝票関係　管理者
          return slipRelation.ADMIN;
        } else {
          return this.transactionReqUserCheck(slipNo, userId, serviceType).pipe(
            map((res: boolean) => {
              if (res) {
                // 伝票関係　管理者
                return slipRelation.TRADER;
              } else {
                // いずれも該当なしの場合、関係なし
                return slipRelation.OTHERS;
              }
            })
          );
        }
      })
    )
  }

  /**
   * 取引開始依頼を行う
   * @param slipNo
   * @param serviceType
   * @param userId
   * @param serviceUserType
   * @returns
   */
  public transactionReq(slipNo: string, serviceType: string, userId: string, serviceUserType: string): Observable<any> {
    return this.apiSlipService.sendTransactionReq(slipNo, serviceType, userId, serviceUserType);
  }


  /**
   * アクセス者情報取得
   * @param userId
   */
  public getAccessUser(userId: string): Observable<any> {
    return this.apiService.getUser(userId);
  }

  /**
   * 取引依頼済かを確認する
   * @param slipNo
   * @param userId
   * @returns
   */
  public sentTranReqCheck(slipNo: string, userId: string): Observable<serviceTransactionRequest> {
    return this.apiCheckService.sentTranReqCheck(slipNo, userId);
  }

  /**
   * 取引依頼情報を取得する
   * @param slipNo
   * @param userId
   */
  public getTranRequest(slipNo: string): Observable<serviceTransactionRequest[]> {
    return this.apiGsiService.serchTransactionRequest(slipNo);
  }

  /**
   * 取引依頼を承認
   * @param request
   * @param userId
   * @returns
   */
  public approvalRequest(request:serviceTransactionRequest, userId: string, serviceType: string): Observable<number> {
    return this.apiSlipService.approvalTransaction(request, userId, serviceType);
  }

  /**
   * 完了日付を更新する
   * @param slipData
   * @param compDate
   * @param acceseUserId
   * @returns
   */
  compDateSetting(slipData: salesServiceInfo, compDate: any, acceseUserId: string):Observable<any> {
    const compDateNum = this.getDate(String(compDate))
    return this.apiSlipService.compDateSetting(slipData.slipNo, slipData.serviceType, compDateNum, acceseUserId)
  }

  /**
   * 取引を完了する
   * @param slipNo 
   * @param serviceType 
   * @param acceseUser 
   */
  public completedTransaction(slipNo: string, serviceType: string, acceseUser: string) :Observable<any> {
    return this.apiSlipService.compTransaction(slipNo, serviceType, acceseUser)
  }




  /**
   * 完了予定日のチェックを行う
   * @param inputDate
   * @returns
   */
  public completionDateCheck(inputDate: number): string {
    const today = this.getDate()
    if (inputDate == 0) {
      // 未設定の場合は設定必須
      return '完了予定日を設定する。';
    } else if (inputDate < today) {
      // 完了予定日を過ぎている場合
      return '完了日を過ぎています。\r 更新が必要です';
    } else if (inputDate == today) {
      // 完了予定日当日の場合
      return  '完了日となります。\r 変更はこちらから';
    } else {
      // いづれも該当しない場合
      return  '完了予定の変更はこちらから';
    }
  }

  /**
   * 入力された日付データのチェックを行う
   * @param inputDate
   */
  public checkInputDate(inputDate: String): string {
    if(!inputDate) {
      return '日付の入力が不正です。'
    }
    if(Number(inputDate) < this.getDate()) {
      return '日付は未来日を設定してください。'
    }
    return ''
  }


  /**
   * yymmdd形式の日付を取得
   * @returns
   */
  public getDate(inputDate?: string): number {
    let date = String(new Date())
    if(inputDate) {
      date = inputDate;
    }
    const dayStr = String(date);
    const day = dayStr.split(' ');
    const d = _find(monthMap, month => month.month === day[1]);
    // 今日の日付yyymmdd形式
    return Number(day[3] + d?.monthNum + day[2])
  }

  /**
   * yymmdd形式の日付をDate型に変換する
   * @param strDate
   */
  public dateFormat(numDate: number): Date {
    // 20230615
    const dateStr = String(numDate);
    const year = Number(dateStr.slice(0,4));
    const month = Number(dateStr.slice(4,6));
    const day = Number(dateStr.slice(6,8));
    console.log(year)
    console.log(month)
    console.log(day)

    return new Date(year, month - 1, day, 0, 0, 0, 0);

  }

}
