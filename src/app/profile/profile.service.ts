import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _http: HttpClient) { }

  getProfile(token) {
    return this._http.post('/api/profile', token).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }

  updateUserData(data, type, email) {
    return this._http.post('/api/update', [data, type, email]).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }

}
