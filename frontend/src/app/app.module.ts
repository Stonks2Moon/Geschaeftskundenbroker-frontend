import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { TradeComponent } from './components/trade/trade.component';
import { DepotComponent } from './components/depot/depot.component';
import { ProfileComponent } from './components/profile/profile.component';

import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgxEchartsModule } from 'ngx-echarts';
import { BuyComponent } from './components/buy/buy.component';
import { ShareComponent } from './components/share/share.component';
import { DepotDetailComponent } from './components/depot-detail/depot-detail.component';
import { SearchComponent } from './components/search/search.component';
import { SellComponent } from './components/sell/sell.component';
import { RemoveCommaPipe } from './remove-comma.pipe';
import { ShareDepotOverviewComponent } from './components/_sub-components/share-depot-overview/share-depot-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    TradeComponent,
    DepotComponent,
    ProfileComponent,
    BuyComponent,
    ShareComponent,
    DepotDetailComponent,
    SearchComponent,
    SellComponent,
    RemoveCommaPipe,
    ShareDepotOverviewComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2FlatpickrModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
