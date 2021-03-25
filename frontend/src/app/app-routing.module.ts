import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepotComponent } from './components/depot/depot.component';
import { DepotDetailComponent } from './components/depot-detail/depot-detail.component';
import { HistoryComponent } from './components/history/history.component';
import { HomeComponent } from './components/home/home.component';
import { BuyComponent } from './components/buy/buy.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { TradeComponent } from './components/trade/trade.component';
import { AuthenticationGuard } from './logic/guard/authentication.guard';
import { ShareComponent } from './components/share/share.component';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [AuthenticationGuard],
    component: LoginComponent
  },
  {
    path: 'register',
    canActivate: [AuthenticationGuard],
    component: RegisterComponent
  },
  {
    path: 'home',
    canActivate: [AuthenticationGuard],
    component: HomeComponent
  },
  {
    path: 'trade',
    canActivate: [AuthenticationGuard],
    component: TradeComponent
  },
  {
    path: 'depot',
    canActivate: [AuthenticationGuard],
    component: DepotComponent
  },
  {
    path: 'depot-detail/:depotId',
    canActivate: [AuthenticationGuard],
    component: DepotDetailComponent
  },
  {
    path: 'history',
    canActivate: [AuthenticationGuard],
    component: HistoryComponent
  },
  {
    path: 'profile',
    canActivate: [AuthenticationGuard],
    component: ProfileComponent
  },
  {
    path: 'buy/:shareId',
    canActivate: [AuthenticationGuard],
    component: BuyComponent
  },
  {
    path: 'share/:shareId',
    canActivate: [AuthenticationGuard],
    component: ShareComponent
  },
  {
    path: '',
    canActivate: [AuthenticationGuard],
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
