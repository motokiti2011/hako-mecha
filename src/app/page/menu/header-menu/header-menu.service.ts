import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HeaderMenuService {

  authenticated = false;

  constructor(private http: HttpClient) {
  }


}
