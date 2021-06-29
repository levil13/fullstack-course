import {Injectable} from "@angular/core";
import {User} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({providedIn: "root"})
export class AuthService {
  private _token: string | null;

  public get token(): string | null {
    return this._token;
  }

  public set token(token: string | null) {
    this._token = token;
  }

  constructor(private http: HttpClient) {
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user);
  }

  public login(user: User): Observable<string> {
    return this.http.post<string>('/api/auth/login', user)
      .pipe(tap((token) => {
        localStorage.setItem('auth-token', token);
        this.token = token;
      }));
  }

  public logout(): void {
    this.token = null;
    localStorage.clear();
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }
}
