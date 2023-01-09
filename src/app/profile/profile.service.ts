import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _http: HttpClient) { }

  getPosts(email) {
    return this._http.post('/api/profile', email).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }

  updateUserData(data, old_email, counts) {
    return this._http.post('/api/update', [data, old_email, counts]).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }

}
