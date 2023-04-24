import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpClientJsonpModule, HttpErrorResponse, } from '@angular/common/http';
import { catchError, Observable, of, map} from 'rxjs';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { dispBrowsingHistory } from './browsing-history.component';

@Injectable({
  providedIn: 'root'
})
export class BrowsingHistoryService {

  constructor(
    private http: HttpClient,
    private apiGsiSerchService: ApiGsiSerchService,
    private apiUniqueService: ApiUniqueService,
  ) { }


  /**
   * 閲覧履歴情報を取得する
   * @returns
   */
  public getMyBrosingHistory(userId: string): Observable<browsingHistory[]> {
    return this.apiGsiSerchService.serchBrowsingHistory(userId);
  }

  /**
   * 閲覧履歴情報を削除する
   * @param list
   */
  public deleteMyBrosingHistory(list: dispBrowsingHistory[]): Observable<any> {
    let idList:string[] = [];
    list.forEach(li => {
      idList.push(li.id);
    }); 
    return this.apiUniqueService.multipleDeleteBrowsingHistory(idList);
  }

}
