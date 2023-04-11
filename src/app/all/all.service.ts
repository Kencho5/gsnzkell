import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AllService {
  constructor(private _http: HttpClient) {}

  getPosts(data) {
    return this._http.post('/api/all', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }
}
