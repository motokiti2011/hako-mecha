import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { serviceContents } from 'src/app/entity/serviceContents';
import { slipQuestion } from 'src/app/entity/slipQuestion';
import { slipMessageInfo } from 'src/app/entity/slipMessageInfo';
import { userFavorite } from 'src/app/entity/userFavorite';
import { completionSlip } from 'src/app/entity/completionSlip';
import { transactionSlip } from 'src/app/entity/transactionSlip';
import { userMyList } from 'src/app/entity/userMyList';
import { userVehicle } from 'src/app/entity/userVehicle';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';
import { factoryMechanicFavorite } from 'src/app/entity/factoryMechanicFavorite';
import { serchServiceCombination } from 'src/app/entity/serchCondition';
import { salesServiceInfo } from 'src/app/entity/salesServiceInfo';

@Injectable({
  providedIn: 'root'
})
export class ApiGsiSerchService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiEndPoint: string = environment.EndPoint.apiEmdPointGsi + environment.EndPoint.apiGsiVersion + '/indexserch';


  /**
   * ユーザーIDからユーザー情報を取得する。
   * @param userId
   * @returns
   */
  public initSerchSlip(serchArea1: string, serchArea2: string, serchCategory: string): Observable<any> {

    let operation = '';

    // 引数設定状況によって検索条件を組み合わせる
    if (serchArea1 == '0') {
      operation = 'CATEGORY-INDEX';
    } else {
      operation = 'AREANO1-INDEX';
    }

    // リクエストボディ生成
    const body = {
      "IndexType": operation,
      "Keys": {
        "areaNo1": serchArea1,
        "areaNo2": serchArea2,
        "category": serchCategory
      }
    };
    return this.http.post<slipDetailInfo>(this.apiEndPoint + '/slipdetailinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * ユーザーIDからユーザー情報を取得する。
   * @param userId
   * @returns
   */
  public indexSerchSlip(serchArea1: string, serchArea2: string, serchCategory: string, subject: string): Observable<any> {

    // リクエストボディ生成
    const body = {
      "IndexType": subject,
      "Keys": {
        "areaNo1": serchArea1,
        "areaNo2": serchArea2,
        "category": serchCategory
      }
    };
    return this.http.post<slipDetailInfo>(this.apiEndPoint + '/slipdetailinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * ユーザーIDからお気に入り情報を取得
   * @param userId
   * @returns
   */
  public serchFavorite(userId: string): Observable<any> {

    // リクエストボディ生成
    const body = {
      "IndexType": 'USERID-INDEX',
      "Keys": {
        "userId": userId
      }
    };
    return this.http.post<userFavorite>(this.apiEndPoint + '/userfavorite', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: userFavorite) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * ユーザーIDからお気に入り情報を取得
   * @param userId
   * @returns
   */
  public serchBrowsingHistory(userId: string): Observable<any> {

    // リクエストボディ生成
    const body = {
      "IndexType": 'USERID-INDEX',
      "Keys": {
        "userId": userId
      }
    };
    return this.http.post<slipDetailInfo>(this.apiEndPoint + '/browsinghistory', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * ユーザーIDから伝票情報を取得
   * @param userId
   * @returns
   */
  public serchSlipAuthCheck(userId: string): Observable<any> {

    // リクエストボディ生成
    const body = {
      "IndexType": 'SLIPADMINUSEID-INDEX',
      "Keys": {
        "userId": userId
      }
    };
    return this.http.post<slipDetailInfo>(this.apiEndPoint + '/slipdetailinfo', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 伝票番号から伝票質問情報を取得
   * @param slipNo
   * @returns
   */
  public serchSlipQuestion(slipNo: string): Observable<any> {

    // リクエストボディ生成
    const body = {
      "IndexType": 'SLIPNO-INDEX',
      "Keys": {
        "slipNo": slipNo
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
   * 伝票番号から伝票質問情報を取得
   * @param slipNo
   * @returns
   */
  public serchSlipMessage(slipNo: string): Observable<any> {

    // リクエストボディ生成
    const body = {
      "IndexType": 'SLIPNO-INDEX',
      "Keys": {
        "slipNo": slipNo
      }
    };
    return this.http.post<slipMessageInfo>(this.apiEndPoint + '/slipmessage', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: slipMessageInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 各種IDから完了伝票情報を取得
   * @param id
   * @param serchType
   * @returns
   */
  public serchCompletionSlip(id: string, serchType: string): Observable<any> {

    let indexType = 'SLIPADMINUSERID-INDEX'
    if (serchType == '1') {
      indexType = 'SLIPADMINOFFICE-INDEX'
    } else if (serchType == '2') {
      indexType = 'SLIPADMINMECHANIC-INDEX'
    }

    // リクエストボディ生成
    const body = {
      "IndexType": indexType,
      "Keys": {
        "id": id,
        "serviceType": serchType
      }
    };
    return this.http.post<completionSlip>(this.apiEndPoint + '/completionslip', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: completionSlip) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 各種IDから取引伝票情報を取得
   * @param id
   * @param serchType
   * @returns
   */
  public serchTransactionSlip(id: string, serchType: string): Observable<any> {

    let indexType = 'SLIPUSER-INDEX'
    if (serchType == '1') {
      indexType = 'SLIPMECHANIC-INDEX'
    } else if (serchType == '2') {
      indexType = 'SLIPOFFICE-INDEX'
    }

    // リクエストボディ生成
    const body = {
      "IndexType": indexType,
      "Keys": {
        "id": id,
        "serviceType": serchType
      }
    };
    return this.http.post<transactionSlip>(this.apiEndPoint + '/transactionslip', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: transactionSlip) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
 * 各種IDからマイリスト情報を取得
 * @param id
 * @param serchType
 * @returns
 */
  public serchMyList(id: string, serchType: string): Observable<any> {

    let indexType = 'USERID-INDEX'
    if (serchType == '1') {
      indexType = 'MECHANICID-INDEX'
    } else if (serchType == '2') {
      indexType = 'OFFICEID-INDEX'
    }

    // リクエストボディ生成
    const body = {
      "IndexType": indexType,
      "Keys": {
        "id": id,
        "serviceType": serchType
      }
    };
    return this.http.post<userMyList>(this.apiEndPoint + '/usermylist', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: userMyList) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   *　車両情報を取得
   * @returns
   */
  public serchVehicle(id: string,serchType: string): Observable<any> {
    let indexType = 'USERID-INDEX'
    if (serchType == '1') {
      indexType = 'VEHICLENO-INDEX'
    }

    // リクエストボディ生成
    const body = {
      "IndexType": indexType,
      "Keys": {
        "id": id
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
   * 取引依頼情報を取得
   * @param slipNo
   * @returns
   */
  public serchTransactionRequest(slipNo: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": 'SLIPNO-INDEX',
      "Keys": {
        "slipNo": slipNo
      }
    };
    return this.http.post<serviceTransactionRequest>(this.apiEndPoint + '/servicetransactionrequest', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: serviceTransactionRequest) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 工場・メカニックお気に入り情報を取得
   * @param userId
   * @returns
   */
  public serchFcMcFavorite(userId: string) : Observable<any> {
    // リクエストボディ生成
    const body = {
      "IndexType": 'USERID-INDEX',
      "Keys": {
        "userId": userId
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
   * 検索条件に応じた伝票情報を取得する
   * @param value
   * @returns
   */
    public slipSerchCombination(value: serchServiceCombination) : Observable<any> {

      if(value.area2 == '' || value.area2 == null) {
        value.area2 = '0'
      }

      // リクエストボディ生成
      const body = {
        "IndexType": 'SERCH-SLIP-INDEX',
        "Keys": {
          "area1": value.area1,
          "area2": value.area2,
          "category": value.category,
          "amount1": value.amount1,
          "amount2": value.amount2,
          "amountSerchDiv": value.amountSerchDiv
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
   * 検索条件に応じたサービス商品を取得する
   * @param value
   * @returns
   */
  public serviceSerchCombination(value: serchServiceCombination) : Observable<any> {

    if(value.area2 == '' || value.area2 == null) {
      value.area2 = '0'
    }

    // リクエストボディ生成
    const body = {
      "IndexType": 'SERCH-SERVICE-INDEX',
      "Keys": {
        "area1": value.area1,
        "area2": value.area2,
        "category": value.category,
        "amount1": value.amount1,
        "amount2": value.amount2,
        "amountSerchDiv": value.amountSerchDiv
      }
    };
    return this.http.post<salesServiceInfo>(this.apiEndPoint + '/serchservicecontents', body).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: salesServiceInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: salesServiceInfo) => of(undefined))
    );
  }

}
