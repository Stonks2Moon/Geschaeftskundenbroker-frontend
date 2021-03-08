import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Share } from '../data-models/share.model';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient) { }

  public getAllShares(query: { wkn?: string, isin?: string, shareName?: string, limit?: number, search?: string }): Observable<Array<Share>> {

    let urlEnd: string = '';

    if (query.wkn) {
      urlEnd += `wkn=${query.wkn}&`;
    }

    if (query.isin) {
      urlEnd += `isin=${query.isin}&`;
    }

    if (query.shareName) {
      urlEnd += `shareName=${query.shareName}&`;
    }

    if (query.limit) {
      urlEnd += `limit=${query.limit}&`;
    }

    if (query.search) {
      urlEnd += `search=${query.search}&`;
    }

    console.log(urlEnd);

    return this.http.get<Array<Share>>(`${this.apiUrl}share/all?${urlEnd}`)
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
