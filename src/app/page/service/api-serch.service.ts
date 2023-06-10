import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { formatDate } from '@angular/common';

import { environment } from 'src/environments/environment';
import { user } from 'src/app/entity/user';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { userFavorite } from 'src/app/entity/userFavorite';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { salesServiceInfo } from 'src/app/entity/salesServiceInfo';

import { slipQuestion } from 'src/app/entity/slipQuestion';
import { mechanicInfo } from 'src/app/entity/mechanicInfo';
import { officeInfo } from 'src/app/entity/officeInfo';
import { slipMessageInfo } from 'src/app/entity/slipMessageInfo';
import { slipMegPrmUser } from 'src/app/entity/slipMegPrmUser';
import { userVehicle } from 'src/app/entity/userVehicle';
import { factoryMechanicFavorite } from 'src/app/entity/factoryMechanicFavorite';
import { inquiryInfo } from 'src/app/entity/inquiryInfo';

@Injectable({
  providedIn: 'root'
})
export class ApiSerchService {

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string
  ) { }


  private apiEndPoint: string = environment.EndPoint.apiEmdPoint + environment.EndPoint.apiVersion + '/serch';


  /**
   * ユーザーIDからユーザー情報を取得する。
   * @param userId
   * @returns
   */
  public getUser(userId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "userId": userId,
        "userValidDiv": '0'
      }
    };
    return this.http.post<user>(this.apiEndPoint + '/userinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: user) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * CognitoユーザーIDをPKにユーザー情報をDynamoDBに登録する
   * @param user
   * @returns
   */
  public postUser(user: user): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "PUT",
      "Keys": {
        "userId": user.userId,
        "userValidDiv": user.userValidDiv,
        "corporationDiv": user.corporationDiv,
        "userName": user.userName,
        "mailAdress": user.mailAdress,
        "TelNo1": user.TelNo1,
        "TelNo2": user.TelNo2,
        "areaNo1": user.areaNo1,
        "areaNo2": user.areaNo2,
        "adress": user.adress,
        "postCode": user.postCode,
        "mechanicId": user.mechanicId,
        "officeId": user.officeId,
        "baseId": user.baseId,
        "officeRole": user.officeRole,
        "profileImageUrl": user.profileImageUrl,
        "introduction": user.introduction,
        "publicInfo": user.publicInfo,
        "updateUserId": user.updateUserId,
        "created": user.created,
        "updated": user.updated
      }
    };
    return this.http.post<user>(this.apiEndPoint + '/userinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: user) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 伝票番号をPKに伝票情報をDynamoDBに登録する
   * @param user
   * @returns
   */
  public postSlip(data: slipDetailInfo): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "PUT",
      "Keys": {
        "slipNo": data.slipNo,
        "deleteDiv": data.deleteDiv,
        "category": data.category,
        "slipAdminUserId": data.slipAdminUserId,
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
        "created": data.created,
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))
      }
    };
    return this.http.post<slipDetailInfo>(this.apiEndPoint + '/slipdetailinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: slipDetailInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }




  /**
   * 伝票番号をPKに伝票情報をDynamoDBに登録する
   * @param user
   * @returns
   */
  public postSalesServiceInfo(data: salesServiceInfo): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "PUT",
      "Keys": {
        "slipNo" : data.slipNo,
        "deleteDiv" : data.deleteDiv,
        "category" : data.category,
        "slipAdminUserId" : data.slipAdminUserId,
        "slipAdminUserName" : data.slipAdminUserName,
        "slipAdminOfficeId" : data.slipAdminOfficeId,
        "slipAdminOfficeName" : data.slipAdminOfficeName,
        "slipAdminMechanicId" : data.slipAdminMechanicId,
        "slipAdminMechanicName" : data.slipAdminMechanicName,
        "adminDiv" : data.adminDiv,
        "title" : data.title,
        "areaNo1" : data.areaNo1,
        "areaNo2" : data.areaNo2,
        "price" : data.price,
        "bidMethod" : data.bidMethod,
        "bidderId" : data.bidderId,
        "bidEndDate" : data.bidEndDate,
        "explanation" : data.explanation,
        "displayDiv" : data.displayDiv,
        "processStatus" : data.processStatus,
        "serviceType" : data.serviceType,
        "targetVehicleId" : data.targetVehicleId,
        "targetVehicleDiv" : data.targetVehicleDiv,
        "targetVehicleName" : data.targetVehicleName,
        "targetVehicleInfo" : data.targetVehicleInfo,
        "workAreaInfo" : data.workAreaInfo,
        "preferredDate" : data.preferredDate,
        "preferredTime" : data.preferredTime,
        "completionDate" : data.completionDate,
        "transactionCompletionDate" : data.transactionCompletionDate,
        "thumbnailUrl" : data.thumbnailUrl,
        "imageUrlList" : data.imageUrlList,
        "messageOpenLebel" : data.messageOpenLebel,
        "updateUserId" : data.updateUserId,
        "created" : data.created,
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))
      }
    };
    return this.http.post<salesServiceInfo>(this.apiEndPoint + '/salesServiceInfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: salesServiceInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



  /**
   * 履歴情報を登録する
   * @param user
   * @returns
   */
  public postHistory(data: browsingHistory): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "POST",
      "Keys": {
        "id": data.id,
        "userId": data.userId,
        "slipNo": data.slipNo,
        "title": data.title,
        "price": data.price,
        "whet": data.whet,
        "endDate": data.endDate,
        "imageUrl": data.imageUrl,
        "serviceType": data.serviceType,
        "created": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale)),
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))

      }
    };
    return this.http.post<browsingHistory>(this.apiEndPoint + '/browsinghistory', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: browsingHistory) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * お気に入り情報を登録する
   * @param user
   * @returns
   */
  public postFavorite(data: userFavorite): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "POST",
      "Keys": {
        "id": data.id,
        "userId": data.userId,
        "slipNo": data.slipNo,
        "title": data.title,
        "price": data.price,
        "whet": data.whet,
        "endDate": data.endDate,
        "imageUrl": data.imageUrl,
        "serviceType": data.serviceType,
        "created": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale)),
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))
      }
    };
    return this.http.post<browsingHistory>(this.apiEndPoint + '/userfavorite', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: browsingHistory) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * お気に入り情報を削除する
   * @param user
   * @returns
   */
  public deleteFavorite(id: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "DELETE",
      "Keys": {
        "id": id
      }
    };
    return this.http.post<browsingHistory>(this.apiEndPoint + '/userfavorite', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: browsingHistory) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * CognitoユーザーIDをPKにお気に入り情報をDynamoDBに登録する
   * @param user
   * @returns
   */
  public postQuestion(data: slipQuestion): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "PUT",
      "Keys": {
        "id": data.id,
        "slipNo": data.slipNo,
        "slipAdminUser": data.slipAdminUser,
        "senderId": data.senderId,
        "senderName": data.senderName,
        "senderText": data.senderText,
        "anserDiv": data.anserDiv,
        "anserText": data.anserText,
        "created": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale)),
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))
      }
    };
    return this.http.post<slipQuestion>(this.apiEndPoint + '/slipquestion', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: slipQuestion) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * メカニックIDからメカニック情報を取得する。
   * @param mechanicId
   * @returns
   */
  public getMecha(mechanicId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "mechanicId": mechanicId
      }
    };
    return this.http.post<mechanicInfo>(this.apiEndPoint + '/mechanicinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: mechanicInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * メカニックIDからメカニック情報を取得する。
   * @param mechanicId
   * @returns
   */
  public getOfficeInfo(officeId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "officeId": officeId
      }
    };
    return this.http.post<officeInfo>(this.apiEndPoint + '/officeinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: officeInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 伝票メッセージ情報を更新する。
   * @param mechanicId
   * @returns
   */
  public postMessage(message: slipMessageInfo): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "PUT",
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
    return this.http.post<slipMessageInfo>(this.apiEndPoint + '/slipmessageinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: slipMessageInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



  /**
   * 伝票メッセージ許可ユーザー情報を取得する。
   * @param mechanicId
   * @returns
   */
  public getSlipMegPrmUser(slipNo: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "slipNo": slipNo
      }
    };
    return this.http.post<slipMegPrmUser>(this.apiEndPoint + '/slipmegprmuser', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: slipMegPrmUser) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * ユーザー車両情報を取得
   * @param mechanicId
   * @returns
   */
  public getUserVehicle(vehicleId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "vehicleId": vehicleId
      }
    };
    return this.http.post<userVehicle>(this.apiEndPoint + '/uservehicleinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: userVehicle) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * ユーザー車両情報を取得
   * @param mechanicId
   * @returns
   */
  public deleteUserVehicle(vehicleId: string, userId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "DELETE",
      "Keys": {
        "vehicleId": vehicleId,
        "userId": userId
      }
    };
    return this.http.post<userVehicle>(this.apiEndPoint + '/uservehicleinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: userVehicle) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * ユーザー車両情報を登録する
   * @param mechanicId
   * @returns
   */
  public postUserVehicle(data: userVehicle): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "POST",
      "Keys": {
        "vehicleId": '',
        "userId": data.userId,
        "vehicleName": data.vehicleName,
        "vehicleDiv": data.vehicleDiv,
        "vehicleNo": data.vehicleNo,
        "vehicleNoAreaName": data.vehicleNoAreaName,
        "vehicleNoClassificationNum": data.vehicleNoClassificationNum,
        "vehicleNoKana": data.vehicleNoKana,
        "vehicleNoSerialNum": data.vehicleNoSerialNum,
        "chassisNo": data.chassisNo,
        "designatedClassification": data.designatedClassification,
        "coler": data.coler,
        "maker": data.maker,
        "form": data.form,
        "colerNo": data.colerNo,
        "mileage": data.mileage,
        "firstRegistrationDate": data.firstRegistrationDate,
        "InspectionExpirationDate": data.inspectionExpirationDate,
        "updateUserId": data.userId
      }
    };
    return this.http.post<userVehicle>(this.apiEndPoint + '/uservehicleinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: userVehicle) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * ユーザー車両情報を更新する
   * @param mechanicId
   * @returns
   */
  public putUserVehicle(data: userVehicle): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "PUT",
      "Keys": {
        "vehicleId": data.vehicleId,
        "userId": data.userId,
        "vehicleName": data.vehicleName,
        "vehicleDiv": data.vehicleDiv,
        "vehicleNo": data.vehicleNo,
        "vehicleNoAreaName": data.vehicleNoAreaName,
        "vehicleNoClassificationNum": data.vehicleNoClassificationNum,
        "vehicleNoKana": data.vehicleNoKana,
        "vehicleNoSerialNum": data.vehicleNoSerialNum,
        "chassisNo": data.chassisNo,
        "designatedClassification": data.designatedClassification,
        "coler": data.coler,
        "maker": data.maker,
        "form": data.form,
        "colerNo": data.colerNo,
        "mileage": data.mileage,
        "firstRegistrationDate": data.firstRegistrationDate,
        "InspectionExpirationDate": data.inspectionExpirationDate,
        "updateUserId": data.userId,
        "created": data.created
      }
    };
    return this.http.post<userVehicle>(this.apiEndPoint + '/uservehicleinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: userVehicle) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 工場情報を登録する
   * @param mechanicId
   * @returns
   */
  public postOffice(data: officeInfo): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "PUT",
      "Keys": {
        "officeId": data.officeId,
        "officeName": data.officeName,
        "officeTel": data.officeTel,
        "officeMailAdress": data.officeMailAdress,
        "officeArea1": data.officeArea1,
        "officeArea": data.officeArea,
        "officeAdress": data.officeAdress,
        "officePostCode": data.officePostCode,
        'workContentList': data.workContentList,
        "businessHours": data.businessHours,
        "connectionOfficeInfo": data.connectionOfficeInfo,
        "connectionMechanicInfo": data.connectionMechanicInfo,
        "adminSettingInfo": data.adminSettingInfo,
        // "employeeList": data.employeeList,
        "officePR": data.officePR,
        "officePRimageURL": data.officePRimageURL,
        "officeFormList": data.officeFormList,
        "publicInfo": data.publicInfo,
        "created": data.created,
      }
    };
    return this.http.post<officeInfo>(this.apiEndPoint + '/officeinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: officeInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 工場・メカニックお気に入り登録を行う
   * @param data
   * @returns
   */
  public postFcMcFavorite(data: factoryMechanicFavorite): Observable<any> {

    // リクエストボディ生成
    const body = {
      "OperationType": "POST",
      "Keys": {
        "id": data.id,
        "userId": data.userId,
        "serviceType": data.serviceType,
        "favoriteId": data.favoriteId,
        "favoriteName": data.favoriteName,
        "created": data.created,
        "updated": data.updated
      }
    };
    return this.http.post<factoryMechanicFavorite>(this.apiEndPoint + '/factorymechanicfavorite', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: factoryMechanicFavorite) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



  /**
   * お問い合わせを登録する
   * @param data
   * @returns
   */
  public postInquiry(data: inquiryInfo): Observable<any> {

    // リクエストボディ生成
    const body = {
      "OperationType": "POST",
      "Keys": {
        "inquiryId": data.inquiryId,
        "inquiryUserId": data.inquiryUserId,
        "inquiryUserName": data.inquiryUserName,
        "inquiryUserCategory": data.inquiryUserCategory,
        "inquiryUserContents": data.inquiryUserContents,
        "inquiryAdless": data.inquiryAdless,
        "inquiryMailAdless": data.inquiryMailAdless,
        "inquiryDate": data.inquiryDate,
        "anserDiv": data.anserDiv,
        "anserDate": data.anserDate,
        "created": data.created
      }
    };
    return this.http.post<inquiryInfo>(this.apiEndPoint + '/inquiryinfo ', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: inquiryInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 市町村情報取得
   * @param area
   */
  public serchArea(area: string): Observable<any> {
    const url = 'http://geoapi.heartrails.com/api/json?method=getCities&prefecture=';
    return this.http.get<any>(url + area)
    .pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );

  }

  /**
   * 郵便番号検索
   * @param postCode
   */
  public serchPostCode(postCode: string): Observable<any> {
    const url = 'http://geoapi.heartrails.com/api/json?method=searchByPostal&postal=';
    return this.http.get<any>(url + postCode)
    .pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



}
