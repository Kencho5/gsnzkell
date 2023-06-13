import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadFormService {
  constructor(private _http: HttpClient) {}

  uploadPost(data) {
    return this._http.post('/api/upload', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }
}
