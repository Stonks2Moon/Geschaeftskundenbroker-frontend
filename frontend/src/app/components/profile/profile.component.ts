import { Component, OnInit } from '@angular/core';
import { Customer, Company, StockExchangePricing} from 'src/app/logic/data-models/data-models';
import { AuthenticationService } from 'src/app/logic/services/authentication.service';
import { MetaService } from 'src/app/logic/services/meta.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public currentCustomer: Customer;
  public metaPricing: StockExchangePricing;

  constructor(
    private authenticationService: AuthenticationService,
    private metaService: MetaService,
  ) { 
    this.authenticationService.currentCustomer.subscribe(customer => this.currentCustomer = customer);
  }

  ngOnInit(): void {
    this.metaService.getMetaPricing().subscribe(metaPricing => { console.log(metaPricing);this.metaPricing = metaPricing });
  }



}
