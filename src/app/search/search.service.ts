import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private _http: HttpClient
  ) { }

  searchPost(data) {
    return this._http.post('/api/search', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      }));
  }
}
