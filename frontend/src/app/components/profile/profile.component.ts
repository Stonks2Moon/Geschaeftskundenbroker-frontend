import { Component, OnInit } from '@angular/core';
import { Customer, Company} from 'src/app/logic/data-models/data-models';
import { AuthenticationService } from 'src/app/logic/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public currentCustomer: Customer;

  constructor(
    private authenticationService: AuthenticationService,

  ) { 
    this.authenticationService.currentCustomer.subscribe(customer => this.currentCustomer = customer);

  }

  ngOnInit(): void {
  }
}
