import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { user } from 'src/app/entity/user';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { userFavorite } from 'src/app/entity/userFavorite';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';


@Injectable({
  providedIn: 'root'
})
export class ApiCheckService {

  constructor(
    private http: HttpClient,
  ) { }


  private apiEndPoint: string = environment.EndPoint.apiEmdPointCheck + environment.EndPoint.apiCheckVersion + '/check';

  /**
   * 伝票管理者かどうかをチェックする
   * @param userId
   * @returns
   */
  public checkSlipPrm(slipNo: string, userId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "CHECK",
      "Keys": {
        "slipNo": slipNo,
        "userId": userId
      }
    };
    return this.http.post<boolean>(this.apiEndPoint + '/slipmegprmuser', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処
      // 取得できた場合ユーザー情報を返却
      map((res: boolean) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * サービス管理者かどうかをチェックする
   * @param userId
   * @returns
   */
  public checkSalesPrm(slipNo: string, accessUser: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "CHECK",
      "Keys": {
        "slipNo": slipNo,
        "accessUser": accessUser
      }
    };
    return this.http.post<boolean>(this.apiEndPoint + '/salesprmuser', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処
      // 取得できた場合ユーザー情報を返却
      map((res: boolean) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 伝票IDと管理者IDから対象伝票を取得する
   * @param slipNo
   * @param adminId
   * @param serviceType
   * @returns
   */
  public checkAdminUserSlip(slipNo: string, adminId: string, serviceType: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "ADMINIDCHECHK",
      "Keys": {
        "slipNo": slipNo,
        "adminId": adminId,
        "serviceType": serviceType
      }
    };
    return this.http.post<slipDetailInfo>(this.apiEndPoint + '/slipadminusercheck', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処
      // 取得できた場合ユーザー情報を返却
      map((res: slipDetailInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * アクセス者の管理対象判定を行う
   * @param adminId
   * @param serviceType
   * @param accessUser
   * @returns
   */
  public checkAcceseAdmin(adminId: string, serviceType: string, accessUser: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "CHECKACCESEADMIN",
      "Keys": {
        "adminId": adminId,
        "serviceType": serviceType,
        "accessUser": accessUser
      }
    };
    return this.http.post<boolean>(this.apiEndPoint + '/checkacceseadmin', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処
      // 取得できた場合ユーザー情報を返却
      map((res: boolean) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 伝票へのアクセス者が管理者か閲覧者かをチェックする 
   */
  public checkAccessUserSlip(slipNo: string, userId: string, serviceType: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "CHECKACCESSUSERSLIP",
      "Keys": {
        "slipNo": slipNo,
        "userId": userId,
        "serviceType": serviceType
      }
    };
    return this.http.post<boolean>(this.apiEndPoint + '/checkaccessuserslip', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処
      // 取得できた場合ユーザー情報を返却
      map((res: boolean) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 取引依頼中ユーザーかを判定を行う
   * @param slipNo
   * @param requestUserId
   * @param serviceType
   * @returns
   */
  public checkTransactionReq(slipNo: string, requestUserId: string, serviceType: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "CHECKTRANSACTIONREQ",
      "Keys": {
        "slipNo": slipNo,
        "requestUserId": requestUserId,
        "serviceType": serviceType
      }
    };
    return this.http.post<boolean>(this.apiEndPoint + '/checktransactionreq', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処
      // 取得できた場合ユーザー情報を返却
      map((res: boolean) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
    * 取引中ユーザーかを判定を行う
    * @param slipNo
    * @param requestUserId
    * @param slipServiceType
    * @returns
    */
  public checkTransaction(slipNo: string, userId: string, slipServiceType: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "CHECKTRANSACTION",
      "Keys": {
        "slipNo": slipNo,
        "userId": userId,
        "slipServiceType": slipServiceType
      }
    };
    return this.http.post<boolean>(this.apiEndPoint + '/checktransaction', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処
      // 取得できた場合ユーザー情報を返却
      map((res: boolean) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
    * 取引依頼のチェック
    * @param slipNo
    * @param userId
    * @returns
    */
  public sentTranReqCheck(slipNo: string, userId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "CHECKACCESSUSERSENTTRANSACTIONREQ",
      "Keys": {
        "slipNo": slipNo,
        "accessUserId": userId,
      }
    };
    return this.http.post<serviceTransactionRequest>(this.apiEndPoint + '/checkacceseusersenttransactionreq', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処
      // 取得できた場合ユーザー情報を返却
      map((res: serviceTransactionRequest) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


}
