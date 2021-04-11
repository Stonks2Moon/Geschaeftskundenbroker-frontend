import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ControlsMap, CreateDepot, CustomerSession, Depot, JobWrapper, LpCancel, LpPosition, LpRegister, PlaceOrder, PlaceShareOrder, ReturnShareOrder } from '../data-models/data-models';

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

      const placeOrder: PlaceOrder = { customerSession: session, order: order, tradeAlgorithm: tradeAlgorithm ?? 0 };

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


  public getCompletedOrdersByDepotIdAndSession(depotId: string): Observable<Array<ReturnShareOrder>> {
    if (this.cookieService.check('session')) {
      const session: CustomerSession = JSON.parse(this.cookieService.get('session'));

      return this.http.post<Array<ReturnShareOrder>>(`${this.apiUrl}depot/order/completed/${depotId}`, session)
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

  public getPendingOrdersByDepotIdAndSession(depotId: string): Observable<Array<JobWrapper>> {
    if (this.cookieService.check('session')) {
      const session: CustomerSession = JSON.parse(this.cookieService.get('session'));

      return this.http.post<Array<JobWrapper>>(`${this.apiUrl}depot/order/pending/${depotId}`, session)
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

  public deleteOrderBySession(orderId: string): Observable<PlaceShareOrder> {
    if (this.cookieService.check('session')) {
      const session: CustomerSession = JSON.parse(this.cookieService.get('session'));

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: session,
      };

      console.log(options)

      return this.http.delete<PlaceShareOrder>(`${this.apiUrl}depot/order/${orderId}`, options)
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

  public registerAsLp(depotId: string, shareId: string, lqQuote: number): Observable<LpPosition> {
    if (this.cookieService.check('session')) {
      const session: CustomerSession = JSON.parse(this.cookieService.get('session'));

      let register: LpRegister = {
        depotId: depotId,
        customerSession: session,
        shareId: shareId,
        lqQuote: lqQuote,
      }

      return this.http.post<LpPosition>(`${this.apiUrl}depot/lp/register`, register)
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

  public cancelLp(lpId: number): Observable<LpPosition> {
    if (this.cookieService.check('session')) {
      const session: CustomerSession = JSON.parse(this.cookieService.get('session'));

      let cancel: LpCancel = {
        lpId: lpId,
        customerSession: session,
      }

      return this.http.post<LpPosition>(`${this.apiUrl}depot/lp/cancel`, cancel)
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

  public getLpBy(depotId: string): Observable<Array<LpPosition>> {
    if (this.cookieService.check('session')) {
      const session: CustomerSession = JSON.parse(this.cookieService.get('session'));

      return this.http.post<Array<LpPosition>>(`${this.apiUrl}depot/lp/show/${depotId}`, session)
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
