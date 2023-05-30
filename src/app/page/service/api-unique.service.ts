import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { slipMegPrmUser } from 'src/app/entity/slipMegPrmUser';
import { mechanicInfo } from 'src/app/entity/mechanicInfo';
import { officeInfo } from 'src/app/entity/officeInfo';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { salesServiceInfo } from 'src/app/entity/salesServiceInfo';
import { serchInfo } from 'src/app/entity/serchInfo';
import { slipMessageInfo } from 'src/app/entity/slipMessageInfo';
import { slipQuestion } from 'src/app/entity/slipQuestion';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { mcfcItem } from 'src/app/entity/mcfcItem';
import { serviceAdminInfo } from 'src/app/entity/serviceAdminInfo';
import { completionSlip } from 'src/app/entity/completionSlip';
import { connectionOfficeInfo } from 'src/app/entity/officeInfo';
import { fcmcSerchResult, fcmcSerchData } from 'src/app/entity/fcmcSerchResult';
import { requestInfo } from 'src/app/entity/userMyList';
import { initPublicInfo } from 'src/app/entity/publicInfo';



@Injectable({
  providedIn: 'root'
})
export class ApiUniqueService {


  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  private apiEndPoint: string = environment.EndPoint.apiEmdPointUNIQUE + environment.EndPoint.apiVersion + '/unitoption';

