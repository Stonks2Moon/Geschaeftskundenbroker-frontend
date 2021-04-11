import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TradeComponent } from './components/trade/trade.component';
import { DepotComponent } from './components/depot/depot.component';
import { ProfileComponent } from './components/profile/profile.component';

import { ShareComponent } from './components/share/share.component';
import { DepotDetailComponent } from './components/depot-detail/depot-detail.component';
import { SearchComponent } from './components/search/search.component';
import { RemoveCommaPipe } from './remove-comma.pipe';
import { ShareDepotOverviewComponent } from './components/_sub-components/share-depot-overview/share-depot-overview.component';
import { BuySellComponent } from './components/buy-sell/buy-sell.component';




@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    TradeComponent,
    DepotComponent,
    ProfileComponent,
    ShareComponent,
    DepotDetailComponent,
    SearchComponent,
    RemoveCommaPipe,
    ShareDepotOverviewComponent,
    BuySellComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
