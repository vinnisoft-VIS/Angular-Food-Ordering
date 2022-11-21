import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl= environment.BASE_URL;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('denisAuthToken');
    return (authToken !== null) ? true : false;
  };

  login(payload: object): Observable<any> {
    return this.http.post(`${this.baseUrl}/adminlogin`, payload)
      .pipe(catchError(this.handleError));
  }

  logout(): Promise<any> {
    localStorage.removeItem("denisAuthToken");
    return this.router.navigate(['/login']);
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error || "Server Error"));
  };
}
