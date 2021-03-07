import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/logic/services/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  public onLogoutPressed(): void {
    this.authenticationService.signOut();
    this.router.navigate(['']);
  }

}
