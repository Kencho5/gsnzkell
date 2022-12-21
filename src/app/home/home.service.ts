import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private _http: HttpClient
  ) { }

  latestPosts() {
    return this._http.post('/api/home', {}).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }

}
