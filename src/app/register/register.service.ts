import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private _http: HttpClient) {}

  insertRegisterData(data) {
    return this._http.post('/api/register', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }
}
