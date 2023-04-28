import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  constructor(private _http: HttpClient) {}

  pay(data) {
    return this._http.post('/api/tbcpayment', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }
}
