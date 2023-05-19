import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private _http: HttpClient) {}

  getPosts(data) {
    return this._http.post('/api/profile', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }

  updateUserData(data, old_email, pfp, id, balance) {
    return this._http
      .post('/api/update', {
        data: data,
        old_email: old_email,
        pfp: pfp,
        id: id,
        balance: balance,
        token: localStorage.getItem('token')
      })
      .pipe(
        map((res: HttpResponse<Response>) => {
          return res;
        })
      );
  }

  updatePostData(data) {
    return this._http.post('/api/editPost', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }

  deletePost(data) {
    return this._http.post('/api/delete', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }

  buyVip(data) {
    return this._http.post('/api/buyVip', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }

  renewPost(data) {
    return this._http.post('/api/renew', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }
}
