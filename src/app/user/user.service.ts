import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}

  getProfileData(data) {
    return this._http.post('/api/user', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }

  getPosts(data) {
    return this._http.post('/api/userPosts', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }
}
