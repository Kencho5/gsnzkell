import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UploadFormService {
  constructor(private _http: HttpClient) {}

  uploadPost(data) {
    return this._http.post(`/api/upload/${uuidv4()}`, data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }
}
