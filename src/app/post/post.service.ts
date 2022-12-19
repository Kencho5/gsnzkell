import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private _http: HttpClient
  ) { }

  getPostData(data) {
    return this._http.post('/api/post', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }

  getUserID(data) {
    return this._http.post('/api/profile', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }
}
