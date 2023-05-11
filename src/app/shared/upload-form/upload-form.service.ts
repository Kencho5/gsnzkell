import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadFormService {
  constructor(private _http: HttpClient) {}

  private apiUrl = 'https://storage.bunnycdn.com/pender';

  uploadPost(data) {
    return this._http.post('/api/upload', data).pipe(
      map((res: HttpResponse<Response>) => {
        return res;
      })
    );
  }

  uploadImages(postID: string, images: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append(`images`, images[i], images[i].name);
    }
    formData.append('postID', postID);

    return this._http.post('/api/uploadImages', formData);
  }
}
