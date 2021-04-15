import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ControlsMap, Customer, CustomerSession, Login } from '../data-models/data-models';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public isLoggedIn: boolean = false;
  public currentCustomer: Observable<Customer>;

  private currentCustomerSubject: BehaviorSubject<Customer>;
  private apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.currentCustomerSubject = new BehaviorSubject<Customer>(null);
    this.currentCustomer = this.currentCustomerSubject.asObservable();
  }

  public signInWithEmailAndPassword(loginValue: ControlsMap<AbstractControl>): Observable<{ session: CustomerSession, customer: Customer }> {

    const login: Login = { email: loginValue.email.value, password: loginValue.password.value }

    return this.http.post<{ session: CustomerSession, customer: Customer }>(`${this.apiUrl}customer/login`, { login: login })
      .pipe(
        tap(
          (data) => {
            this.isLoggedIn = true;
            const session: CustomerSession = data.session;
            this.cookieService.set('session', JSON.stringify(session));
            this.currentCustomerSubject.next(data.customer);
            return data;
          },
          (error) => {
            return error;
          }
        )
      )
  }

  public signInWithSession(session: CustomerSession): Observable<{ session: CustomerSession, customer: Customer }> {

    return this.http.post<{ session: CustomerSession, customer: Customer }>(`${this.apiUrl}customer/login`, { session: session })
      .pipe(
        tap(
          (data) => {
            this.isLoggedIn = true;
            const session: CustomerSession = data.session;
            this.cookieService.set('session', JSON.stringify(session));
            this.currentCustomerSubject.next(data.customer);
            return data;
          },
          (error) => {
            console.log('Fehler');
          }
        )
      )
  }

  public signUp(registerValue: ControlsMap<AbstractControl>): Observable<{ session: CustomerSession, customer: Customer }> {

    const customer: Customer = { firstName: registerValue.firstName.value, lastName: registerValue.lastName.value, email: registerValue.email.value, password: registerValue.password.value, companyCode: registerValue.companyCode.value }

    return this.http.put<{ session: CustomerSession, customer: Customer }>(`${this.apiUrl}customer`, customer)
      .pipe(
        tap(
          (data) => {
            this.isLoggedIn = true;
            const session: CustomerSession = data.session;
            this.cookieService.set('session', JSON.stringify(session));
            this.currentCustomerSubject.next(data.customer);
            return data;
          },
          (error) => {
            console.log('Fehler');
          }
        )
      )
  }

  public signOut(): void {
    this.cookieService.delete('session');
    this.isLoggedIn = false;
    this.currentCustomerSubject.next(null);
  }

}
