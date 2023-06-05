import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';
import { salesServiceInfo } from 'src/app/entity/salesServiceInfo';

@Injectable({
  providedIn: 'root'
})
export class ApiSlipProsessService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiEndPoint: string = environment.EndPoint.apiEmdPointSLIPPROSESS + environment.EndPoint.apiGsiVersion + '/slipprocess';


  /**
   * 取引開始を申し込む
   * @param user
   * @returns
   */
  public sendTransactionReq(slipNo: string, serviceType: string, userId: string, serviceUserType: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "TRANSACTIONREQUEST",
      "Keys": {
        "slipNo": slipNo,
        "serviceType": serviceType,
        "requestUserId": userId,
        "serviceUserType": serviceUserType,
      }
    };
    return this.http.post<serviceTransactionRequest>(this.apiEndPoint + '/sendtransactionrequest', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合情報を返却
      map((res: serviceTransactionRequest) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 取引確定処理を行う
   * @param req
   * @param adminId
   * @returns
   */
  public approvalTransaction(req: serviceTransactionRequest, adminId: string, serviceType: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "CONFIRMTRANSACTION",
      "Keys": {
        "serviceTransactionRequest": req,
        "userId": adminId,
        "serviceType": serviceType,
      }
    };
    return this.http.post<serviceTransactionRequest>(this.apiEndPoint + '/confirmtransaction', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合情報を返却
      map((res: serviceTransactionRequest) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 再出品用の期限切れ伝票を取得する
   * @param serviceType
   * @param serviceContents
   * @returns
   */
  public relistedService(serviceType: string, serviceContents: salesServiceInfo): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "RELISTEDSERVICE",
      "Keys": {
        "slipNo": serviceContents.slipNo,
        "deleteDiv": serviceContents.deleteDiv,
        "category": serviceContents.category,
        "slipAdminUserId": serviceContents.slipAdminUserId,
        "slipAdminOfficeId": serviceContents.slipAdminOfficeId,
        "slipAdminMechanicId": serviceContents.slipAdminMechanicId,
        "adminDiv": serviceContents.adminDiv,
        "title": serviceContents.title,
        "areaNo1": serviceContents.areaNo1,
        "areaNo2": serviceContents.areaNo2,
        "price": serviceContents.price,
        "bidMethod": serviceContents.bidMethod,
        "bidderId": serviceContents.bidderId,
        "bidEndDate": serviceContents.bidEndDate,
        "explanation": serviceContents.explanation,
        "displayDiv": serviceContents.displayDiv,
        "serviceType": serviceContents.serviceType,
        "targetVehicleId": serviceContents.targetVehicleId,
        "targetVehicleName": serviceContents.targetVehicleName,
        "targetVehicleInfo": serviceContents.targetVehicleInfo,
        "workAreaInfo": serviceContents.workAreaInfo,
        "preferredDate": serviceContents.preferredDate,
        "preferredTime": serviceContents.preferredTime,
        "completionDate": serviceContents.completionDate,
        "transactionCompletionDate": serviceContents.transactionCompletionDate,
        "thumbnailUrl": serviceContents.thumbnailUrl,
        "imageUrlList": serviceContents.imageUrlList,
        "messageOpenLebel": serviceContents.messageOpenLebel,
        "updateUserId": serviceContents.updateUserId,
        "created": serviceContents.created
      }
    };
    return this.http.post<any>(this.apiEndPoint + '/relistedservice', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 完了予定日を更新する
   * @param slipNo 
   * @param serviceType 
   * @param compDateNum 
   * @param acceseUserId 
   * @returns 
   */
  public compDateSetting(slipNo: string, serviceType: string, compDateNum: number, acceseUserId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "SCHEDULEDCOMPSETTING",
      "Keys": {
        "slipNo": slipNo,
        "serviceType": serviceType,
        "compDate": compDateNum,
        "acceseUserId": acceseUserId,
      }
    };
    return this.http.post<salesServiceInfo>(this.apiEndPoint + '/scheduledcompletionsetting', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合情報を返却
      map((res: salesServiceInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 取引を完了する
   * @param slipNo 
   * @param serviceType 
   * @param acceseUser 
   * @returns 
   */
  public compTransaction(slipNo: string, serviceType: string, acceseUser: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "COMPTRANSACTION",
      "Keys": {
        "slipNo": slipNo,
        "serviceType": serviceType,
        "acceseUserId": acceseUser,
      }
    };
    return this.http.post<any>(this.apiEndPoint + '/completiontransaction', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 取引をキャンセルする
   * @param slipNo 
   * @param serviceType 
   * @param acceseUser 
   * @returns 
   */
  public cancelTransaction(slipNo: string, serviceType: string, acceseUser: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "CANCELTRANSACTION",
      "Keys": {
        "slipNo": slipNo,
        "serviceType": serviceType,
        "acceseUserId": acceseUser,
      }
    };
    return this.http.post<any>(this.apiEndPoint + '/canceltransaction', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }




}
