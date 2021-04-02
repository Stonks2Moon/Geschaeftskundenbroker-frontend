import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient,) { }

  public getAllMetaData() {
    return this.http.get(`${this.apiUrl}meta`)
      .pipe(
        tap(
          (data) => {
            return data;
          },
          (error) => {
            return error;
          }
        )
      );
  }
}
