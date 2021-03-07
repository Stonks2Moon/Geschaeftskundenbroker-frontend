import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ControlsMap } from 'src/app/logic/data-models/data-models';

import { AuthenticationService } from 'src/app/logic/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public hide: boolean = true;
  public loading: boolean = false;


  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      companyCode: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  public hidePassword(event: any): void {
    this.hide = !this.hide;
    event.preventDefault();
  }

  public get registerValue(): ControlsMap<AbstractControl> {
    return this.registerForm.controls;
  }

  public onRegisterSubmit(): void {
    this.loading = true;
    this.authenticationService.signUp(this.registerValue).subscribe(
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
