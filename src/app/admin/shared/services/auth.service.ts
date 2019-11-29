import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { User, FbAuthResponse } from "src/app/shared/interfaces";
import { Observable, throwError, Subject } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class AuthService {
  public error$: Subject<string> = new Subject<string>();
  private url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`;
  private signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`;

  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem("fb-token-exp"));
    if (expDate < new Date()) {
      this.logout();
      return null;
    }

    return localStorage.getItem("fb-token");
  }

  login(user: User): Observable<any> {
    return this.http
      .post(this.url, user)
      .pipe(tap(this.setToken), catchError(this.handleError.bind(this)));
  }

  register(user: User): Observable<any> {
    return this.http.post(this.signUpUrl, user);
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    const { message } = error.error.error;

    switch (message) {
      case "INVALID_EMAIL":
        this.error$.next("INVALID_EMAIL".toLowerCase());
        break;
      case "INVALID_PASSWORD":
        this.error$.next("INVALID_PASSWORD".toLowerCase());
        break;
      case "EMAIL_NOT_FOUND":
        this.error$.next("EMAIL_NOT_FOUND".toLowerCase());
        break;
    }

    return throwError(error);
  }

  private setToken(response: FbAuthResponse | null) {
    if (response) {
      const expDate = new Date(
        new Date().getTime() + +response.expiresIn * 1000
      );
      localStorage.setItem("fb-token", response.idToken);
      localStorage.setItem("fb-token-exp", expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
