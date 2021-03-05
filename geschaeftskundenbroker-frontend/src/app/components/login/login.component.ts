import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ControlsMap } from 'src/app/logic/data-models/data-models';
import { AuthenticationService } from 'src/app/logic/services/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      // check: [false]
    });
  }

  private get loginValue(): ControlsMap<AbstractControl> {
    return this.loginForm.controls;
  }

  public onLoginSubmit(): void {
    this.loading = true;
    this.authenticationService.signInWithEmailAndPassword(this.loginValue).subscribe(
      (data) => {
        this.router.navigate(['/home']);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

}
