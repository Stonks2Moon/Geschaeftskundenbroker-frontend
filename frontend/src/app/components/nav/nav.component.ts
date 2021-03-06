import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/logic/data-models/data-models';
import { AuthenticationService } from 'src/app/logic/services/authentication.service';
import { ShareService } from 'src/app/logic/services/share.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public currentCustomer: Customer;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {

    this.authenticationService.currentCustomer.subscribe(customer => this.currentCustomer = customer);
  }

  ngOnInit(): void {
  }

  public onSearchPressed(query: string): void {
    this.router.navigate(['search', query]);

  }

  public onLogoutPressed(): void {
    this.authenticationService.signOut();
    this.router.navigate(['']);
  }

}
