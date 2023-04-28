import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaymentStatusService {
  constructor(private _http: HttpClient) {}

  checkStatus(data) {
    return this._http.post('/api/paymentstatus', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }
}
