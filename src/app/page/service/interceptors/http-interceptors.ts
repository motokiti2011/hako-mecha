import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CognitoService } from '../../auth/cognito.service';

@Injectable({
  providedIn: 'root'
})
export class PostInterceptor implements HttpInterceptor {
  constructor(private cognito: CognitoService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //👇現在のIDトークンを取得
    const authHeader = this.cognito.getCurrentUserIdToken();
    if(authHeader !== null) {
      //👇オリジナルのリクエストヘッダーを複製し、IDトークンを追加したものに差替え
      const authReq = req.clone({
        headers: req.headers.set('Authorization', authHeader)
      });
      //👇変形したリクエストとして送信側へ流す
      return next.handle(authReq);
    } else {
      //👇未認証状態でのトークンヘッダー付与はしない
      return next.handle(req);
    }
  }
}

export const POST_PROVIDER = {
  provide: HTTP_INTERCEPTORS,
  useClass: PostInterceptor,
  multi: true
};
