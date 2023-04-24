import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CognitoService } from '../auth/cognito.service';


@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {

  constructor(
    private http: HttpClient,
    private cognito: CognitoService,
  ) { }

  private apiEndPoint: string =  environment.EndPoint.apiEmdAuth + environment.EndPoint.apiAuthVersion + '/auth';

  /**
   * 認証切れ処理
   * @returns
   */
  public authenticationExpired() {
    const authUser = this.cognito.initAuthenticated();
    if(authUser == null) {
      console.log('認証解除済')
      // 重複で処理が行われる可能性もありその場合処理終了
      return;
    }
    // リクエストボディ生成
    const body = {
      "userId": authUser
    };
    this.http.post<boolean>(this.apiEndPoint + '/logout', body).subscribe(data => {
      console.log(data+':認証解除済')
      this.cognito.logout();
    })
  }

}
