import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { loginUser } from 'src/app/entity/loginUser';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  private _userInfo$

  constructor() {
    this._userInfo$ = new BehaviorSubject<loginUser | null>(null)
  }

  get userInfo$() {
    return this._userInfo$.asObservable()
  }

  login(userInfo: loginUser) {
    this._userInfo$.next(userInfo)
  }

  logout() {
    this._userInfo$.next(null)
  }
}
