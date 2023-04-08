import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResetService {

  constructor(private _http: HttpClient) { }

  sendEmail(data) {
    return this._http.post('/api/reset', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }

  checkCode(data) {
    return this._http.post('/api/code', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }

}
