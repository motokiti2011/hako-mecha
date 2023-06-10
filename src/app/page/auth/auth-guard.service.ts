import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
// import {AuthService} from "./authUser.service";
import { AuthUserService } from './authUser.service';
import {catchError, distinct, map, switchMap, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private auth: AuthUserService,
    private http: HttpClient,
    private router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.userInfo$.pipe(
      distinct(),
      switchMap((userOrNull)=>{
        if(userOrNull === null){
          // AuthService にデータが入っていないとき  
          return this.http.get<{user:any}>("/api/profile").pipe(
            catchError(()=>of({user:null})),
            map((result) => result.user)
          )
        }else{
          // AuthService にデータが入っているとき
          return of(userOrNull)
        }
      }),
      tap(async (userOrNull)=>{
        // データが存在する場合、AuthService のデータを更新 
        this.auth.login(userOrNull)
      }),
      switchMap((userOrNull) => {
        if(userOrNull === null){
          // 認証失敗  
          return of(this.router.parseUrl(`/cookie/login?redirect_to=${state.url}`))
        }else{
          // 認証失敗  
          return of(true)
        }
      }),
    )
  }
}
