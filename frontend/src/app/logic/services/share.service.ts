import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HistoricalData } from '../data-models/data-models';
import { Share } from '../data-models/share.model';
import { Statistics } from '../data-models/statistics.model';

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

  public getShareById(shareId: string): Observable<Share> {
    return this.http.get<Share>(`${this.apiUrl}share/${shareId}`)
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

  public getStatisticsById(shareId: string): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}share/statistics/${shareId}`)
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


  public getShareHistory(query: { shareId: string, fromDate: Date, toDate: Date }): Observable<HistoricalData> {

    let urlEnd: string = '';

    if (query.shareId) {
      urlEnd += `shareId=${query.shareId}&`;
    }

    if (query.fromDate) {
      urlEnd += `fromDate=${query.fromDate.toISOString()}&`;
    }

    if (query.toDate) {
      urlEnd += `toDate=${query.toDate.toISOString()}`;
    }

    return this.http.get<HistoricalData>(`${this.apiUrl}share/historical-data?${urlEnd}`)
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
