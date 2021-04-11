import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company, ControlsMap } from 'src/app/logic/data-models/data-models';

import { AuthenticationService } from 'src/app/logic/services/authentication.service';
import { CompanyService } from 'src/app/logic/services/company.service';

class ValueAndText {
  constructor(public Value: string, public Text: string) { }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public hide: boolean = true;
  public error: boolean = false;
  public companyArray: Array<Company>;

  titleArray: ValueAndText[] = [new ValueAndText("Mister", "Mister-Text"),
  new ValueAndText("Lord", "Lord-Text")];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private companyService: CompanyService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.companyService.getAllCompanies()
      .subscribe(companies => this.companyArray = companies);
  }

  public createForm(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      companyCode: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      vPassword: new FormControl('', [Validators.required, this.compareValidator('password')])
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
    this.authenticationService.signUp(this.registerValue).subscribe(
      (data) => {
        this.router.navigate(['/depot']);
        this.error = false;
      },
      (error) => {
        this.error = true;
      }
    );
  }


  private compareValidator(controlNameToCompare: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === null || control.value.lenght === 0) {
        return null;
      }
      const controlToCompare = control.root.get(controlNameToCompare);

      if (controlToCompare) {
        const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
          control.updateValueAndValidity();
          subscription.unsubscribe();
        });
      }
      return (controlToCompare && (controlToCompare.value !== control.value)) ? { compare: true } : null;
    };
  }

}