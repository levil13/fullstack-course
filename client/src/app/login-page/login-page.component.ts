import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {FormUtils} from "../utils/FormUtils";
import {AuthService} from "../shared/services/auth.service";
import {AbstractComponent} from "../abstract.component";
import {takeUntil} from "rxjs/operators";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/services/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent extends AbstractComponent implements OnInit, OnDestroy {

  public FormUtils = FormUtils;
  public form: FormGroup;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: Params) => {
        if (params.registered) {
          MaterialService.toast('User created. You can login now');
          return;
        }

        if (params.accessDenied) {
          MaterialService.toast('You need to create an account to access this page');
          return;
        }

        if (params.sessionExpired) {
          MaterialService.toast('Session expired. Please log in again');
          return;
        }
      })
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  public onSubmit(): void {
    this.form.disable();

    this.authService.login(this.form.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.router.navigate(['/overview']),
        error => {
          MaterialService.toast(error?.error?.message);
          this.form.enable();
        }
      );
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
