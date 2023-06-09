import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { loginUser } from 'src/app/entity/loginUser';
import { CognitoService } from './cognito.service';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  private _userInfo$

  constructor(
    private cognito: CognitoService,
  ) {
    this._userInfo$ = new BehaviorSubject<loginUser | null>(null)
  }

  get userInfo$() {
    return this._userInfo$.asObservable()
  }

  login(userInfo: loginUser) {
    this._userInfo$.next(userInfo)
  }

  logout() {
    this.cognito.logout();
    this._userInfo$.next(null)
  }
}
