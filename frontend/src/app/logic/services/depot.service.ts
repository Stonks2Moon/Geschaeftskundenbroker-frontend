import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ControlsMap, CreateDepot, CustomerSession, Depot, PlaceOrder, PlaceShareOrder } from '../data-models/data-models';

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

  public getDepotById(depotId: string): Observable<Depot> {
    if (this.cookieService.check('session')) {
      const session: CustomerSession = JSON.parse(this.cookieService.get('session'));
      return this.http.post<Depot>(`${this.apiUrl}depot/show/${depotId}`, session)
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

  public createDepot(depotValue: ControlsMap<AbstractControl>): Observable<Depot> {
    if (this.cookieService.check('session')) {
      const session: CustomerSession = JSON.parse(this.cookieService.get('session'));

      const createDepot: CreateDepot = { session: session, name: depotValue.depotName.value, description: depotValue.depotDescription.value };
      console.log(createDepot);
      return this.http.put<Depot>(`${this.apiUrl}depot`, createDepot)
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

  public createOrder(order: PlaceShareOrder, tradeAlgorithm?: number): Observable<Depot> {    
    if (this.cookieService.check('session')) {
      const session: CustomerSession = JSON.parse(this.cookieService.get('session'));

      const placeOrder: PlaceOrder = { customreSession: session, order: order, tradeAlgorithm: tradeAlgorithm ?? 0 };

      return this.http.put<Depot>(`${this.apiUrl}depot/order`, placeOrder)
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
