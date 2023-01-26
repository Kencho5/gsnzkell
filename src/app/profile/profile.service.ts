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

  updateUserData(data, old_email, pfp, id, pfpSet) {
    return this._http.post('/api/update', {data: data, old_email: old_email, pfp: pfp, id: id, pfpSet: pfpSet}).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }

    deletePost(data) {
    return this._http.post('/api/delete', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }


}