  /**
   * 伝票メッセージ許可ユーザー情報にユーザーを追加する
   * @param user
   * @returns
   */
  public postMessageReq(userId: string, userName: string, slipNo: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "MESSAGEREQ",
      "Keys": {
        "slipNo": slipNo,
        "userId": userId,
        "userName": userName
      }
    };
    return this.http.post<slipMegPrmUser>(this.apiEndPoint + '/messageparmrequest', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: slipMegPrmUser) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * メカニック情報を登録する
   * @param mechanic メカニック情報
   * @param officeDiv 工業区分
   * @returns
   */
  public postMechanic(mechanic: mechanicInfo, officeDiv: boolean): Observable<any> {

    let operationType = 'INITMECHANIC'
    if (officeDiv) {
      operationType = 'INITMECHANICANDOFFICE'
    }
    // リクエストボディ生成
    const body = {
      "OperationType": operationType,
      "Keys": {
        'mechanicId': mechanic.mechanicId,
        'validDiv': mechanic.validDiv,
        'mechanicName': mechanic.mechanicName,
        'adminUserId': mechanic.adminUserId,
        'adminAddressDiv': mechanic.adminAddressDiv,
        'telList': mechanic.telList,
        'mailAdress': mechanic.mailAdress,
        'areaNo1': mechanic.areaNo1,
        'areaNo2': mechanic.areaNo2,
        'adress': mechanic.adress,
        'officeConnectionDiv': mechanic.officeConnectionDiv,
        'associationOfficeList': mechanic.associationOfficeList,
        'officeId': mechanic.officeId,
        'qualification': mechanic.qualification,
        'specialtyWork': mechanic.specialtyWork,
        'profileImageUrl': mechanic.profileImageUrl,
        'introduction': mechanic.introduction,
        'evaluationInfoIdList': mechanic.evaluationInfoIdList,
        'updateUserId': mechanic.updateUserId,
        'created': new Date(),
        'updated': new Date()
      }
    };
    return this.http.post<HttpErrorResponse>(this.apiEndPoint + '/initmechanicup', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: HttpErrorResponse) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



  /**
   * 工場情報を登録する
   * @param officeInfo
   * @param userId
   * @param mechanicId
   * @returns
   */
  public postFactory(officeInfo: officeInfo, userId: string, mechanicId: string): Observable<any> {

    // リクエストボディ生成
    const body = {
      "OperationType": 'PUT',
      "Keys": {
        'officeId': officeInfo.officeId,
        'officeName': officeInfo.officeName,
        'officeTel': officeInfo.officeTel,
        'officeMailAdress': officeInfo.officeMailAdress,
        'officeArea1': officeInfo.officeArea1,
        'officeArea': officeInfo.officeArea,
        'officeAdress': officeInfo.officeAdress,
        'officePostCode': officeInfo.officePostCode,
        'workContentList': officeInfo.workContentList,
        'businessHours': officeInfo.businessHours,
        'connectionOfficeInfo': null,
        'connectionMechanicInfo': null,
        'adminSettingInfo': null,
        'officeFormList': null,
        'officePR': officeInfo.officePR,
        'officePRimageURL': officeInfo.officePRimageURL,
        'userId': userId,
        'mechanicId': mechanicId,
        'publicInfo': initPublicInfo,
        'created': new Date(),
        'updated': new Date()
      }
    };
    return this.http.post<officeInfo>(this.apiEndPoint + '/initofficeup', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: officeInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 伝票情報を登録する
   * @param data
   * @returns
   */
  public initPostSlip(data: slipDetailInfo): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "INITSLIPPOST",
      "Keys": {
        "slipNo": data.slipNo,
        "deleteDiv": data.deleteDiv,
        "category": data.category,
        "slipAdminUserId": data.slipAdminUserId,
        "slipAdminUserName": data.slipAdminUserName,
        "adminDiv": data.adminDiv,
        "title": data.title,
        "areaNo1": data.areaNo1,
        "areaNo2": data.areaNo2,
        "price": data.price,
        "bidMethod": data.bidMethod,
        "bidderId": data.bidderId,
        "bidEndDate": data.bidEndDate,
        "explanation": data.explanation,
        "displayDiv": data.displayDiv,
        "processStatus": data.processStatus,
        "serviceType": data.serviceType,
        "targetVehicleId": data.targetVehicleId,
        "targetVehicleDiv": data.targetVehicleDiv,
        "targetVehicleName": data.targetVehicleName,
        "targetVehicleInfo": data.targetVehicleInfo,
        "workAreaInfo": data.workAreaInfo,
        "preferredDate": data.preferredDate,
        "preferredTime": data.preferredTime,
        "completionDate": data.completionDate,
        "transactionCompletionDate": data.transactionCompletionDate,
        "thumbnailUrl": data.thumbnailUrl,
        "imageUrlList": data.imageUrlList,
        "messageOpenLebel": data.messageOpenLebel,
        "updateUserId": data.updateUserId,
        "created": new Date(),
        "updated": new Date()
      }
    };
    return this.http.post<HttpErrorResponse>(this.apiEndPoint + '/initpostslip', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      map((res: HttpErrorResponse) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



  /**
   * サービス商品情報を登録する
   * @param data
   * @returns
   */
  public initPostSalesService(data: salesServiceInfo): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "INITSALESSERVICEPOST",
      "Keys": {
        "slipNo": data.slipNo,
        "deleteDiv": data.deleteDiv,
        "category": data.category,
        "slipAdminUserId": data.slipAdminUserId,
        "slipAdminUserName": data.slipAdminUserName,
        'slipAdminOfficeId': data.slipAdminOfficeId,
        'slipAdminMechanicId': data.slipAdminMechanicId,
        "adminDiv": data.adminDiv,
        "title": data.title,
        "areaNo1": data.areaNo1,
        "areaNo2": data.areaNo2,
        "price": data.price,
        "bidMethod": data.bidMethod,
        "bidderId": data.bidderId,
        "bidEndDate": data.bidEndDate,
        "explanation": data.explanation,
        "displayDiv": data.displayDiv,
        "processStatus": data.processStatus,
        "serviceType": data.serviceType,
        "targetVehicleId": data.targetVehicleId,
        "targetVehicleDiv": data.targetVehicleDiv,
        "targetVehicleName": data.targetVehicleName,
        "targetVehicleInfo": data.targetVehicleInfo,
        "workAreaInfo": data.workAreaInfo,
        "preferredDate": data.preferredDate,
        "preferredTime": data.preferredTime,
        "completionDate": data.completionDate,
        "transactionCompletionDate": data.transactionCompletionDate,
        "thumbnailUrl": data.thumbnailUrl,
        "imageUrlList": data.imageUrlList,
        "messageOpenLebel": data.messageOpenLebel,
        "updateUserId": data.updateUserId,
        "created": new Date(),
        "updated": new Date()
      }
    };
    return this.http.post<HttpErrorResponse>(this.apiEndPoint + '/initsalesservice', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      map((res: HttpErrorResponse) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 伝票情報を検索
   * @param serchInfo　検索情報
   * @returns
   */
  public serchSlip(serchInfo: serchInfo): Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": 'SERCHSLIPCONTENTS',
      "Keys": {
        "category": serchInfo.category,
        "title": serchInfo.title,
        "areaNo1": serchInfo.areaNo1,
        "areaNo2": serchInfo.areaNo2,
        "priceBottom": serchInfo.praiceBottom,
        "priceUpper": serchInfo.praiceUpper,
        "bidMethod": serchInfo.bidMethod,
        "processStatus": serchInfo.processStatus,
        "targetVehicleInfo": serchInfo.targetVehicleInfo,
        "workAreaInfo": serchInfo.workAreaInfo,
        "date": serchInfo.Date,
        "date2": serchInfo.Date2,
        "preferredDateKey": serchInfo.preferredDateKey
      }
    };
    return this.http.post<slipDetailInfo>(this.apiEndPoint + '/serchslipcontents', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: slipDetailInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * サービス商品情報を検索
   * @param serchInfo　検索情報
   * @returns
   */
  public serchServiceContents(serchInfo: serchInfo): Observable<any> {

    // リクエストボディ生成
    const body = {
      "IndexType": 'SERCHSLIPCONTENTS',
      "Keys": {
        "category": serchInfo.category,
        "title": serchInfo.title,
        "areaNo1": serchInfo.areaNo1,
        "areaNo2": serchInfo.areaNo2,
        "priceBottom": serchInfo.praiceBottom,
        "priceUpper": serchInfo.praiceUpper,
        "bidMethod": serchInfo.bidMethod,
        "processStatus": serchInfo.processStatus,
        "targetVehicleInfo": serchInfo.targetVehicleInfo,
        "workAreaInfo": serchInfo.workAreaInfo,
        "date": serchInfo.Date,
        "date2": serchInfo.Date2,
        "preferredDateKey": serchInfo.preferredDateKey
      }
    };
    return this.http.post<salesServiceInfo>(this.apiEndPoint + '/serchsalesservicecontents', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: salesServiceInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 伝票情報を取得する。
   * @param slipNo
   * @returns
   */
  public getSlip(slipNo: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "GETSLIP",
      "Keys": {
        "slipNo": slipNo
      }
    };
    return this.http.post<any>(this.apiEndPoint + '/getslip', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * サービス商品情報を取得する。
   * @param slipNo
   * @returns
   */
  public getServiceContents(slipNo: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "GETSALESSERVICE",
      "Keys": {
        "slipNo": slipNo
      }
    };
    return this.http.post<any>(this.apiEndPoint + '/getsalesservice', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 伝票メッセージ情報を登録する。
   * @param mechanicId
   * @returns
   */
  public sendMessage(message: slipMessageInfo): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "SENDMESSAGE",
      "Keys": {
        "messageId": message.messageId,
        "slipNo": message.slipNo,
        "displayOrder": message.displayOrder,
        "userId": message.userId,
        "sendUserName": message.sendUserName,
        "comment": message.comment,
        "sendAdressId": message.sendAdressId,
        "logicalDeleteDiv": message.logicalDeleteDiv,
        "created": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale)),
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))
      }
    };
    return this.http.post<slipMessageInfo>(this.apiEndPoint + '/sendmessage', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: slipMessageInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 伝票質問情報を登録する。
   * @param question
   * @returns
   */
  public sendQuestion(question: slipQuestion, serviceType: string): Observable<any> {
    console.log(question)
    console.log(serviceType)

    // リクエストボディ生成
    const body = {
      "OperationType": "SENDQUESTION",
      "ServiceType": serviceType,
      "Keys": {
        "serviceType": serviceType,
        "id": '',
        "slipNo": question.slipNo,
        "slipAdminUser": question.slipAdminUser,
        "senderId": question.senderId,
        "senderName": question.senderName,
        "senderText": question.senderText,
        "anserDiv": question.anserDiv,
        "anserText": question.anserText,
        "created": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale)),
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))
      }
    };
    console.log(body)
    return this.http.post<slipQuestion>(this.apiEndPoint + '/sendquestion', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: slipQuestion) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * お気に入り情報を削除する(複数件)。
   * @param idList
   * @returns
   */
  public multipleDeleteFavorite(idList: {id:string, serviceType: string}[]): Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": "MULTIPLEDELETEFAVORITE",
      "Keys": {
        "idList": idList
      }
    };
    return this.http.post<any>(this.apiEndPoint + '/multiplefavorite', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 閲覧履歴情報を削除する(複数件)
   * @param idList
   * @returns
   */
  public multipleDeleteBrowsingHistory(idList: string[]): Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": "MULTIPLEDELETEBROWSINGHISTORY",
      "Keys": {
        "idList": idList
      }
    };
    return this.http.post<any>(this.apiEndPoint + '/multiplebrosing', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



  /**
   * メカニックファクトリー商品リスト取得
   * @param id
   * @param serviceType
   * @returns
   */
  public getMcFcItemList(id: string, serviceType: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": "FCMCITEM",
      "Keys": {
        "acceseMechanicId": id,
        "serviceType": serviceType
      }
    };
    return this.http.post<mcfcItem>(this.apiEndPoint + '/serchfcmcitem', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: mcfcItem) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * サービス管理者情報取得
   * @param id
   * @param serviceType
   * @returns
   */
  public getSalesAdminInfo(id: string, serviceType: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": "SALESADMININFO",
      "Keys": {
        "id": id,
        "serviceType": serviceType
      }
    };
    return this.http.post<serviceAdminInfo>(this.apiEndPoint + '/salesadmininfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: serviceAdminInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 伝票管理者情報取得
   * @param id
   * @returns
   */
  public getSlipAdminInfo(id: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": "SLIPADMININFO",
      "Keys": {
        "id": id
      }
    };
    return this.http.post<serviceAdminInfo>(this.apiEndPoint + '/slipadmininfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: serviceAdminInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 過去取引情報取得
   * @param adminId
   * @param serviceType
   * @param accessUser
   * @returns
   */
  public getPastTransaction(adminId: string, serviceType: string, accessUser: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": "PASTTRANSACTION",
      "Keys": {
        "adminId": adminId,
        "serviceType": serviceType,
        "accessUser": accessUser
      }
    };
    return this.http.post<completionSlip>(this.apiEndPoint + '/pasttransaction', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: completionSlip) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 工場・メカニック情報検索
   * @param serchData
   * @returns
   */
  public serchFcMcInfo(serchData: fcmcSerchData, serviceType: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": "SERCHFCMCINFO",
      "ServiceType": serviceType,
      "Keys": {
        "area1": serchData.area1,
        "area2": serchData.area2,
        "name": serchData.name,
        "telNo": serchData.telNo
      }
    };
    return this.http.post<fcmcSerchResult>(this.apiEndPoint + '/serchfcmcdata', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: fcmcSerchResult) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 関連工場ステータス変更
   * @param connectionOffice
   * @returns
   */
  public editConnectionOfficeStatus(officeId: string,connectionOffice: connectionOfficeInfo[]): Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": "CONNECTIONOFFICESTATUS",
      "Keys": {
        "adminOfficeId": officeId,
        "connectionOffice": connectionOffice
      }
    };
    return this.http.post<connectionOfficeInfo>(this.apiEndPoint + '/connectionofficestatus', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: connectionOfficeInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 申し込み中のメカニック情報を取得する
   * @param officeId
   * @returns
   */
  public getRequestMechanicInfo(officeId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": "GETREQUESTMECHANICINFO",
      "Keys": {
        "adminOfficeId": officeId
      }
    };
    return this.http.post<requestInfo>(this.apiEndPoint + '/getrequestmechanicinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: requestInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



}
