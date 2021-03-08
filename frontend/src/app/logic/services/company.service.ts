import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Company } from '../data-models/data-models';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient) { }


  public getAllCompanies(): Observable<Array<Company>> {

    return this.http.get<Array<Company>>(`${this.apiUrl}company/all`)
      .pipe(
        tap(
          (data) => {
            console.log(data);
            return data;
          },
          (error) => {
            console.log(error);
          }
        )
      );
  }
}