import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { loginUser } from 'src/app/entity/loginUser';

@Injectable({
  providedIn: 'root'
})
export class HeaderMenuService {

  authenticated = false;

  constructor(private http: HttpClient) {
  }


}
