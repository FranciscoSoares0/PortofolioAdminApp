import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpBackend  } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private httpRaw: HttpClient;
  private readonly uploadPreset = environment.CLOUDINARY_UPLOAD_PRESET;
  private readonly uploadUrl = environment.CLOUDINARY_URL;

  constructor(private handler: HttpBackend) { 
    this.httpRaw = new HttpClient(handler);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.httpRaw.post(this.uploadUrl, formData);
  }

  uploadImages(files: File[]): Observable<string[]> {
    return forkJoin(files.map(file =>
      this.uploadImage(file).pipe(
        map((res: any) => res.secure_url)
      )
    ));
  }
}
