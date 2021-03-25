import { Component } from '@angular/core';
import { Customer } from './logic/data-models/data-models';
import { AuthenticationService } from './logic/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Geschäftskkundenbroker';
  public currentCustomer: Customer;

  public constructor(private authenticationService: AuthenticationService,) {
    this.authenticationService.currentCustomer.subscribe(customer => this.currentCustomer = customer);
  }

}
