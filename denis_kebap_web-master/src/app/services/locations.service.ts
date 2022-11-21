import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  baseUrl = environment.BASE_URL;

  constructor(
    private http: HttpClient
  ) { }

  getLocations(userId: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/locationlists`, userId)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error || "Server Error"));
  };

}
