import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {takeUntil} from "rxjs/operators";
import {AbstractComponent} from "../abstract.component";
import {Router} from "@angular/router";
import {FormUtils} from "../utils/FormUtils";
import {MaterialService} from "../shared/services/material.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent extends AbstractComponent implements OnInit {
  public form: FormGroup;
  public FormUtils = FormUtils;

  constructor(private authService: AuthService,
              private router: Router) {
    super();
  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  public onSubmit() {
    this.form.disable();
    this.authService.register(this.form.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.router.navigate(['/login'], {queryParams: {registered: true}}),
        error => {
          MaterialService.toast(error?.error?.message);
          this.form.enable();
        });
  }

  public getErrorMessage(formControlName: string): string | null {
    const formControl = this.form.get(formControlName);
    if (!formControl) return null;
    const errors = formControl.errors;
    if (!errors) return null;

    switch (formControlName) {
      case 'email':
        return this.getEmailErrorMessage(errors);
      case 'password':
        return this.getPasswordErrorMessage(errors);
      default:
        return null;
    }
  }

  private getEmailErrorMessage(errors: ValidationErrors): string | null {
    if (errors.required) {
      return 'Field should not be empty';
    }

    if (errors.email) {
      return 'Please enter correct email address';
    }
    return null;
  }

  private getPasswordErrorMessage(errors: ValidationErrors): string | null {
    if (errors.required) {
      return 'Field should not be empty';
    }

    if (errors.minlength && errors.minlength.requiredLength) {
      return `Password should have more than ${errors?.minlength?.requiredLength} symbols.
              Currently ${errors?.minlength?.actualLength}`
    }
    return null;
  }
}
