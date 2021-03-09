import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomerSession, Depot } from '../data-models/data-models';

@Injectable({
  providedIn: 'root'
})
export class DepotService {
  private apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  public getAllDepotsBySession(): Observable<Array<Depot>> {

    if (this.cookieService.check('session')) {
      const session: CustomerSession = JSON.parse(this.cookieService.get('session'));
      return this.http.post<Array<Depot>>(`${this.apiUrl}depot/all`, session)
        .pipe(
          tap(
            (data) => {
              return data;
            },
            (error) => {
              console.log(error);
              return error;
            }
          )
        )
    } else {
      console.log('Nicht angemeldet');
      return null;
    }
  }
}
