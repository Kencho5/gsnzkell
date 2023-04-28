import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { UserModel } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  user: UserModel;

  get token(): any {
    return localStorage.getItem('token');
  }

  constructor(private _http: HttpClient) {
    this._isLoggedIn$.next(!!this.token);
    this.user = this.getUser(this.token);
  }

  getLoginData(data) {
    return this._http.post('/api/login', data).pipe(
      map((res: HttpResponse<Response>) => {
        if(res.status == 500) {
          return res;
        }
        this.user = this.getUser(res['token']);
        this._isLoggedIn$.next(true);

        return res;
      })
    );
  }

  private getUser(token: string): UserModel {
    if (!token) {
      return null;
    }

    return jwt_decode(token) as UserModel;
  }
}
