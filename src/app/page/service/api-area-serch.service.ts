import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { cityApiDate } from 'src/app/entity/prefectures';


@Injectable({
  providedIn: 'root'
})
export class ApiAreaSerchService {

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string
  ) { }


  private citySerchApiEndPoint: string = 'https://www.land.mlit.go.jp/webland/api/CitySearch?area=';



  /**
   * 都道府県情報から市町村の情報を取得する。
   * @param areaCode
   * @returns
   */
  public serchCityData(areaCode: string): Observable<any> {

    return this.http.get<cityApiDate>(this.citySerchApiEndPoint + areaCode).pipe(
      timeout(2500), // タイムアウト処理
      retry(3), // リトライ処理
      // 取得できた場合ユーザー情報を返却
      map((res: cityApiDate) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }




}
