import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ControlsMap } from 'src/app/logic/data-models/data-models';
import { AuthenticationService } from 'src/app/logic/services/authentication.service';

declare var UIkit: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public hide: boolean = true;
  public error: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  public hidePassword(event: any): void {
    this.hide = !this.hide;
    event.preventDefault();
  }

  public get loginValue(): ControlsMap<AbstractControl> {
    return this.loginForm.controls;
  }

  public onLoginSubmit(): void {
    this.authenticationService.signInWithEmailAndPassword(this.loginValue).subscribe(
      (data) => {
        this.router.navigate(['/home']);
        this.error = false;
      },
      (error) => {
        this.error = true;
      }
    );
  }

}
