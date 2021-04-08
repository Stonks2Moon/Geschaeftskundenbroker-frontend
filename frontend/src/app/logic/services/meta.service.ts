import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MetaConst } from '../data-models/data-models';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient,) { }

  public getAllMetaData(): Observable<MetaConst> {
    return this.http.get<MetaConst>(`${this.apiUrl}meta/const`)
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
