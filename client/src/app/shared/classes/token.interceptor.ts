import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({providedIn: "root"})
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
              private router: Router) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated()) {
      req = req.clone({setHeaders: {Authorization: this.authService.token as string}});
    }
    return next.handle(req)
      .pipe(catchError((error: HttpErrorResponse) => this.handleAuthError(error)));
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.router.navigate(['/login'], {
        queryParams: {sessionExpired: true}
      });
    }

    return throwError(error);
  }
}
