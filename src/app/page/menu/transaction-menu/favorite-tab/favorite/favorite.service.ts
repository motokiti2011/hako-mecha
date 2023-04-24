import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpClientJsonpModule, HttpErrorResponse, } from '@angular/common/http';
import { catchError, Observable, of, map} from 'rxjs';
import { userFavorite } from 'src/app/entity/userFavorite';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private http: HttpClient,
    private apiService: ApiSerchService,
    private apiGsiService: ApiGsiSerchService,
    private apiUniqueService: ApiUniqueService,
  ) { }

  private apiEndPoint: string = 'http://localhost:8080/v1/';


  /**
   * お気に入り情報を取得する
   * @returns
   */
  public getFavoriteList(userId: string): Observable<userFavorite[]> {
    return this.apiGsiService.serchFavorite(userId);
  }

  /**
   * お気に入り情報を削除する
   * @param list
   */
  public deleteMyFavorite(list: userFavorite[]): Observable<number> {
    let idList: {id:string, serviceType: string}[] = [];
    // idを抽出
    list.forEach(li => {
      const addData = {
        id: li.id,
        serviceType: li.serviceType
      }
      idList.push(addData);
    });
    return this.apiUniqueService.multipleDeleteFavorite(idList);

  }

}
